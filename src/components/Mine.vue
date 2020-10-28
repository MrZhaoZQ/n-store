<template>
	<div id="content">
		<div class="kv">
			<div class="memberImg" @click="toProfile">
				<img :src="userInfo.headimgurl"/>
			</div>
			<div class="memberName">{{userInfo.nickname}}</div>
			<div class="memberLevel">Clubⁿ Top Member</div>
			<div class="points" @click="toPoints">积分：0</div>
		</div>
		<ul class="dataBox">
			<li v-for="item in points">
				<div>{{item.score}}</div>
				<div>{{item.memType}}积分</div>
			</li>
		</ul>
		<div class="orderInfo">
			<div class="subtitleBox myOrders" @click="toOrderList(0)">
				<div class="subtitle">我的订单</div>
				<div class="checkOrders">查看全部订单<img src="../../static/img/mine/enter.png" alt="" /></div>
			</div>
			<ul class="orderStatus">
				<li @click="toOrderList(1)">
					<div class="num" :class="{hide:orders[0]<1}">{{orders[0]}}</div>
					<img src="../../static/img/mine/dfk.png"/>待付款
				</li>
				<li @click="toOrderList(2)">
					<div class="num" :class="{hide:orders[1]<1}">{{orders[1]}}</div>
					<img src="../../static/img/mine/dfh.png"/>待发货
				</li>
				<li @click="toOrderList(3)">
					<div class="num" :class="{hide:orders[2]<1}">{{orders[2]}}</div>
					<img src="../../static/img/mine/yfh.png"/>已发货
				</li>
				<li @click="toOrderList(4)">
					<div class="num" :class="{hide:orders[3]<1}">{{orders[3]}}</div>
					<img src="../../static/img/mine/ywc.png"/>已完成
				</li>
			</ul>
		</div>
		<div class="cartInfo" @click="$router.push({name:'cart'});">
			<div class="subtitle">购物车</div>
			<div class="num cartNum">{{cartNum}}</div>
		</div>
		<ul class="rightslist">
			<li @click="toFn(0)">
				<img class="icon" src="../../static/img/mine/wdhyk.png"/>我的会员卡
				<img class="enter" src="../../static/img/mine/enter.png"/>
			</li>
			<li @click="toFn(1)">
				<img class="icon" src="../../static/img/mine/wdNqy.png"/>我的n权益
				<img class="enter" src="../../static/img/mine/enter.png"/>
			</li>
			<li @click="toFn(2)">
				<img class="icon" src="../../static/img/mine/wdyhq.png"/>我的优惠券
				<img class="enter" src="../../static/img/mine/enter.png"/>
			</li>
			<li @click="toFn(3)">
				<img class="icon" src="../../static/img/mine/wdhd.png"/>我的活动
				<img class="enter" src="../../static/img/mine/enter.png"/>
			</li>
			<li @click="toFn(4)">
				<img class="icon" src="../../static/img/mine/dzgl.png"/>地址管理
				<img class="enter" src="../../static/img/mine/enter.png"/>
			</li>
			<li @click="toFn(5)">
				<img class="icon" src="../../static/img/mine/zxkf.png"/>在线客服
				<img class="enter" src="../../static/img/mine/enter.png"/>
			</li>
		</ul>
		<!--<div id="logout">退出登录</div>-->
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
		<!--客服二维码-->
		<div id="qrPopup" @click.self="hideQRCode" :style="{display: QRCode}">
			<img class="qrCode" src="../../static/img/qr.jpg"/>
			<div class="desc">识别二维码，联系客服</div>
		</div>
	</div>
</template>

<script>
	import Common from "./../modules/Common.js";
	export default {
		name: "Mine",
		data(){
			return {
				orders: [0,0,0,0],
				points: [],
				userInfo: {},
				mem_level: "",
				cartNum: 0,
				QRCode: "none",
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			getMineInfo(){
				var that = this,
					qs = require('qs');
				this.$axios({
					url: 'api/api/Mine/index',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({})
				}).then((res)=>{
					console.log(res.data);
					if(res.data.errcode==1){
						var _data = res.data.result;
						for(var i in _data.orderRes){
							if(_data.orderRes[i].status<5){
								that.orders[_data.orderRes[i].status-1] = _data.orderRes[i].count
							}
						}
						that.points = _data.code;
						that.userInfo = _data.userInfo;
						that.mem_level = _data.userInfo.memLevel;
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
			toOrderList(status){
				this.$router.push({path:"./orderList", query: {status: status}})
			},
			toProfile(){
				window.location.href = "http://brand.fugumobile.cn/nthpower/family/profile.html";
			},
			toPoints(){
				this.$router.push({name: 'points'})
			},
			toFn(i){
				if(i==0){
					window.location.href = "http://brand.fugumobile.cn/nthpower/family/mycard.html"
				}else if(i==1){
					window.location.href = "http://brand.fugumobile.cn/nthpower/family/rights.html?mem="+this.mem_level
				}else if(i==2){
					this.$router.push({name: 'coupon'})
				}else if(i==3){
					window.location.href = "http://brand.fugumobile.cn/nthpower/family/event.html"
				}else if(i==4){
					this.$router.push({name: 'address'})
				}else if(i==5){
					this.QRCode = "flex"
				}
			},
			hideQRCode(){
				this.QRCode = "none"
			}
		},
		mounted(){
			var that = this;
			Common.checkLogin(function(data){
	      		console.log(data);
	      		var _url = escape(window.location.href);
				if(data.errcode==1009){	 //已登录
					that.getMineInfo();
				}else if(data.errcode==-1001){	//"微信未授权"
					window.location.href = "http://brand.fugumobile.cn/nwestore/api/api/Oauth/oauthLogin?backurl="+_url;
				}else if(data.errcode==-1002){	//"用户未登陆"
					this.$router.push({path:"./login", query: {backUrl: _url}});
				}else{
					window.alert(data.errmsg);
				}
	        });
	        Common.getCartNum(function(data){
				that.cartNum = data.result.count;
			});
		},
		updated(){
			
		}
	};
</script>

<style scoped>
#content {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
  background: #f6f6f6;
}
#content .kv {
  width: 100%;
  height: 400px;
  background: url(../../static/img/mine/kv_bg.jpg) no-repeat;
  background-size: 100% 100%;
  position: relative;
  left: 0;
  top: 0;
}
#content .kv .memberImg {
  width: 178px;
  height: 178px;
  position: absolute;
  right: 20px;
  top: 20px;
}
#content .kv .memberImg img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-sizing: border-box;
}
#content .kv .memberImg .one {
  border: 6px #c9c9ca solid;
}
#content .kv .memberImg .two {
  border: 6px #ed7971 solid;
}
#content .kv .memberImg .three {
  border: 6px #e5e632 solid;
}
#content .kv .memberName {
  position: absolute;
  right: 230px;
  top: 40px;
  color: #fff;
}
#content .kv .memberLevel {
  position: absolute;
  right: 230px;
  top: 100px;
  color: #c9c9ca;
}
#content .kv .points{
  position: absolute;
  right: 20px;
  bottom: 20px;
  color: #c9c9ca;
}
#content .dataBox {
  width: 100%;
  height: 70px;
  padding: 18px 0;
  background: #fff;
  display: flex;
}
#content .dataBox li {
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#content .dataBox li:first-child {
  border-right: 1px #dcdcdc solid;
}
#content .num {
  width: 28px;
  height: 28px;
  text-align: center;
  line-height: 28px;
  color: #fff;
  font-size: 18px;
  border-radius: 50%;
  background: #95262C;
}
#content .orderInfo {
  width: 100%;
  height: 200px;
  margin: 10px 0;
  background: #fff;
}
#content .orderInfo .subtitleBox {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .orderInfo .subtitleBox .subtitle {
  margin-left: 20px;
}
#content .orderInfo .subtitleBox .checkOrders {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#content .orderInfo .subtitleBox .checkOrders img {
  width: 13px;
  height: 22px;
  margin: 0 20px;
}
#content .orderInfo .orderStatus {
  width: 100%;
  height: 120px;
  box-sizing: border-box;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content .orderInfo .orderStatus li {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 0;
  top: 0;
}
#content .orderInfo .orderStatus li .num {
  position: absolute;
  right: 26%;
  top: -10px;
}
#content .orderInfo .orderStatus li img {
  height: 39px;
  margin-bottom: 8px;
}
#content .cartInfo {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 0 20px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .rightslist {
  width: 100%;
  margin: 10px 0;
}
#content .rightslist li {
  height: 80px;
  background: #fff;
  box-sizing: border-box;
  border-bottom: 1px #dcdcdc solid;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  left: 0;
  top: 0;
}
#content .rightslist li .icon {
  margin: 0 20px;
}
#content .rightslist li .enter {
  width: 13px;
  height: 22px;
  position: absolute;
  right: 0;
  top: 50%;
  margin: -11px 20px 0;
}
#content #logout {
  width: 400px;
  height: 60px;
  box-sizing: border-box;
  border: 1px #96262c solid;
  border-radius: 10px;
  margin: 40px auto;
  background: #fbe4eb;
  text-align: center;
  line-height: 60px;
  color: #97262C;
}
#qrPopup {
  width: 100%;
  height: 100%;
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