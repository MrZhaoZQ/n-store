<template>
	<div id="content">
		<div id="nav">
			<img @click="$router.go(-1);" id="back" src="../../static/img/back.png"/>
			<ul class="barlist">
				<li v-for="(tab, index) in tabs" :class="{active:activeIndex==index}" @click="tabFn(index)">{{tab}}</li>
			</ul>
		</div>
		
		<!--all page-->
		<div class="orders all" ref="scroll_all" v-on:scroll="scrollFn('scroll_all')" :class="{hide:activeIndex!=0}">
			<div class="list list-all">
				<div class="item" v-for="item in listAll">
					<div class="headBox">
						<div class="order_no">订单编号：{{item.order_num}}</div>
						<div class="status">{{statusTxt[item.status]}}</div>
					</div>
					<ul class="prodlist">
						<li v-for="prod in item.product_info" @click="toProd(prod.prdNo)">
							<img class="prodImg" :src="prod.color_pic"/>
							<div class="prodInfo">
								<div class="name">{{prod.prdName}}</div>
								<div class="more">
									<div class="price">
										<p class="now">￥{{prod.stdPrice}}</p>
										<!--<p class="old">￥{{prod.stdPrice}}</p>-->
									</div>
									<div class="num">x{{prod.prdNum}}</div>
								</div>
							</div>
						</li>
					</ul>
					<div class="options">
						<div class="box">
							<div class="total">合计：<span>￥{{item.pay_account}}</span></div>
							<ul class="btns">
								<li v-for="btn in statusBtns[item.status]" @click.stop="doClickFn(btn,item.order_num)">{{btn}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!--toPay page-->
		<div class="orders toPay" ref="scroll_toPay" v-on:scroll="scrollFn('scroll_toPay')" :class="{hide:activeIndex!=1}">
			<div class="list list-toPay">
				<div class="item" v-for="item in list2pay" v-on:click="toOrderInfo(item.order_num)">
					<div class="headBox">
						<div class="order_no">订单编号：{{item.order_num}}</div>
						<div class="status">{{statusTxt[item.status]}}</div>
					</div>
					<ul class="prodlist">
						<li v-for="prod in item.product_info">
							<img class="prodImg" :src="prod.color_pic"/>
							<div class="prodInfo">
								<div class="name">{{prod.prdName}}</div>
								<div class="more">
									<div class="price">
										<p class="now">￥{{prod.stdPrice}}</p>
										<!--<p class="old">￥{{prod.stdPrice}}</p>-->
									</div>
									<div class="num">x{{prod.prdNum}}</div>
								</div>
							</div>
						</li>
					</ul>
					<div class="options">
						<div class="box">
							<div class="total">合计：<span>￥{{item.pay_account}}</span></div>
							<ul class="btns">
								<li v-for="btn in statusBtns[item.status]" @click.stop="doClickFn(btn,item.order_num)">{{btn}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!--toSend page-->
		<div class="orders toSend" ref="scroll_toSend" v-on:scroll="scrollFn('scroll_toSend')" :class="{hide:activeIndex!=2}">
			<div class="list list-toSend">
				<div class="item" v-for="item in list2send" v-on:click="toOrderInfo(item.order_num)">
					<div class="headBox">
						<div class="order_no">订单编号：{{item.order_num}}</div>
						<div class="status">{{statusTxt[item.status]}}</div>
					</div>
					<ul class="prodlist">
						<li v-for="prod in item.product_info">
							<img class="prodImg" :src="prod.color_pic"/>
							<div class="prodInfo">
								<div class="name">{{prod.prdName}}</div>
								<div class="more">
									<div class="price">
										<p class="now">￥{{prod.stdPrice}}</p>
										<!--<p class="old">￥{{prod.stdPrice}}</p>-->
									</div>
									<div class="num">x{{prod.prdNum}}</div>
								</div>
							</div>
						</li>
					</ul>
					<div class="options">
						<div class="box">
							<div class="total">合计：<span>￥{{item.pay_account}}</span></div>
							<ul class="btns">
								<li v-for="btn in statusBtns[item.status]" @click.stop="doClickFn(btn,item.order_num)">{{btn}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!--sent page-->
		<div class="orders sent" ref="scroll_sent" v-on:scroll="scrollFn('scroll_sent')" :class="{hide:activeIndex!=3}">
			<div class="list list-sent">
				<div class="item" v-for="item in listSent" v-on:click="toOrderInfo(item.order_num)">
					<div class="headBox">
						<div class="order_no">订单编号：{{item.order_num}}</div>
						<div class="status">{{statusTxt[item.status]}}</div>
					</div>
					<ul class="prodlist">
						<li v-for="prod in item.product_info">
							<img class="prodImg" :src="prod.color_pic"/>
							<div class="prodInfo">
								<div class="name">{{prod.prdName}}</div>
								<div class="more">
									<div class="price">
										<p class="now">￥{{prod.stdPrice}}</p>
										<!--<p class="old">￥{{prod.stdPrice}}</p>-->
									</div>
									<div class="num">x{{prod.prdNum}}</div>
								</div>
							</div>
						</li>
					</ul>
					<div class="options">
						<div class="box">
							<div class="total">合计：<span>￥{{item.pay_account}}</span></div>
							<ul class="btns">
								<li v-for="btn in statusBtns[item.status]" @click.stop="doClickFn(btn,item.order_num)">{{btn}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!--done page-->
		<div class="orders done" ref="scroll_done" v-on:scroll="scrollFn('scroll_done')" :class="{hide:activeIndex!=4}">
			<div class="list list-done">
				<div class="item" v-for="item in listDone" v-on:click="toOrderInfo(item.order_num)">
					<div class="headBox">
						<div class="order_no">订单编号：{{item.order_num}}</div>
						<div class="status">{{statusTxt[item.status]}}</div>
					</div>
					<ul class="prodlist">
						<li v-for="prod in item.product_info">
							<img class="prodImg" :src="prod.color_pic"/>
							<div class="prodInfo">
								<div class="name">{{prod.prdName}}</div>
								<div class="more">
									<div class="price">
										<p class="now">￥{{prod.stdPrice}}</p>
										<!--<p class="old">￥{{prod.stdPrice}}</p>-->
									</div>
									<div class="num">x{{prod.prdNum}}</div>
								</div>
							</div>
						</li>
					</ul>
					<div class="options">
						<div class="box">
							<div class="total">合计：<span>￥{{item.pay_account}}</span></div>
							<ul class="btns">
								<li v-for="btn in statusBtns[item.status]" @click.stop="doClickFn(btn,item.order_num)">{{btn}}</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	export default{
		name: "",
		data(){
			return {
				tabs: ["全部","待付款","待发货","已发货","已完成"],
				activeIndex: 0,
				pageNum: 1,
				lastPage: 1,
				loadable: true,
				statusTxt: {
					"1": "等待买家付款",
					"2": "等待卖家发货",
					"3": "卖家已发货",
					"4": "交易完成",
					"5": "订单已取消"
				},
				statusBtns: {
					"1": ["订单详情","取消订单","点击付款"],
					"2": ["订单详情","提醒发货"],
					"3": ["订单详情","查看物流","确认收货"],
					"4": ["订单详情","删除订单"],
					"5": ["订单详情","删除订单"]
				},
				listAll: [],
				list2pay: [],
				list2send: [],
				listSent: [],
				listDone: [],
				payAble: 1,
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			tabFn(index){
				this.activeIndex = index
			},
			toProd(prodId){
				this.$router.push({name: 'prod', params: {prodId: prodId}})
			},
			getOrderList(){
				var that = this, qs = require('qs');
				var _url = escape(window.location.href);
				this.$axios({
					url: 'api/api/Order/getMyOrderlist',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"status": 0, "pageNum": this.pageNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						var resData = res.data.result,
							list = res.data.result.data;
						for(var i in list){
							that.listAll.push(list[i]);
							if(list[i].status == 1){
								that.list2pay.push(list[i])
							}else if(list[i].status == 2){
								that.list2send.push(list[i])
							}else if(list[i].status == 3){
								that.listSent.push(list[i])
							}else if(list[i].status == 4){
								that.listDone.push(list[i])
							}else if(list[i].status == 5){
								//已取消订单
							}
						}
						that.pageNum = resData.current_page+1;
						that.lastPage = resData.last_page;
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
			scrollFn(scroll_name){
				var top = this.$refs[scroll_name+""].scrollTop,
					height = this.$refs[scroll_name+""].scrollHeight,
					h = this.$refs[scroll_name+""].offsetHeight;
				//console.log(top, height, h);
				if(top > height-h-200){
					//console.log("yes", this.pageNum, this.lastPage);
					if(this.pageNum == this.lastPage+1){
						//提示加载完毕
						
					}else if(this.loadable){
						//提示加载更多
						this.getOrderList();
						this.loadable = false;
					}
				}
			},
			doClickFn(btn,orderNum){
				//console.log(btn);
				if(btn=="订单详情"){
					this.$router.push({path: './orderInfo', query: {orderNum: orderNum}});
				}else if(btn=="取消订单"){
					this.cancelOrder(orderNum);
				}else if(btn=="点击付款"){
					this.checkOrder(orderNum);
				}else if(btn=="提醒发货"){
					this.remindSending(orderNum);
				}else if(btn=="查看物流"){
					this.$router.push({path: './logistics', query: {orderNum: orderNum}});
				}else if(btn=="确认收货"){
					this.confirmDone(orderNum);
				}else if(btn=="删除订单"){
					this.delOrder(orderNum);
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
			cancelOrder(orderNum){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Order/cancelOrderbak',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"order_num": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						//更改页面上对应订单信息
						for(var i in that.listAll){
							if(that.listAll[i].order_num == orderNum){
								that.listAll[i].status = 5
							}
						}
						for(var j in that.list2pay){
							if(that.list2pay[j].order_num == orderNum){
								that.list2pay.splice(j,1)
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
			remindSending(orderNum){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Order/remindOrder',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"order_num": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.modal = {
							"show": true,
							"msg": "商家已收到发货提醒"
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
			confirmDone(orderNum){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Order/setReadyOrder',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"order_num": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						//更改页面上对应订单信息
						for(var i in that.listAll){
							if(that.listAll[i].order_num == orderNum){
								that.listAll[i].status = 4
							}
						}
						for(var j in that.listSent){
							if(that.listSent[j].order_num == orderNum){
								that.listSent.splice(j,1);
								that.listDone.push(that.listSent[j]);
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
			delOrder(orderNum){
				var that = this, qs = require('qs');
				this.$axios({
					url: 'api/api/Order/removeOrder',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"order_num": orderNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						//删除页面上对应订单信息
						//方式一：
						for(var i in that.listAll){
							if(that.listAll[i].order_num == orderNum){
								that.listAll.splice(i,1)
							}
						}
						for(var j in that.listDone){
							if(that.listDone[j].order_num == orderNum){
								that.listDone.splice(j,1)
							}
						}
						//方式二：
						/*that.pageNum = 1;
						that.lastPage = 1;
						that.listAll = [];
						that.list2pay = [];
						that.list2send = [];
						that.listSent = [];
						that.listDone = [];
						that.getOrderList();*/
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
			this.getOrderList();
			var status = parseInt(this.$route.query.status);
			this.activeIndex = status>0?status:0;
			document.getElementsByTagName("body")[0].style.overflow = 'hidden';
			document.getElementById("app").style.height = '100%';
		},
		updated(){
			
		},
		destroyed(){
			document.getElementsByTagName("body")[0].style.overflow = '';
			document.getElementById("app").style.height = '';
		}
	}
</script>

<style scoped>
#content{
  width: 100%; height: 100%;
}
#nav {
  width: 100%;
  height: 60px;
  background: #fff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 666;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
#nav #back {
  padding: 20px;
}
#nav .barlist {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
#nav .barlist li {
  flex: 1;
  height: 60px;
  box-sizing: border-box;
  text-align: center;
  line-height: 60px;
}
#nav .barlist .active {
  border-bottom: 3px #97262C solid;
}
.orders {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding-top: 60px;
  background: #F6F6F6;
  font-size: 24px;
}
.orders .list {
  width: 100%;
  margin: 10px 0;
}
.orders .list .item {
  width: 100%;
  background: #fff;
  margin-bottom: 10px;
}
.orders .list .item .headBox {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 0 20px;
  border-bottom: 1px #dcdcdc solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.orders .list .item .headBox .order_no {
  text-align: left;
  line-height: 60px;
  color: #aaa;
}
.orders .list .item .headBox .status {
  text-align: right;
  line-height: 60px;
  color: #97262C;
}
.orders .list .item .prodlist {
  width: 100%;
}
.orders .list .item .prodlist li {
  width: 100%;
  height: 200px;
  box-sizing: border-box;
  padding: 20px 20px;
  border-bottom: 1px #dcdcdc solid;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.orders .list .item .prodlist li .prodImg {
  width: 160px;
  height: 160px;
}
.orders .list .item .prodlist li .prodInfo {
  flex: 1;
  margin-left: 50px;
  text-align: left;
}
.orders .list .item .prodlist li .prodInfo .name {
  margin-bottom: 10px;
}
.orders .list .item .prodlist li .prodInfo .more {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.orders .list .item .prodlist li .prodInfo .more .now {
  color: #97262C;
}
.orders .list .item .prodlist li .prodInfo .more .old {
  font-size: 20px;
  text-decoration: line-through;
}
.orders .list .item .options {
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.orders .list .item .options .total {
  text-align: right;
  margin-right: 20px;
}
.orders .list .item .options .total span {
  color: #97262C;
  line-height: 70px;
  font-size: 28px;
}
.orders .list .item .options .btns {
  height: 70px;
  margin-right: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}
.orders .list .item .options .btns li {
  width: 140px;
  height: 40px;
  margin-right: 10px;
  border: 1px #333 solid;
  border-radius: 20px;
  text-align: center;
  line-height: 40px;
}
</style>