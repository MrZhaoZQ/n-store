<template>
	<div id="content">
		<div class="top">
			<img v-on:click="$router.go(-1);" id="back" src="../../static/img/back.png"/>
			<img src="../../static/img/logo.png"/>
			<img v-on:click="$router.push('../search');" id="search" src="../../static/img/search.png"/>
		</div>
		<div class="container">
			<ul class="list">
				<li v-for="item in list" @click="toProd(item.prdNo)">
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
		
		<div id="cartBtn" @click="$router.push({name:'cart'});" :class="{hide: cartNum==0}">
			<div class="cartNum">{{cartNum}}</div>
			<img src="../../static/img/brand/gwc_big.png"/>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	import Common from "./../modules/Common.js";
	import Add2Cart from "./../modules/Add2Cart.js";
	export default{
		name: "More",
		data(){
			return {
				moreType: "",
				list: [],
				pageNum: 1,
				lastPage: 1,
				loadable: true,
				cartNum: 0,
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			getMorelist(_moreType){
				var qs = require('qs'),
					that = this;
				if(_moreType==0){
					var _data = {
						"type": "top",
						"pageNum": that.pageNum
					}
				}else{
					var _data = {
						"type": "classify",
						"classify_id": _moreType,
						"pageNum": that.pageNum
					}
				};
				
				that.$axios({
					url: 'api/api/Classify/getClassifyGood',
					method: 'post',
					responseType: 'json',
					data: qs.stringify(_data)
				}).then((res)=>{
					//console.log(res);
					if(res.data.errcode==1){
						var resData = res.data.result.data;
						if(resData.length>0){
							for (var i in resData) {
								that.list.push(resData[i])
							}
						}else{
							//更多列表空空如也
						}
						that.pageNum = res.data.result.current_page+1;
						that.lastPage = res.data.result.last_page;
						that.loadable = true;
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						}
					}
				}).catch((err)=>{
					
				});
			},
			toProd(prodId){
				this.$router.push({name: 'prod', params: {prodId: prodId}})
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
						this.getMorelist(this.moreType);
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
						that.cartNum = data.result.westoreCartCount;
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
			var _moreType = this.$route.params.type;
			this.getMorelist(_moreType);
			this.moreType = _moreType;
			var that = this;
			Common.getCartNum(function(data){
				//console.log(data);
				that.cartNum = data.result.count;
			});
			
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
#content .top {
  width: 100%;
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
}
#content .top #back {
  width: 13;
  height: 22px;
  padding: 10px 20px;
}
#content .top #search {
  width: 32;
  height: 42px;
  padding: 10px 20px;
}
#content .container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 80px;
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
</style>