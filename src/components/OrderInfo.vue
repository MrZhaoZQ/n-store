<template>
	<div id="content">
		<div class="top">
			<div id="back" @click="$router.go(-1);">
				<img src="../../static/img/list/back.png"/>
			</div>
			<img class="logo" src="../../static/img/logo.png"/>
		</div>
		<div class="addressInfo" :class="{hide: !psInfo}">
			<img src="../../static/img/order/address.png" alt="" />
			<div class="infoBox">
				<p class="receiver">收货人：{{detail.name}}</p>
				<p class="address">收货地址：{{address}}</p>
			</div>
		</div>
		<ul class="infoHead">
			<li class="ordernum">订单编号：{{orderNum}}</li>
			<li class="status">{{statusTxt[orderStatus]}}</li>
		</ul>
		<ul class="prodlist">
			<li v-for="item in prods" :prodId="item.prdNo">
				<img class="prodImg" :src="item.color_pic" alt="" />
				<div class="prodInfo">
					<div class="name">{{item.prdName}}</div>
					<div class="priceBox">
						<p class="now">￥{{item.stdPrice}}</p>
					</div>
				</div>
				<div class="num">x{{item.prdNum}}</div>
			</li>
		</ul>
		<!--<ul class="infoItem">
			<li>优惠信息</li>
			<li class="red">满499减100</li>
		</ul>-->
		<ul class="infoItem" :style="{display: psItem}">
			<li>配送信息</li>
			<li class="red psType">{{psType}}</li>
		</ul>
		<ul class="infoItem">
			<li>实付款</li>
			<li class="red payNum">￥{{total}}</li>
		</ul>
		<ul class="psInfo" :class="{hide: !psInfo}">
			<!--<li><div>快递公司</div><div class="psName">天天快递</div></li>-->
			<li><div>快递单号</div><div class="psNum">{{detail.express_num}}</div></li>
		</ul>
		<ul class="timeInfo">
			<li><div>下单时间</div><div class="time">{{detail.created_time}}</div></li>
			<li :style="{'display': detail.pay_time!=null?'flex':'none'}"><div>付款时间</div><div class="time">{{detail.pay_time}}</div></li>
			<li :style="{'display': detail.express_time!=null?'flex':'none'}"><div>发货时间</div><div class="time">{{detail.express_time}}</div></li>
			<li :style="{'display': detail.confirm_time!=null?'flex':'none'}"><div>收货时间</div><div class="time">{{detail.express_time}}</div></li>
		</ul>
		<ul class="btns">
			<li v-for="btn in statusBtns[orderStatus]" :class="{'red': btn!='联系客服'}" @click.stop="doClickFn(btn)">{{btn}}</li>
		</ul>
		
		<!--客服二维码-->
		<div id="qrPopup" @click.self="hideQRCode" :style="{display: QRCode}">
			<img class="qrCode" src="../../static/img/qr.jpg"/>
			<div class="desc">识别二维码，联系客服</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	export default{
		name: "",
		data(){
			return {
				detail: {},
				orderNum: "",
				orderStatus: "",
				address: "",
				statusTxt: {
					"1": "等待买家付款",
					"2": "等待卖家发货",
					"3": "卖家已发货",
					"4": "交易完成",
					"5": "订单已取消"
				},
				statusBtns: {
					"1": ["联系客服","取消订单","点击付款"],
					"2": ["联系客服","提醒发货"],
					"3": ["联系客服","查看物流","确认收货"],
					"4": ["联系客服","删除订单"],
					"5": ["联系客服","删除订单"],
					"6": ["门店自取"]
				},
				total: 0,
				psInfo: true,
				psItem: "none",
				psType: "",
				prods: [],
				QRCode: "none",
				payAble: 1,
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			getOrderInfo(orderNum){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Order/getOrderDetail',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"order_num": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.detail = res.data.result;
						that.address = that.detail.province+that.detail.city+that.detail.area+that.detail.address_detail;
						that.prods = res.data.result.goods_info;
						that.orderStatus = res.data.result.status;
						that.total = parseFloat(that.detail.pay_account) + that.detail.freight;
						if(that.detail.is_express==1){
							that.orderStatus = 6;
							that.psInfo = false;
							that.psItem = "none";
							return false;
						}
						if(that.orderStatus<=2 || that.orderStatus>=5){
							that.psInfo = false;
							that.psItem = "none";
						}else{
							that.psInfo = true;
							that.psItem = "flex";
							if(that.detail.is_free_freight==1){
								that.psType = "包邮"
							}else{
								that.psType = "快递配送：￥"+parseFloat(that.detail.freight).toFixed(2)
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
			doClickFn(btn){
				console.log(btn);
				var orderNum = this.orderNum;
				if(btn=="联系客服"){
					this.QRCode = "flex";
				}else if(btn=="取消订单"){
					this.doOrder(orderNum,'api/api/Order/cancelOrderbak');
				}else if(btn=="点击付款"){
					this.checkOrder(orderNum);
				}else if(btn=="提醒发货"){
					this.doOrder(orderNum,'api/api/Order/remindOrder','商家已收到发货提醒');
				}else if(btn=="查看物流"){
					this.$router.push({path: './logistics', query: {orderNum: orderNum}});
				}else if(btn=="确认收货"){
					this.doOrder(orderNum,'api/api/Order/setReadyOrder');
				}else if(btn=="删除订单"){
					this.doOrder(orderNum,'api/api/Order/removeOrder');
				}
			},
			checkOrder(orderNum){
				if(this.payAble!=1){
					return false;
				}else{
					this.payAble = 0
				}
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/pay/Index/checkPay',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"orderno": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						//that.payAble = 1;
						window.location.href = "http://brand.fugumobile.cn/nwestore/api/pay/Index/index?orderno="+orderNum;
					}else{
						that.payAble = 1;
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						};
					}
				}).catch((err)=>{
					console.log(err)
				});
			},
			doOrder(orderNum,apiUrl,_msg){
				var that = this, qs = require('qs');
				this.$axios({
					url: apiUrl,
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"order_num": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						//更改页面上对应订单信息
						if(_msg){
							that.modal = {
								"show": true,
								"msg": _msg
							}
						}else{
							that.getOrderInfo(that.orderNum)
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
			hideQRCode(){
				this.QRCode = "none"
			}
		},
		mounted(){
			var _orderNum = this.$route.query.orderNum;
			this.orderNum = _orderNum;
			this.getOrderInfo(_orderNum);
		},
		updated(){
			
		}
	}
</script>

<style scoped>
#content {
  width: 100%;
  background: #f6f6f6;
}
#content .top {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .top #back {
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
#content .top #back img {
  width: 13px;
  height: 22px;
}
#content .top .logo {
  width: 120px;
  height: 25px;
  margin-left: 200px;
}
#content .addressInfo {
  width: 100%;
  height: 180px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content .addressInfo img {
  margin: 0 20px;
}
#content .addressInfo .infoBox {
  flex: 1;
  margin-right: 20px;
  text-align: left;
}
#content .infoHead {
  width: 100%;
  height: 65px;
  box-sizing: border-box;
  padding: 0 20px;
  margin-top: 10px;
  border-bottom: 1px #DCDCDC solid;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .infoHead li {
  line-height: 65px;
}
#content .infoHead li:last-child {
  color: #97262C;
}
#content .prodlist {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  margin-bottom: 10px;
  background: #fff;
}
#content .prodlist li {
  width: 100%;
  height: 220px;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content .prodlist li .prodImg {
  width: 160px;
  height: 160px;
  box-sizing: border-box;
  border: 1px #dcdcdc solid;
}
#content .prodlist li .prodInfo {
  width: 270px;
  height: 160px;
  margin: 0 20px;
  text-align: left;
}
#content .prodlist li .prodInfo .priceBox {
  margin: 15px 0;
}
#content .prodlist li .prodInfo .priceBox .now {
  color: #97262C;
}
#content .prodlist li .prodInfo .priceBox .old {
  font-size: 20px;
  text-decoration: line-through;
}
#content .prodlist li .num {
  width: 30px;
  text-align: right;
}
#content .prodlist li:last-child {
  border-bottom: none;
}
#content .infoItem {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 0 20px;
  border-bottom: 1px #DCDCDC solid;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .infoItem li {
  line-height: 80px;
}
#content .infoItem .red {
  color: #97262C;
}
#content .psInfo {
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
  padding: 0 20px;
  background: #fff;
}
#content .psInfo li {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .psInfo li div {
  line-height: 80px;
}
#content .timeInfo {
  width: 100%;
  box-sizing: border-box;
  padding: 30px 20px;
  margin: 10px 0 30px;
  background: #fff;
}
#content .timeInfo li {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .timeInfo li div {
  line-height: 40px;
}
#content .timeInfo li:first-child {
  display: flex;
}
#content .btns {
  height: 80px;
  box-sizing: border-box;
  padding-right: 10px;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#content .btns li {
  width: 140px;
  height: 40px;
  margin-right: 10px;
  border: 1px #333 solid;
  border-radius: 20px;
  text-align: center;
  line-height: 40px;
}
#content .btns .red {
  border: 1px #97262C solid;
  color: #97262C;
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