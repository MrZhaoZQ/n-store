<template>
	<div id="content">
		<div id="empty" :style="{display: display_status}">
			<img src="../../static/img/collect/empty.png"/>
			<img id="browse" src="../../static/img/qgg.png"/>
		</div>
		
		<div class="container" :class="{hide:list.length<=0}">
			<ul class="list">
				<li v-for="item in list" @click="toProd(item.prdNo)">
					<img class="remove" @click.stop="removeFn(item.prdNo)" src="../../static/img/collect/close.png"/>
					<div class="imgBox">
						<img class="prodImg" :src="item.color_pic"/>
					</div>
					<div class="name">{{item.prdName}}</div>
					<div class="box">
						<div class="price">￥{{item.stdPrice}}</div>
						<img class="add2cart" @click.stop="add2cartFn(item.prdNo,$event)" src="../../static/img/gwc_1.png"/>
					</div>
				</li>
			</ul>
		</div>
		
		<div id="hidden" :class="{hide:!showTip}">
			<div id="popup">
				<div class="tipsBox">
					<div class="text">确定不感兴趣了？</div>
					<div class="tips">
						<img @click="confirmedByUserFn" :src="confirmedByUser?choosedSrc:unchoosedSrc"/>不再提醒
					</div>
					<div class="btns">
						<div @click="cancelRemove">取消</div>
						<div @click="confirmRemove">确认</div>
					</div>
				</div>
			</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	import Common from "./../modules/Common.js";
	import Add2Cart from "./../modules/Add2Cart.js";
	import ValuePass from "./../modules/ValuePass.js";
	export default {
		name: "Collect",
		data(){
			return {
				display_status: "none",
				list: [],
				pageNum: 1,
				lastPage: 1,
				loadable: true,
				removeId: "",
				confirmed: false,
				showTip: false,
				confirmedByUser: false,
				choosedSrc: require("../../static/img/collect/choose.png"),
				unchoosedSrc: require("../../static/img/collect/unchoose.png"),
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			getCollectlist(){
				var qs = require('qs'),
					that = this,
					_url = escape(window.location.href);
				that.$axios({
					url: 'api/api/Collection/getCollectionGoods',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"pageNum": that.pageNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						var resData = res.data.result.data;
						if(resData.length>0){
							for (var i in resData) {
								that.list.push(resData[i])
							}
						}else{
							//收藏夹空空如也
							that.display_status = "block"
						}
						that.pageNum = res.data.result.current_page+1;
						that.lastPage = res.data.result.last_page;
						that.loadable = true;
					}else if(res.data.errcode==-1001){	//"微信未授权"
						window.location.href = "http://brand.fugumobile.cn/nwestore/api/api/Oauth/oauthLogin?backurl="+_url;
					}else if(res.data.errcode==-1002){	//"用户未登陆"
						that.$router.push({path:"./login", query: {backUrl: _url}});
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						}
					}
				}).catch((err)=>{
					console.log(err)
				});
			},
			toProd(prodId){
				this.$router.push({name: 'prod', params: {prodId: prodId}})
			},
			doRemoveFn(removeId){
				var qs = require('qs'),
					that = this;
				that.$axios({
					url: 'api/api/Collection/removeGoodFromCollection',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"prdNo": removeId})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						for (var i in that.list) {
							if(that.list[i].prdNo==removeId){
								that.list.splice(i,1)
							}
						}
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						}
					}
				}).catch((err)=>{
					console.log(err)
				});
			},
			removeFn(removeId){
				var _confirmed = localStorage.getItem("confirmed");
				if(_confirmed=="true"){
					this.doRemoveFn(removeId);
				}else{
					this.showTip = true;
					this.removeId = removeId;
				}
			},
			cancelRemove(){
				this.showTip = false
			},
			confirmRemove(){
				this.doRemoveFn(this.removeId);
				this.showTip = false;
				if(this.confirmedByUser){
					localStorage.setItem("confirmed","true")
				}
			},
			confirmedByUserFn(){
				if(this.confirmedByUser){
					this.confirmedByUser = false
				}else{
					this.confirmedByUser = true
				}
			},
			scrollFn(){
				var de = document.documentElement;
				var	top = de.scrollTop,
					height = de.scrollHeight,
					h = de.offsetHeight;
				//console.log(top, height, h);
				if(top > height-h-200){
					//console.log("yes", this.pageNum, this.lastPage);
					if(this.pageNum == this.lastPage+1){
						//提示加载完毕
						
					}else if(this.loadable){
						//提示加载更多
						this.getCollectlist();
						this.loadable = false;
					}
				}
			},
			add2cartFn(prodId,e){
				var that = this;
				Add2Cart.add(prodId,function(data){
					//console.log(data);
					if(data.errcode==1){
						e.target.src = require("../../static/img/gwc_2.png");
						var _cartNum = data.result.westoreCartCount;
						ValuePass.$emit('myDefineEv', _cartNum);
					}else{
						that.modal = {
							"show": true,
							"msg": data.errmsg
						}
					}
				});
			}
		},
		mounted(){
			this.getCollectlist();
			window.addEventListener('scroll', this.scrollFn);
		},
		updated(){
			
		},
		destroyed(){
			window.removeEventListener('scroll', this.scrollFn);
		}
	};
</script>

<style scoped>
#content {
  width: 100%;
  background: #f6f6f6;
}
#content #empty {
  width: 100%;
  padding-top: 36%;
}
#content #empty img {
  display: block;
  margin: 0 auto;
}
#content #empty #browse {
  padding: 60px;
}
#content .container {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
}
#content .container .list {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
#content .container .list li {
  width: 290px;
  height: 410px;
  box-sizing: border-box;
  padding: 0 10px;
  margin-bottom: 20px;
  background: #fff;
  position: relative;
  left: 0;
  top: 0;
}
#content .container .list li .remove {
  padding: 20px;
  position: absolute;
  right: 0;
  top: 0;
}
#content .container .list li .imgBox {
  width: 100%;
  height: 270px;
  margin: 10px 0;
}
#content .container .list li .imgBox img {
  width: 268px;
  height: 268px;
  border: 1px #dcdcdc solid;
}
#content .container .list li .name {
  width: 100%;
  height: 60px;
  text-align: left;
  font-size: 22px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
#content .container .list li .box {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #95262c;
}
#hidden {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 266;
}
#popup {
  width: 560px;
  height: 310px;
  border-radius: 16px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  opacity: 1;
  background: #fff;
}
.tipsBox {
  width: 100%;
  height: 100%;
  font-size: 28px;
}
.tipsBox .text {
  height: 85px;
  line-height: 136px;
  text-align: center;
}
.tipsBox .tips {
  width: 100%;
  height: 45px;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tipsBox .tips img {
  margin-right: 10px;
}
.tipsBox .btns {
  width: 100%;
  height: 100px;
  box-sizing: border-box;
  border-top: 1px #ccc solid;
  display: flex;
}
.tipsBox .btns div {
  flex: 1;
  box-sizing: border-box;
  text-align: center;
  line-height: 100px;
}
.tipsBox .btns #cancel {
  border-right: 1px #ccc solid;
}
</style>