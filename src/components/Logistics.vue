<template>
	<div id="content">
		<div class="top">
			<div id="back" @click="$router.go(-1);">
				<img src="../../static/img/list/back.png"/>
			</div>
			<img class="logo" src="../../static/img/logo.png"/>
		</div>
		<ul class="infoHead">
			<li class="ordernum">订单编号：{{orderNum}}</li>
			<li class="status">卖家已发货</li>
		</ul>
		<div class="info">
			<div class="imgBox">
				<img :src="orderImg"/>
				<div class="txt">共{{order.prdNum}}件商品</div>
			</div>
			<div class="infoBox">
				<div>物流状态：<span class="infoStatus red">{{statusTxt.psStatus}}</span></div>
				<div>快递公司：<span class="infoName">{{info.com}}</span></div>
				<div>运单编号：<span class="infoNums">{{info.nu}}</span></div>
				<!--<div>官方电话：<span class="tel"></span></div>-->
			</div>
		</div>
		<ul class="infolist">
			<!--<li v-for>
				<div class="timeBox">
					<div class="date">08.06</div>
					<div class="time">16:16</div>
				</div>
				<div class="desc">[上海市]快件到达上海市准备发往浦东中转站</div>
			</li>-->
			<li v-for="item in info.data">
				<div class="timeBox">
					<div class="date">{{item.time.substr(5,5)}}</div>
					<div class="time">{{item.time.substr(11,5)}}</div>
				</div>
				<div class="desc">{{item.context}}</div>
			</li>
		</ul>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	export default{
		name: "",
		data(){
			return {
				orderNum: "",
				info: {},
				order: {},
				orderImg: "",
				psStatus: "",
				statusTxt: {
					"0": "运输中",
					"1": "已揽收",
					"2": "疑难",
					"3": "已签收",
					"4": "退签",
					"5": "派送中",
					"6": "退回",
					"7": "转单"
				},
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			getLogisticsInfo(orderNum){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Order/getExpressStatus',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"order_num": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.info = res.data.result.express_info;
						that.order = res.data.result.order_info;
						that.psStatus = res.data.result.express_info.state;
						if(that.order.color_pic.length>0){
							that.orderImg = order.color_pic[0].color_pic;
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
			}
		},
		mounted(){
			var _orderNum = this.$route.query.orderNum;
			this.orderNum = _orderNum;
			this.getLogisticsInfo(_orderNum);
		},
		updated(){
			
		}
	}
</script>

<style scoped="scoped">
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
  background: #f6f6f6;
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
#content .info {
  width: 100%;
  height: 220px;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 0 20px;
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .info .imgBox {
  position: relative;
  left: 0;
  top: 0;
  width: 160px;
  height: 160px;
  margin-right: 20px;
}
#content .info .imgBox img {
  width: 100%;
  height: 100%;
  border: 1px #dcdcdc solid;
}
#content .info .imgBox .txt {
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 0;
  bottom: 0;
  color: #fff;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
}
#content .info .infoBox {
  flex: 1;
  height: 160px;
}
#content .info .infoBox div {
  color: #aaa;
  line-height: 36px;
}
#content .info .infoBox div .infoNums {
  color: #595757;
}
#content .info .infoBox div .tel {
  color: #2785ef;
}
#content .info .infoBox div .red {
  color: #97262C;
}
#content .info .infoBox div:first-child {
  margin-bottom: 10px;
  font-size: 24px;
  color: #595757;
}
#content .infolist {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  background: #fff;
  color: #595757;
}
#content .infolist li {
  width: 100%;
  min-height: 80px;
  box-sizing: border-box;
  padding: 10px 0;
  border-bottom: 1px #dcdcdc solid;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content .infolist li .timeBox {
  width: 72px;
  margin-right: 28px;
}
#content .infolist li .timeBox .date {
  text-align: right;
}
#content .infolist li .timeBox .time {
  font-size: 20px;
  text-align: right;
  color: #aaa;
}
#content .infolist li .desc {
  width: 500px;
  font-size: 20px;
}
</style>