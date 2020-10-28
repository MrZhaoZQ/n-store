<template>
	<div id="content">
		<!--first section-->
		<div class="firstSec">
			<div class="top">
				<div v-on:click="goBack" class="back">
					<img src="../../static/img/list/back.png"/>
				</div>
				<img class="logo" src="../../static/img/logo.png"/>
			</div>
			<div class="swiper-container prodImg-swiper">
				<img @click="add2collection" id="collectBtn" :src="isCollected?collectedSrc:uncollectedSrc"/>
			    <div class="swiper-wrapper">
			        <div v-for="item in swiperlist" class="swiper-slide">
			        	<img :src="item"/>
			        </div>
			    </div>
			    <!-- 如果需要分页器 -->
			    <div class="swiper-pagination"></div>
			</div>
			<div class="prodInfo">
				<div class="prodName">{{prodData.prdName}}</div>
				<div class="priceBox">
					<p class="now">￥{{initinfo.stdPrice}}</p>
					<!--<p class="old">￥{{initinfo.proPrice}}</p>-->
					<!--<p class="trans">运费：￥<span class="trans_price">8.00</span></p>-->
				</div>
				<div class="discount">
					<!--<div class="discount_item"><p class="icon">满减</p><span class="context">全场满￥499减￥100</span></div>-->
					<div class="discount_item"><p class="icon">包邮</p><span class="context">江浙沪满￥228包邮</span></div>
				</div>
			</div>
			<div id="choose" v-on:click="chooseFn">
				<div>规格数量选择</div>
				<img src="../../static/img/mine/enter.png"/>
			</div>
		</div>
		
		<!--second section-->
		<div class="secondSec">
			<ul ref="the_tab_bar" class="tab-bar">
				<li v-on:click="tabId=0" :class="{active: tabId==0}">产品特征</li>
				<li v-on:click="tabId=1" :class="{active: tabId==1}">产品规格</li>
			</ul>
			<div v-show="tabId==0" class="tab-page descPage" v-html="descHtml"></div>
			<div v-show="tabId==1" class="tab-page sizePage">
				<ul class="list_size">
					<li><div>品牌</div><p class="desc_size">{{sizelist.brandName?sizelist.brandName:"----"}}</p></li>
					<li><div>颜色</div><p class="desc_size">{{sizelist.color?sizelist.color:"----"}}</p></li>
					<li><div>型号</div><p class="desc_size">{{sizelist.model?sizelist.model:"----"}}</p></li>
					<li><div>规格</div><p class="desc_size">{{sizelist.specifications?sizelist.specifications:"----"}}</p></li>
				</ul>
			</div>
		</div>
		
		<!--滑动到一定高度时的顶部按钮栏-->
		<div :style="{display: tab_bar_show}" id="top-bar">
			<ul class="tab-bar">
				<li v-on:click="tabId=0" :class="{active: tabId==0}">产品特征</li>
				<li v-on:click="tabId=1" :class="{active: tabId==1}">产品规格</li>
			</ul>
		</div>
		
		<!--底部按钮栏-->
		<div id="btns">
			<div id="serve" @click="showQRCode">
				<img src="../../static/img/prod/kf.png"/>
			</div>
			<div v-on:click="toCart" id="cart">
				<img src="../../static/img/prod/gwc.png"/>
				<div class="cartNum" :class="{hide: cartNum==0}">{{cartNum}}</div>
			</div>
			<div id="buy" @click="toOrder">立即购买</div>
			<div v-on:click="chooseFn" id="add2cart" class="able">加入购物车</div>
		</div>
		
		<div id="select" :style="{display: select_show}">
			<div class="top">
				<div  v-on:click="unChooseFn" class="back">
					<img src="../../static/img/list/back.png"/>
				</div>
				<img class="logo" src="../../static/img/logo.png"/>
			</div>
			<div class="showBox">
				<img class="showImg" :src="initinfo.color_img"/>
				<div class="center">
					<div class="showName">{{prodData.prdName}}</div>
					<div class="showPrice">
						<p class="show_now">￥{{initinfo.stdPrice}}.00</p>
						<!--<p class="show_old">￥{{initinfo.proPrice}}.00</p>-->
					</div>
					<div class="selectText">{{selectText}}</div>
					<div class="stock">库存：<span class="stockNum">{{initinfo.stock}}</span></div>
				</div>
				<img id="close" v-on:click="unChooseFn" src="../../static/img/prod/close.png"/>
			</div>
			<div class="mainBox">
				<div class="mainItem" :style="{display: color_show}">
					<div class="subtitle">颜色</div>
					<ul class="colorlist">
						<li v-on:click="chooseColorFn" v-for="item in listObj.color" :class="[item==choosedInfo[0]?'selected':'']">{{item}}</li>
					</ul>
				</div>
				<div class="mainItem" :style="{display: size_show}">
					<div class="subtitle">规格</div>
					<ul class="sizelist">
						<li v-on:click="chooseSizeFn" v-for="item in listObj.size" :class="[item==choosedInfo[1]?'selected':'']">{{item}}</li>
					</ul>
				</div>
				<div class="mainItem numBox">
					<div class="textBox">购买数量</div>
					<div class="optionBox">
						<span v-on:click="minusFn" id="minus" class="unable">-</span>
						<span id="num">{{num}}</span>
						<span v-on:click="plusFn" id="plus">+</span>
					</div>
				</div>
			</div>
			<div v-on:click="comfirmAddFn" id="confirmAdd">确认添加</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
		<div id="qrPopup" @click.self="hideQRCode" :style="{display: QRCode}">
			<img class="qrCode" src="../../static/img/qr.jpg"/>
			<div class="desc">识别二维码，联系客服</div>
		</div>
	</div>
</template>

<script>
	import Swiper from 'swiper';
	import Common from "./../modules/Common.js";
	import Weshare from "./../modules/Weshare.js";
	export default {
		name: 'Prod',
		data(){
			return {
				storeId: "100001",
				tabId: 0,
				prodData: {},
				collectedSrc: require("../../static/img/prod/gxq_2.png"),
				uncollectedSrc: require("../../static/img/prod/gxq_1.png"),
				descHtml: "",
				sizeHtml: "",
				sizelist: {},
				swiperlist: [],
				infolist: [],
				initinfo: {},
				isCollected: false,
				cartNum: 0,
				tab_bar_show: "none",
				select_show: "none",
				color_show: "block",
				size_show: "block",
				selectText: '请选择商品规格',
				listObj: {
					color: [],
					size: []
				},
				choosedInfo: [],	//用户选择的color、size;
				choosedId: "",
				num: 1,
				QRCode: "none",
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods:{
			initSwiper(){
				this.prodSwiper = new Swiper ('.prodImg-swiper', {
				    loop: true,
					pagination: '.swiper-pagination',
					autoplay: 2000,
  					autoplayDisableOnInteraction: false,
					observer:true, //修改swiper自己或子元素时，自动初始化swiper
					observeParents:true //修改swiper的父元素时，自动初始化swiper
				})
			},
			getProdData(storeId,prodId){
				var that = this,
					qs = require('qs');
				this.$axios({
					url: 'api/api/Goods/getGoodInfo',
					method: 'post',
					responseType: 'json',
					//data: new URLSearchParams({}),		//或者用qs.stringify()将参数序列化
					data: qs.stringify({'storeId': storeId, 'prdNo': prodId})
				}).then((res)=>{
					console.log(res.data);
					if(res.data.errcode==1){
						var _data = res.data.result;
						that.prodData = _data;
						that.descHtml = _data.desc_pic;
						that.sizeHtml = _data.good_type;
						that.sizelist = _data.specifications;
						that.swiperlist = _data.head_list;
						that.isCollected = _data.is_colleation;
						that.infolist = _data.color_info;
						that.initinfo = _data.color_info[0];
						that.choosedId = _data.color_info[0].prdNo;
						that.filterlist(that.infolist);
						that.setSelect(that.listObj, that.choosedInfo);
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						}
					}
				}).catch((err)=>{
					console.log(err);
				});
			},
			goBack(){
				history.back(-1);
			},
			toCart(){
				this.$router.push({path: '../cart'});
			},
			toOrder(){
				this.$router.push({path: '../order', query: {prodIds: this.choosedId, buyType: 1}});
			},
			add2collection(){
				var that = this,
					qs = require('qs'),
					_url = 'api/api/Collection/addGoodToCollection',
					_isCollected = this.isCollected;
				that.checkLoginFn(function(){
					if(_isCollected){
						_url = 'api/api/Collection/removeGoodFromCollection'
					}
					that.$axios({
						url: _url,
						method: 'post',
						responseType: 'json',
						data: qs.stringify({'prdNo': that.choosedId})
					}).then((res)=>{
						console.log(res.data);
						if(res.data.errcode==1){
							that.isCollected = _isCollected?false:true
						}else{
							that.modal = {
								"show": true,
								"msg": res.data.errmsg
							}
						}
					}).catch((err)=>{
						console.log(err);
					});
				});
			},
			filterlist(infolist){
				for (var i in infolist) {
					if(infolist[i].color_name && this.listObj.color.indexOf(infolist[i].color_name.trim())==-1){
						this.listObj.color.push(infolist[i].color_name);
						//console.log(infolist[i].color_name)
					}
					if(infolist[i].specifications && this.listObj.size.indexOf(infolist[i].specifications.trim())==-1){
						this.listObj.size.push(infolist[i].specifications);
						//console.log(infolist[i].specifications)
					}
				}
				this.choosedInfo = [this.listObj.color[0], this.listObj.size[0]];
			},
			setSelect(listObj, choosedInfo){
				//console.log(listObj,choosedInfo);
				if(listObj.color.length>0){
					this.color_show = "block";
				}else{
					this.color_show = "none";
				}
				if(listObj.size.length>0){
					this.size_show = "block";
				}else{
					this.size_show = "none";
				}
				
				var _selectText = "已选：";
				for (var j in choosedInfo) {
					if(choosedInfo[j]){
						_selectText += choosedInfo[j]+"；";
					}
				}
				this.selectText = _selectText;
			},
			lockProd(){
				var _infolist = this.infolist,
					_choosedInfo = this.choosedInfo,
					infolist0 = [],
					infolist1 = [];
				for (var x in _infolist) {//筛选包含选中color的商品list
					if(_infolist[x].color_name==_choosedInfo[0]){
						infolist0.push(_infolist[x])
					}
				}
				for (var y in infolist0) {//筛选包含选中size的商品list
					if(infolist0[y].specifications==_choosedInfo[1]){
						infolist1.push(infolist0[y])
					}
				}
				if(infolist1.length<1){
					this.choosedId = infolist0[0].prdNo;
				}else{
					this.choosedId = infolist1[0].prdNo;
				}
				//console.log(this.choosedId)
			},
			chooseFn(){
				var that = this;
				that.checkLoginFn(function(){
					that.select_show = "block"
				});
			},
			unChooseFn(){
				this.select_show = "none"
			},
			chooseColorFn(e){
				//console.log(e.currentTarget.innerHTML);
				var _choosedInfo = this.choosedInfo,
					_selectText = "已选：";
				_choosedInfo[0] = e.currentTarget.innerHTML;
				for (var j in _choosedInfo) {
					if(_choosedInfo[j]){
						_selectText += _choosedInfo[j]+"；";
					}
				}
				this.selectText = _selectText;
				this.choosedInfo = _choosedInfo;
				this.lockProd();
			},
			chooseSizeFn(e){
				//console.log(e.currentTarget.innerHTML);
				var _choosedInfo = this.choosedInfo,
					_selectText = "已选：";
				_choosedInfo[1] = e.currentTarget.innerHTML;
				for (var j in _choosedInfo) {
					if(_choosedInfo[j]){
						_selectText += _choosedInfo[j]+"；";
					}
				}
				this.selectText = _selectText;
				this.choosedInfo = _choosedInfo;
				this.lockProd();
			},
			minusFn(){
				var _num = this.num;
				if(_num<=1){
					return false
				}else{
					_num--
				}
				this.num = _num;
			},
			plusFn(){
				var _num = this.num;
				if(_num>=99){
					return false;
				}else{
					_num++
				}
				this.num = _num;
			},
			checkLoginFn(callback){
				var that = this;
				Common.checkLogin(function(data){
		      		//console.log(data);
		      		var _url = escape(window.location.href);
					if(data.errcode==1009){	 //已登录
						callback();
					}else if(data.errcode==-1001){	//"微信未授权"
						window.location.href = "http://brand.fugumobile.cn/nwestore/api/api/Oauth/oauthLogin?backurl="+_url;
					}else if(data.errcode==-1002){	//"用户未登陆"
						that.$router.push({path:"../login", query: {backUrl: _url}});
					}else{
						that.modal = {
							"show": true,
							"msg": data.errmsg
						}
					}
		      	});
			},
			comfirmAddFn(){
				console.log(this.choosedId,this.num);
				var that = this,
					qs = require('qs');
				that.$axios({
					url: 'api/api/Westorecart/addGoodsToCart',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({'prdNo': that.choosedId,"prdNum": that.num})
				}).then((res)=>{
					console.log(res.data);
					if(res.data.errcode==1){
						that.modal = {
							"show": true,
							"msg": "添加成功"
						};
						that.cartNum = res.data.result.westoreCartCount;
						that.unChooseFn();
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						}
					}
				}).catch((err)=>{
					console.log(err);
				});
			},
			scrollFn(){
				var scrollTop = document.documentElement.scrollTop,
					deltaY = this.$refs.the_tab_bar.offsetTop - document.documentElement.offsetTop;
				//console.log("scrollTop:"+scrollTop+",deltaY:"+deltaY);
				scrollTop >= deltaY ? this.tab_bar_show = "block" : this.tab_bar_show = "none";
			},
			showQRCode(){
				this.QRCode = "flex";
			},
			hideQRCode(){
				this.QRCode = "none";
			}
		},
		created(){
			
		},
		mounted(){
			var store_id = this.storeId,
				prod_id = this.$route.params.prodId,
				that = this;
			this.getProdData(store_id,prod_id);
			this.initSwiper();
			
			Common.getCartNum(function(data){
				//console.log(data);
				that.cartNum = data.result.count;
			});
			
			Weshare.setwxshare({
				title: "Inspiration to the nth Power",
				desc: "我在n次方发现一件好物！",
				linkurl: window.location.href,
				imgurl: "http://brand.fugumobile.cn/nwestore/static/img/share.jpg"
			},{
				title: "Inspiration to the nth Power",
				desc: "我在n次方发现一件好物！",
				linkurl: window.location.href,
				imgurl: "http://brand.fugumobile.cn/nwestore/static/img/share.jpg"
			});
			
			window.addEventListener('scroll', this.scrollFn);
		},
		updated(){
			
		},
		destroyed(){
			window.removeEventListener('scroll', this.scrollFn);
		}
	}
</script>

<style scoped>
.top {
  width: 100%;
  height: 60px;
  background: #f6f6f6;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; left: 0; top: 0;
}
.top .back {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute; left: 0; top: 0;
}
.top .back img {
  width: 13px;
  height: 22px;
}
.top .logo {
  width: 120px;
  height: 25px;
}
#content {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
  background: #f6f6f6;
}
#content .firstSec {
  width: 100%;
}
#content .firstSec .swiper-container .swiper-slide img {
  width: 640px;
  height: 640px;
  display: block;
  margin: 0 auto;
}
#content .firstSec .swiper-container #collectBtn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 20px;
  z-index: 266;
}
#content .firstSec .prodInfo {
  width: 100%;
  box-sizing: border-box;
  padding: 24px 20px 10px;
  margin-bottom: 10px;
  background: #fff;
}
#content .firstSec .prodInfo .prodName {
  margin-bottom: 15px;
  text-align: left;
  line-height: 36px;
  font-size: 30px;
}
#content .firstSec .prodInfo .priceBox {
  text-align: left;
  line-height: 36px;
}
#content .firstSec .prodInfo .priceBox .now {
  color: #95262C;
  font-size: 30px;
}
#content .firstSec .prodInfo .priceBox .old {
  text-decoration: line-through;
}
#content .firstSec .prodInfo .priceBox .old,
#content .firstSec .prodInfo .priceBox .trans {
  color: #666;
  font-size: 20px;
}
#content .firstSec .prodInfo .discount {
  margin: 15px 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #95262C;
  font-size: 20px;
}
#content .firstSec .prodInfo .discount .discount_item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .firstSec .prodInfo .discount .icon {
  width: 68px;
  height: 30px;
  margin-right: 10px;
  box-sizing: border-box;
  border: 1px #95262C solid;
  border-radius: 5px;
  text-align: center;
}
#content .firstSec .prodInfo .discount .context {
  margin-right: 20px;
}
#content .firstSec #choose {
  width: 100%;
  height: 75px;
  box-sizing: border-box;
  padding: 0 20px;
  background: #fff;
  line-height: 75px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .secondSec {
  min-height: 100%;
}
#content .secondSec .tab-page {
  width: 100%;
  overflow: hidden;
}
#content .secondSec .descPage img {
  width: 100%;
}
#content .secondSec .sizePage .list_size {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  margin-top: 20px;
}
#content .secondSec .sizePage .list_size li {
  width: 100%;
  height: 66px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  line-height: 66px;
}
#content .secondSec .sizePage .list_size li div {
  flex: 1;
  padding-left: 20px;
}
#content .secondSec .sizePage .list_size li .desc_size {
  flex: 6;
}
#content .secondSec .sizePage .list_size li:nth-child(odd) {
  background: #eee;
}
#content .secondSec .sizePage .list_size li:nth-child(evev) {
  background: #fff;
}
.tab-bar {
  width: 100%;
  height: 80px;
  background: #fff;
  display: flex;
}
.tab-bar li {
  flex: 1;
  line-height: 80px;
  text-align: center;
}
.tab-bar .active {
  background: #000;
  color: #fff;
}
#top-bar {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  top: 0;
  display: none;
}
#btns {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  z-index: 566;
  display: flex;
  background: #fff;
}
#btns #serve,
#btns #cart {
  width: 78px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#btns #serve img,
#btns #cart img {
  height: 60px;
}
#btns #serve {
  box-sizing: border-box;
  border-right: 1px #c1bfc0 solid;
}
#btns #cart {
  position: relative;
  left: 0;
  top: 0;
}
#btns #cart .cartNum {
  position: absolute;
  right: 6px;
  top: 0;
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  font-size: 18px;
  color: #fff;
  border-radius: 50%;
  background: #95262C;
}
#btns #buy,
#btns #add2cart {
  width: 242px;
  height: 100%;
  color: white;
  font-size: 24px;
  text-align: center;
  line-height: 80px;
}
#btns #buy {
  background: #727071;
}
#btns .unable {
  background-color: #CACACA;
}
#btns .able {
  background-color: #95242a;
}
#confirmAdd {
  width: 100%;
  height: 80px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 699;
  text-align: center;
  line-height: 80px;
  color: #fff;
  background: #95262C;
}
#select {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
  display: none;
  background: #fff;
  z-index: 668;
  position: fixed;
  left: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
#select .showBox {
  width: 100%;
  height: 296px;
  box-sizing: border-box;
  padding: 0 20px;
  border-bottom: 1px #dcdcdc solid;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 0;
  top: 0;
}
#select .showBox .showImg {
  width: 200px;
  height: 200px;
  border: 1px #dcdcdc solid;
  margin-right: 20px;
}
#select .showBox .center {
  flex: 1;
  height: 200px;
  text-align: left;
}
#select .showBox .center .showName {
  line-height: 36px;
}
#select .showBox .center .showPrice {
  width: 100%;
  margin-bottom: 15px;
}
#select .showBox .center .showPrice .show_now {
  color: #95262C;
}
#select .showBox .center .showPrice .show_old {
  text-decoration: line-through;
  font-size: 20px;
}
#select .showBox #close {
  padding: 20px;
  position: absolute;
  right: 0;
  top: 0;
}
#select .mainBox {
  width: 100%;
}
#select .mainBox .mainItem {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  border-bottom: 1px #dcdcdc solid;
}
#select .mainBox .mainItem .subtitle {
  width: 100%;
  line-height: 60px;
  text-align: left;
}
#select .mainBox .mainItem ul {
  width: 100%;
  height: 100%;
  margin-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
#select .mainBox .mainItem ul li {
  min-width: 152px;
  height: 60px;
  box-sizing: border-box;
  padding: 0 20px;
  margin: 5px 10px 5px 0;
  border-radius: 36px;
  background: #dcdcdc;
  line-height: 60px;
  text-align: center;
  font-size: 20px;
}
#select .mainBox .mainItem ul .selected {
  border: 1px #97262c solid;
  color: #97262c;
}
#select .mainBox .mainItem ul .unable {
  border: none;
  color: #aaa;
}
#select .mainBox .numBox {
  height: 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#select .mainBox .numBox .textBox,
#select .mainBox .numBox .optionBox {
  height: 50px;
  line-height: 50px;
  text-align: left;
}
#select .mainBox .numBox #minus,
#select .mainBox .numBox #num,
#select .mainBox .numBox #plus {
  padding: 20px;
  background: #f6f6f6;
}
#select .mainBox .numBox #num {
  margin: 0 5px;
}
#qrPopup {
  width: 100%;
  height: 100%;
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#qrPopup .qrCode {
  width: 400px;
}
#qrPopup .desc {
  width: 66%;
  text-align: center;
  color: #fff;
  margin-top: 20px;
}
</style>