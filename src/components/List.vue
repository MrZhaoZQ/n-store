<template>
	<div id="content">
		<header>
			<img v-on:click="$router.go(-1);" id="back" src="../../static/img/list/back.png"/>
			<ul class="center">
				<li :class="{active:!showBrand}" @click="clickTypelist">
					<div ref="selected">全部品类</div>
					<img src="../../static/img/list/pull-down.png"/>					
				</li>
				<li :class="{active:showBrand}" @click="clickBrand">品牌</li>
			</ul>
			<img id="search" v-on:click="$router.push('/search');" src="../../static/img/list/search.png"/>
		</header>
		<ul id="typelist" :class="{hide: !showTypelist}">
			<li  @click="chooseType(0,'全部品类')">全部品类</li>
			<li v-for="item in typelist" @click="chooseType(item.id,item.name)">{{item.name}}</li>
		</ul>
		<div class="listContainer">
			<div id="classify" :class="{hide:showBrand}">
				<ul class="sorting">
					<li @click="sortFn('sale')">销量
						<img @click.stop="updownFn('sale')" :src="saleNum_ud==0?downSrc:upSrc"/>
					</li>
					<li @click="sortFn('updatedDate')">新品
						<img @click.stop="updownFn('updatedDate')" :src="new_ud==0?downSrc:upSrc"/>
					</li>
					<li @click="sortFn('stdPrice')">价格
						<img @click.stop="updownFn('stdPrice')" :src="price_ud==0?downSrc:upSrc"/>
					</li>
				</ul>
				<div class="container">
					<ul class="list">
						<li v-for="item in list_c" @click="toProd(item.prdNo)">
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
			</div>
			
			<div id="brand" ref="brand" :class="{hide:!showBrand}">
				<div class="sort_box">
					<slot v-for="(value, key) in list_b">
						<div class="sort_letter" :ref="key">{{key}}</div>
						<div v-for="item in value" class="sort_list" @click="toBrand(item.id)">
							<div class="brand_logo"><img :src="item.logo_url" /></div>
							<div class="brand_name">
								<div class="brand_name-title">{{item.brandName}}</div>
								<div class="brand_name-detail">{{item.detail}}</div>
							</div>
						</div>
					</slot>
				</div>
				<div class="letters">
					<ul>
						<li v-for="item in letters" @click="letterScroll(item)">{{item}}</li>
					</ul>
				</div>
				<div id="letter" ref="letterBox">{{letter}}</div>
			</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	import Common from "./../modules/Common.js";
	import Add2Cart from "./../modules/Add2Cart.js";
	import ValuePass from "./../modules/ValuePass.js";
	import SortByPY from "./../modules/SortByPY.js";
	export default {
		name: "List",
		data(){
			return {
				typelist: [],
				showTypelist: false,
				showBrand: false,
				list_c: [],
				pageNum_c: 1,	//当前请求的页码(classify)
				lastPage_c: 1,
				sorting: 0,     //是否排序
				updown: 0,      //0：降序，即由高到低或由新到旧； 1：升序
				saleNum_ud: 0,
				new_ud: 0,
				price_ud: 0,
				sortBy: "",		//"sale"、"updatedDate"、"stdPrice"
				downSrc: require('../../static/img/list/updown_2.png'),
				upSrc: require('../../static/img/list/updown_1.png'),
				list_b: {},
				pageNum_b: 1,	//当前请求的页码(brand)
				lastPage_b: 1,
				letter: "",
				letters: ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","#"],
				classifyId: 0,  //默认0：全部品类
				loadable: true,
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			clickTypelist(){
				if(this.showBrand){
					document.documentElement.scrollTop = 0;
					this.showBrand = false;
				}else{
					this.showTypelist = this.showTypelist?false:true;
				}
			},
			clickBrand(){
				document.documentElement.scrollTop = 0;
				this.showTypelist = false;
				this.showBrand = true;
			},
			chooseType(classifyId,classifyName){
				document.documentElement.scrollTop = 0;
				this.classifyId = classifyId;
				this.$refs.selected.innerHTML = classifyName;
				this.sorting = 0;    //取消排序
				this.pageNum_c = 1;    //更新pageNum_c
				this.lastPage_c = 1;
				this.showTypelist = false;
				this.showBrand = false;
				this.classifyListFn();    //get new classifylist
			},
			getTypeList(){
				var qs = require('qs'),
					that = this;
				that.$axios({
					url: 'api/api/Classify/getClassify',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.typelist = res.data.result;
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
			classifyListFn(sort){
				var type = this.classifyId==0?"all":"classify",
					qs = require('qs'),
					that = this;
				if(sort){
					var paramData = {
							"type": type,
							"classify_id": that.classifyId,
							"pageNum": that.pageNum_c,
							"order_by": that.sortBy,
							"order_type": that.updown
						};
				}else{
					var paramData = {
							"type": type,
							"classify_id": that.classifyId,
							"pageNum": that.pageNum_c
						};
				}
				that.$axios({
					url: 'api/api/Classify/getClassifyGood',
					method: 'post',
					responseType: 'json',
					data: qs.stringify(paramData)
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						var resData = res.data.result.data;
						if(resData.length>0){
							that.list_c = that.pageNum_c==1?[]:that.list_c;
							for (var i in resData) {
								that.list_c.push(resData[i])
							}
						}else{
							//该分类列表空空如也
						}
						that.pageNum_c = res.data.result.current_page+1;
						that.lastPage_c = res.data.result.last_page;
						that.loadable = true;
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
			scrollFn(){
				var de = document.documentElement;
				var	top = de.scrollTop,
					height = de.scrollHeight,
					h = de.offsetHeight;
				//console.log(top, height, h);
				if(top > height-h-200){
					//console.log("yes", this.pageNum_c, this.lastPage_c);
					if(this.pageNum_c == this.lastPage_c+1){
						//提示加载完毕
						
					}else if(this.loadable){
						//提示加载更多
						this.sorting==0?this.classifyListFn():this.classifyListFn("sort");
						this.loadable = false;
					}
				}
			},
			toProd(prodId){
				this.$router.push({name: 'prod', params: {prodId: prodId}});
			},
			sortFn(sortBy){
				this.sorting = 1;    //开始排序
				this.sortBy = sortBy;//排序方式
				this.updown = 0;     //updown恢复默认
				this.saleNum_ud = 0;
				this.new_ud = 0;
				this.price_ud = 0;
				this.pageNum_c = 1;    //更新pageNum_c
				this.lastPage_c = 1;
				this.classifyListFn("sort");
			},
			updownFn(sortBy){
				this.sorting = 1;    //开始排序
				this.sortBy = sortBy;//排序方式
				if(sortBy=='sale'){
					this.saleNum_ud = this.saleNum_ud==0?1:0;
					this.updown = this.saleNum_ud;
				}else if(sortBy=='updatedDate'){
					this.new_ud = this.new_ud==0?1:0;
					this.updown = this.new_ud;
				}else if(sortBy=='stdPrice'){
					this.price_ud = this.price_ud==0?1:0;
					this.updown = this.price_ud;
				}
				this.pageNum_c = 1;       //更新pageNum_c
				this.lastPage_c = 1;
				this.classifyListFn("sort");
			},
			getBrandList(){
				var qs = require('qs'),
					that = this;
				that.$axios({
					url: 'api/api/Brand/getBrand',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						var list = res.data.result,unicodes = SortByPY.chinese();
						that.list_b = SortByPY.sortArray(list,unicodes).data;
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
			letterScroll(letter){
				this.letter = letter;
				var de = document.documentElement,
					letterBox = this.$refs.letterBox,
					t = 0,
					st = de.scrollTop;
				letterBox.style.display = "block";
				letterBox.style.opacity = 1;
				setTimeout(function(){
					letterBox.style.opacity = 0;
					letterBox.style.display = "none";	
				},666);
				if(this.$refs[letter+""]){
					t = this.$refs[letter+""][0].offsetTop
					var speed = (t-st)/100,
						i = 0;
					var	timer = setInterval(function(){
						i++
						de.scrollTop = st+speed*i;
						if(i==100){
							clearInterval(timer)
						}
					},1);
				}
			},
			toBrand(brandId){
				this.$router.push({path: './brand', query: {brandId: brandId}});
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
		created(){
			var that = this;
			Common.checkLogin(function(data){
	      		//console.log(data);
	      		var _url = escape(window.location.href);
				if(data.errcode==1009){	 //已登录
					that.getBrandList();
					that.getTypeList();
					that.classifyListFn();
				}else if(data.errcode==-1001){	//"微信未授权"
					window.location.href = "http://brand.fugumobile.cn/nwestore/api/api/Oauth/oauthLogin?backurl="+_url;
				}else if(data.errcode==-1002){	//"用户未登陆"
					that.$router.push({path:"./login", query: {backUrl: _url}});
				}else{
					that.modal = {
						"show": true,
						"msg": data.errmsg
					}
				}
	      	});
		},
		mounted(){
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
#content{
  width: 100%;
  box-sizing: border-box;
  padding: 0 0 80px;
}
header {
  width: 100%;
  height: 60px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 66;
  background: #fff;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
header #back {
  width: 13px;
  height: 22px;
  padding: 15px 20px;
}
header .center {
  flex: 1;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
header .center li {
  width: 160px;
  height: 60px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 60px;
}
header .center li img {
  margin-left: 10px;
}
header .center .active {
  color: #95262C;
  border-bottom: 5px #95262C solid;
}
header #search {
  width: 32px;
  height: 42px;
  padding: 5px 20px;
}
#typelist {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 60px;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  color: #333;
}
#typelist li {
  width: 100%;
  height: 80px;
  text-align: center;
  line-height: 80px;
  background: #fff;
  box-sizing: border-box;
  border-bottom: 1px #d0d0d0 solid;
}
.listContainer {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 60px 0 0;
  background: #f6f6f6;
}
.listContainer #classify {
  width: 100%;
}
.listContainer #classify .sorting {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}
.listContainer #classify .sorting li {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.listContainer #classify .sorting li img {
  padding: 10px;
}
.listContainer #classify .container {
  width: 100%;
}
.listContainer #classify .container .list {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.listContainer #classify .container .list li {
  width: 290px;
  height: 410px;
  box-sizing: border-box;
  padding: 0 10px;
  margin-bottom: 20px;
  background: #fff;
}
.listContainer #classify .container .list li .imgBox {
  width: 100%;
  height: 270px;
  margin: 10px 0;
}
.listContainer #classify .container .list li .imgBox img {
  width: 268px;
  height: 268px;
  border: 1px #dcdcdc solid;
}
.listContainer #classify .container .list li .name {
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
.listContainer #classify .container .list li .box {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #95262c;
}
.listContainer #brand {
  width: 100%;
}
.listContainer #brand .sort_box {
  width: 100%;
  margin: 10px 0;
  position: relative;
  left: 0;
  top: 0;
}
.listContainer #brand .sort_box .sort_letter {
  width: 100%;
  height: 0;
  box-sizing: border-box;
  padding: 0 45px;
  background: #fff;
  opacity: 0;
}
.listContainer #brand .sort_box .sort_list {
  width: 100%;
  height: 140px;
  box-sizing: border-box;
  padding: 0 45px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
}
.listContainer #brand .sort_box .sort_list .brand_logo {
  width: 130px;
  height: 120px;
  margin-right: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.listContainer #brand .sort_box .sort_list .brand_logo img {
  width: 130px;
  height: 100px;
}
.listContainer #brand .sort_box .sort_list .brand_name {
  width: 380px;
  height: 120px;
  box-sizing: border-box;
  padding-right: 20px;
  text-align: left;
}
.listContainer #brand .sort_box .sort_list .brand_name .brand_name-title {
  font-size: 24px;
  margin-bottom: 15px;
}
.listContainer #brand .sort_box .sort_list .brand_name .brand_name-detail {
  font-size: 20px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  /** 对象作为伸缩盒子模型显示 **/
  -webkit-box-orient: vertical;
  /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2;
  /** 显示的行数 **/
  overflow: hidden;
  /** 隐藏超出的内容 **/
}
.listContainer #brand .letters {
  position: fixed;
  right: 0;
  top: 76px;
}
.listContainer #brand .letters ul li {
  padding: 2px 20px 2px 10px;
  line-height: 26px;
}
.listContainer #brand #letter {
  width: 200px;
  height: 200px;
  display: none;
  border-radius: 5px;
  background: rgba(145, 145, 145, 0.6);
  position: fixed;
  left: 50%;
  top: 50%;
  margin: -100px 0px 0px -100px;
  z-index: 99;
  font-size: 75px;
  color: #555;
  text-align: center;
  line-height: 200px;
  opacity: 0;
}
</style>