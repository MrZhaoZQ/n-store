<template>
	<div id="content">
		<div class="searchTop">
			<div class="searchBox">
				<img class="searchImg" src="../../static/img/search/search.png"/>
				<form @submit.prevent action="#">
					<input ref="search_input" @keypress="submitFn($event)" v-model="keyWords" type="search" placeholder="输入关键字搜索" />
				</form>
				<img id="del_input" src="../../static/img/search/delete_1.png"/>
			</div>
			<div v-on:click="cancelFn" id="cancel">取消</div>
		</div>
		
		<div id="recommend" :class="{hide:HideRecommend}">
			<div class="history">
				<div class="titleBox">
					<div class="title">历史搜索</div>
					<img @click="deleteRecordsFn" id="delete" src="../../static/img/search/delete_2.png"/>
				</div>
				<ul class="historylist" :class="{hide:searchRecords.length==0}">
					<li v-for="item in searchRecords" @click="searchThisFn(item.key_word)">{{item.key_word}}</li>
				</ul>
			</div>
			<div class="hot">
				<div class="titleBox">
					<div class="title">热门搜索</div>
				</div>
				<ul class="hotlist">
					<li v-for="item in hotlist" @click="searchThisFn(item)">{{item}}</li>
				</ul>
			</div>
		</div>
		
		<div id="result" :style="{display: result_page}">
			<ul class="list" :style="{display: result_page}">
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
		
		<div id="empty" :style="{display: empty_page}">
			<div class="resultBox">
				<img src="../../static/img/search/empty.png"/>
			</div>
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
	export default {
		name: "Search",
		data(){
			return {
				searchRecords: [],
				hotlist: ["手工皂","潮人包包"],
				keyWords: '',
				goback: 1,
				list: [],
				pageNum: 1,
				lastPage: 1,
				loadable: true,
				HideRecommend: false,
				empty_page: "none",
				result_page: "none",
				cartNum: 0,
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			cancelFn(){
				if(this.goback == 1){
					this.$router.go(-1)
				}else{
					this.keyWords = '';
					this.HideRecommend = false;
					this.empty_page = "none";
					this.result_page = "none";
					this.goback = 1;
				}
			},
			searchFn(){
				if(this.keyWords=="" || !this.keyWords){
					return false;
				}
				if(this.pageNum==this.lastPage+1){
					return false;
				}
				var qs = require('qs'),
					that = this;
				console.log(that.pageNum,that.lastPage);
				that.$axios({
					url: 'api/api/Search/searchGoodOrBrand',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"type": 1, "keyWord": that.keyWords, "pageNum": that.pageNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						res.data.result.data.map(function(cv){
							that.list.push(cv)
						});
						that.pageNum = res.data.result.current_page+1;
						that.lastPage = res.data.result.last_page;
						that.loadable = true;
						that.HideRecommend = true;
						that.empty_page = "none";
						that.result_page = "flex";
					}else if(res.data.errcode==1018){//搜索结果为空
						that.HideRecommend = true;
						that.result_page = "none";
						that.empty_page = "block";
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						};
					}
				}).catch((err)=>{
					console.log(err)
				});
			},
			toProd(prodId){
				this.$router.push({name: 'prod', params: {prodId: prodId}})
			},
			submitFn(ev){
				var _keyWords = this.keyWords.trim();
				if(ev.keyCode==13){
					if(_keyWords.length > 0){
						this.$refs.search_input.blur();
						this.pageNum = 1;
						this.lastPage = 1;
						this.list = [];
						this.searchFn();
						this.goback = 0;
					}else{
						this.modal = {
							"show": true,
							"msg": "请输入需要搜索的商品名称!"
						}
					}
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
						this.searchFn();
						this.loadable = false;
					}
				}
			},
			getSearchRecords(){
				var qs = require('qs'),
					that = this;
				this.$axios({	//获取历史搜索记录
					url: 'api/api/Search/getSearchHistory',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.searchRecords = res.data.result
					}else if(res.data.errcode==1018){
						//历史记录为空
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
			deleteRecordsFn(){
				var qs = require('qs'),
					that = this;
				this.$axios({	//获取历史搜索记录
					url: 'api/api/Search/removeSearchHistory',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.searchRecords = []
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
			searchThisFn(_keyWords){
				this.keyWords = _keyWords;
				this.pageNum = 1;
				this.lastPage = 1;
				this.list = [];
				this.searchFn();
				this.goback = 0;
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
			this.getSearchRecords();
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
/*input[type=search] {
	-webkit-appearance: textfield;
	-webkit-box-sizing: content-box;
	font-family: inherit;
	font-size: 100%;
}*/
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
	display: none;
}
#content {
  width: 100%;
  background: #f6f6f6;
}
#content .searchTop {
  width: 100%;
  height: 80px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
}
#content .searchTop .searchBox {
  width: 540px;
  height: 60px;
  margin-right: 15px;
  box-sizing: border-box;
  border: 1px #dcdcdc solid;
  border-radius: 36px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .searchTop .searchBox .searchImg {
  width: 26px;
  height: 26px;
  padding: 10px 15px 10px 20px;
}
#content .searchTop .searchBox form {
  flex: 0.99;
}
#content .searchTop .searchBox form input {
  width: 100%;
  height: 100%;
  font-size: 26px;
}
#content .searchTop .searchBox #del_input {
  width: 26px;
  height: 26px;
  padding: 10px 20px 10px 15px;
  display: none;
}
#content #recommend {
  width: 100%;
  box-sizing: border-box;
  padding-top: 80px;
}
#content #recommend .titleBox {
  width: 100%;
  height: 44px;
  margin: 30px 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content #recommend .titleBox .title {
  padding-left: 20px;
}
#content #recommend .titleBox #delete {
  padding: 20px;
}
#content #recommend .history,
#content #recommend .hot {
  width: 100%;
}
#content #recommend .history ul,
#content #recommend .hot ul {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
#content #recommend .history ul li,
#content #recommend .hot ul li {
  height: 60px;
  padding: 0 20px;
  margin: 5px 10px 5px 0;
  border-radius: 36px;
  background: #dcdcdc;
  line-height: 60px;
  text-align: center;
}
#content #result {
  width: 100%;
  box-sizing: border-box;
  padding-top: 80px;
  display: none;
}
#content #result .list {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
#content #result .list li {
  width: 290px;
  height: 410px;
  box-sizing: border-box;
  padding: 0 10px;
  margin-bottom: 20px;
  background: #fff;
}
#content #result .list li .imgBox {
  width: 100%;
  height: 270px;
  margin: 10px 0;
}
#content #result .list li .imgBox img {
  width: 268px;
  height: 268px;
  border: 1px #dcdcdc solid;
}
#content #result .list li .name {
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
#content #result .list li .box {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #95262c;
}
#content #empty {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 80px;
  display: none;
}
#content #empty .resultBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>