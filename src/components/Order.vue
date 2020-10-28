<template>
	<div id="content">
		<div class="top">
			<div id="back" @click="$router.go(-1);">
				<img src="../../static/img/list/back.png"/>
			</div>
			<img class="logo" src="../../static/img/logo.png"/>
		</div>
		
		<div class="container">
			<div class="addressInfo" @click="toAddress">
				<img src="../../static/img/order/address.png" alt="" />
				<div class="infoBox" :class="{hide:addressInfo.length>0}">
					<p class="receiver">收货人：{{addressInfo.name}}</p>
					<p class="address">收货地址：{{addressInfo.province+addressInfo.city+addressInfo.address_detail+""}}</p>
				</div>
				<div class="infoEmpty" :class="{hide:addressInfo}">请添加您的收获地址</div>
				<img src="../../static/img/order/enter.png"/>
			</div>
			<img src="../../static/img/order/line.png"/>
			<ul class="prodlist">
				<li v-for="item in prodList">
					<img class="prodImg" :src="item.color_pic" alt="" />
					<div class="prodInfo">
						<div class="name">{{item.prdName}}</div>
						<div class="priceBox">
							<p class="now">￥{{item.stdPrice}}</p>
							<!--<p class="old">￥{{item.stdPrice}}</p>-->
						</div>
					</div>
					<div class="num">x{{item.prdNum}}</div>
				</li>
			</ul>
			<ul class="moreInfo">
				<!--<li>
					<div class="infoHead">
						<div class="subtitle">优惠信息</div>
						<div class="context">
							<span id="yhType">满499减100</span>
							<img src="../../static/img/order/enter.png"/>
						</div>
					</div>
				</li>-->
				<li>
					<div class="infoHead psChoose">
						<div class="subtitle">配送方式</div>
						<div class="context">
							<span>{{freightTxt}}</span>
							<img src="../../static/img/order/enter.png"/>
						</div>
					</div>
					<div class="ps">
						<div class="psItem"><img src="../../static/img/order/choose.png"/><span>{{freightTxt}}</span></div>
						<!--<div class="psItem"><img src="../../static/img/order/unchoose.png"/>门店自取</div>-->
					</div>
				</li>
				<li>
					<div class="infoHead">
						<div class="subtitle">是否需要发票</div>
						<img @click="needInvoiceFn" :src="invoice?selectedSrc:unselectedSrc"/>
					</div>
					<div class="bills" :style="{display:invoice?'block':'none'}">
						<div class="bill-item">
							<img @click="chooseInvoiceType(1)" :src="invoiceType==1?choosedSrc:unchoosedSrc"/>个人
						</div>
						<div class="bill-item">
							<img @click="chooseInvoiceType(2)" :src="invoiceType==2?choosedSrc:unchoosedSrc"/>公司
						</div>
						<div class="billInfo" :style="{display:invoiceType==2?'block':'none'}">
							<input type="text" v-model="invoiceTitle" placeholder="请输入公司抬头" />
							<input type="text" v-model="taxNumber" placeholder="请输入企业税号" />
						</div>
					</div>
				</li>
					
			</ul>
			<div class="leaveMsg">
				<div class="subtitle">买家留言：</div>
				<textarea v-model="leaveMsg" name="" rows="" cols="" placeholder="请输入留言内容" ></textarea>
			</div>
		</div>
		
		<div class="footer">
			<div class="totalBox">
				合计
				<div class="total">
					<p class="now_t">￥{{total+freight}}</p>
					<!--<p class="old_t">￥1354.00</p>-->
				</div>
			</div>
			<div @click="submitFn" id="submit">提交订单</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	export default{
		name: "Order",
		data(){
			return {
				prodIds: "",
				prodNums: [],
				total: 0,
				buyType: 0,
				addressId: "",
				addressInfo: {},
				prodList: [],
				getType: 0,	//取件方式		0 ：快递， 1：自取
				freight: 0,
				free: 1,	//1：包邮, 0:需付邮费
				freightTxt: '包邮',
				invoice: false,	//是否需要发票，默认:否
				invoiceType: 0,	//0:无， 1：个人， 2：企业
				invoiceTitle: "",
				taxNumber: "",
				leaveMsg: "",
				submitAble: 1,
				selectedSrc: require('../../static/img/order/open.jpg'),
				unselectedSrc: require('../../static/img/order/close.jpg'),
				choosedSrc: require('../../static/img/order/choose.png'),
				unchoosedSrc: require('../../static/img/order/unchoose.png'),
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods:{
			toAddress(){
				this.$router.push({path:"address", query: {comefrom: "order"}})
			},
			getProdsOfOrder(){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Goods/getGoodsList',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"prdNo": this.prodIds, "buyType": this.buyType, "address_id": this.addressId})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						var resData = res.data.result;
						that.addressInfo = resData.address_info;
						that.prodList = resData.goodList;
						this.freight = resData.freight;
						if(resData.freight==0){
							that.freightTxt = "包邮";
							that.free = 1;
						}else{
							that.freightTxt = "快递配送：￥"+resData.freight+".00";
							that.free = 0;
						}
						that.addressId = resData.address_info.id;
						resData.goodList.map(function(cv){
							that.prodNums.push(cv.prdNum);
							that.total += parseFloat(cv.stdPrice*cv.prdNum);
						});
						
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
			needInvoiceFn(){
				var _Type = this.invoiceType;
				if(this.invoice){
					this.invoice = false
				}else{
					this.invoice = true;
					this.invoiceType = _Type==0?1:_Type;
				}
			},
			chooseInvoiceType(type){
				if(type==1){
					this.invoiceType = 1
				}else{
					this.invoiceType = 2
				}
			},
			submitFn(){
				if(this.submitAble!=1){
					return false
				}else{
					this.submitAble = 0
				}
				console.log(this.invoice,this.invoiceTitle,this.taxNumber,this.leaveMsg);
				var _invoice = this.invoice,
					_type = this.invoiceType,
					_title = this.invoiceTitle,
					_num = this.taxNumber,
					_msg = this.leaveMsg;
				if(_invoice==true){
					if(_type ==2 && _title==""){
						this.modal = {
							"show": true,
							"msg": "请填写正确的公司抬头"
						};
						this.submitAble = 1;
						return false;
					}else if(_type ==2 && _num==""){
						this.modal = {
							"show": true,
							"msg": "请填写正确的企业税号"
						};
						this.submitAble = 1;
						return false;
					}
				}else{
					_type = 0
				}
				
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Order/purchaseOrder',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({
						"prdNo": this.prodIds,
						"prdNumber": this.prodNums.join(","),
						"address_id": this.addressId,
						"invoiceType": _type,
						"company": _title,
						"registrationNumber": _num,
						"message": _msg,
						"is_express": this.getType,
						"is_free_freight": this.free,
						"freight": this.freight
					})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						console.log(res.data.orderno);
						that.checkOrderNum(res.data.orderno);
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						};
						that.submitAble = 1;
					}
				}).catch((err)=>{
					console.log(err)
				});
			},
			checkOrderNum(orderNum){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/pay/Index/checkPay',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"orderno": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.submitAble = 1;
						localStorage.removeItem("addressId");
						window.location.href = "http://brand.fugumobile.cn/nwestore/api/pay/Index/index?orderno="+orderNum;
					}else{
						that.submitAble = 1;
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						};
					}
				}).catch((err)=>{
					console.log(err)
				});
			}
		},
		mounted(){
			var _prodIds = this.$route.query.prodIds;
			this.prodIds = _prodIds;
			this.buyType = this.$route.query.buyType?this.$route.query.buyType:0;	//默认的0是购物车下单, 1是立即购买下单
			if(localStorage.getItem("addressId")){	//判断本地是否有 address_id				
				this.addressId =localStorage.getItem("addressId");
			}
			console.log(this.prodIds,this.buyType,this.addressId);
			_prodIds?this.getProdsOfOrder():this.$router.go(-1);
			
		},
		updated(){
			
		}
	}
</script>

<style scoped>
#content {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
  background: #F6F6F6;
}
#content .top {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #fff;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
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
#content .container {
  width: 100%;
  height: auto;
}
#content .container .addressInfo {
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content .container .addressInfo img {
  margin: 0 20px;
}
#content .container .addressInfo .infoBox,
#content .container .addressInfo .infoEmpty {
  flex: 1;
  margin-right: 20px;
  text-align: left;
}
#content .container .addressInfo .infoEmpty {
  text-align: center;
  color: #97262C;
}
#content .container .prodlist {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  margin: 10px 0;
  background: #fff;
}
#content .container .prodlist li {
  width: 100%;
  height: 220px;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .container .prodlist li .prodImg {
  width: 160px;
  height: 160px;
  box-sizing: border-box;
  border: 1px #dcdcdc solid;
}
#content .container .prodlist li .prodInfo {
  width: 270px;
  height: 160px;
  margin: 0 20px;
  text-align: left;
}
#content .container .prodlist li .prodInfo .priceBox {
  margin: 15px 0;
}
#content .container .prodlist li .prodInfo .priceBox .now {
  color: #97262C;
}
#content .container .prodlist li .prodInfo .priceBox .old {
  font-size: 20px;
  text-decoration: line-through;
}
#content .container .prodlist li .num {
  width: 30px;
  text-align: right;
}
#content .container .moreInfo {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  background: #fff;
}
#content .container .moreInfo li {
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
}
#content .container .moreInfo li .infoHead {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .container .moreInfo li .infoHead .context {
  display: flex;
  align-items: center;
}
#content .container .moreInfo li .infoHead .context img {
  margin-left: 15px;
}
#content .container .moreInfo li .ps {
  width: 100%;
  display: none;
}
#content .container .moreInfo li .ps div {
  width: 100%;
  height: 80px;
  line-height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .container .moreInfo li .ps div img {
  margin-right: 20px;
}
#content .container .moreInfo li .bills {
  width: 100%;
  display: none;
}
#content .container .moreInfo li .bills .bill-item {
  width: 126px;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .container .moreInfo li .bills .bill-item img {
  margin-right: 15px;
}
#content .container .moreInfo li .bills .billInfo {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 0 10px 65px;
  display: none;
}
#content .container .moreInfo li .bills .billInfo input {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding-left: 20px;
  border: 1px #dcdcdc solid;
  font-size: 24px;
  margin-bottom: 20px;
}
#content .container .leaveMsg {
  width: 100%;
  height: 160px;
  box-sizing: border-box;
  padding: 10px 20px;
  margin-bottom: 20px;
  background: #fff;
  position: relative;
  left: 0;
  top: 0;
}
#content .container .leaveMsg textarea {
  width: 100%;
  height: 100%;
  font-size: 24px;
  line-height: 46px;
  text-indent: 5em;
}
#content .container .leaveMsg .subtitle {
  line-height: 46px;
  position: absolute;
  left: 20px;
  top: 10px;
}
.footer {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  border-top: 1px #DCDCDC solid;
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  font-size: 28px;
}
.footer .totalBox {
  width: 440px;
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.footer .totalBox .total {
  margin: 0 20px;
}
.footer .totalBox .total .now_t {
  color: #97262C;
}
.footer .totalBox .total .old_t {
  font-size: 20px;
  text-decoration: line-through;
}
.footer #submit {
  width: 200px;
  height: 80px;
  background: #97262C;
  color: #fff;
  text-align: center;
  line-height: 80px;
}
</style>