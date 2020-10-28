<template>
	<div id="content">
		<div class="top">
			<div v-on:click="$router.go(-1);" id="back">
				<img src="../../static/img/list/back.png"/>
			</div>
			<img class="logo" src="../../static/img/logo.png"/>
		</div>
		<div id="empty" :style="{display: display_status}">
			<img src="../../static/img/cart/empty.png"/>
			<img id="browse" @click="$router.push({name: 'index'});" src="../../static/img/qgg.png"/>
		</div>
		<div id="container" :class="{hide:list.length<=0}">
			<ul class="list">
				<li v-for="(item, index) in list">
					<div class="left">
						<img @click="changeSelectedFn(index, item.prdNo)" :src="prodObj.status[index]==1?choosedSrc:unchoosedSrc"/>
					</div>
					<div class="center" @click="toProd(item.prdNo)">
						<img :src="item.color_pic"/>
					</div>
					<div class="right">
						<div class="name">{{item.prdName}}</div>
						<div class="price">
						<p class="now">￥{{item.stdPrice}}</p>
						<!--<p class="old">￥{{item.stdPrice}}</p>-->
						</div>
						<div class="numBox">
							<div class="text">购买数量</div>
							<div class="nums">
								<span @click="minusFn(index)" class="minus">-</span>
								<span class="num">{{prodObj.nums[index]}}</span>
								<span @click="plusFn(index)" class="plus">+</span>
							</div>
						</div>
					</div>
				</li>
			</ul>
			<div class="totalBox">
				<div class="all">
					<img @click="changeAllSelectedFn" :src="allSelected?choosedSrc:unchoosedSrc"/>全选 
				</div>
				<div class="total">合计：<span id="total">￥{{total}}</span></div>
				<div @click="submitFn" class="submit">结算（<span id="allNum">{{allNum}}</span>）</div>
			</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	import ValuePass from "./../modules/ValuePass.js";
	export default {
		name: "Cart",
		data(){
			return {
				display_status: "none",
				list: [],
				prodObj: {    //保存列表里数量、价格、选中状态、库存数量的信息
					"nums": [],
					"prices": [],
					"status": [],
					"stocks": []
				},
				allSelected: true,
				total: 0,
				allNum: 0,
				prodIds: [],
				choosedSrc: require("../../static/img/cart/choose.png"),
				unchoosedSrc: require("../../static/img/cart/unchoose.png"),
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			getCartlist(){
				var qs = require('qs'),
					that = this,
					_url = escape(window.location.href);
				this.$axios({
					url: 'api/api/Westorecart/getUserCart',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						var resData = res.data.result;
						if(resData && resData.length>0){
							for (var i in resData) {
								that.list.push(resData[i]);
								that.prodObj.nums.push(resData[i].prdNum);
								that.prodObj.prices.push(resData[i].stdPrice);
								that.prodObj.status.push(1);
								that.prodObj.stocks.push(resData[i].stock_num);
								that.prodIds.push(resData[i].prdNo);
							}
							that.updateTotal();
						}else{
							//购物车空空如也
							that.display_status = "block"
						}
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
			updateTotal(){
				var _total = 0, _allNum = 0, _prodObj = this.prodObj, _allSelected = true;
				for (var i in _prodObj.status) {
					if(_prodObj.status[i]==1){
						_total +=  _prodObj.nums[i] * parseFloat(_prodObj.prices[i]);
						_allNum++
					}else{
						_allSelected = false
					}
				}
				this.allSelected = _allSelected;
				this.total = _total.toFixed(2);
				this.allNum = _allNum;
			},
			changeSelectedFn(index,prodId){
				this.prodObj.status[index] = this.prodObj.status[index]==1?0:1;
				this.updateTotal();
			},
			changeAllSelectedFn(){
				var _status = this.prodObj.status,
					s = 1,
					_allSelected = this.allSelected;
				if(_allSelected){
					_allSelected = false;
					s = 0;
				}else{
					_allSelected = true;
					s = 1;
				}
				for (var i in _status) {
					_status[i] = s
				}
				this.prodObj.status = _status;
				this.allSelected = _allSelected;
				this.updateTotal();
			},
			minusFn(index){
				var _prodObj = this.prodObj;
				if(_prodObj.nums[index]<=1){
					this.updateDBnums(this.prodIds[index], 1, index, "delete");
					return false;
				}
				this.updateDBnums(this.prodIds[index], 1, index);
			},
			plusFn(index){
				var _prodObj = this.prodObj;
				if(_prodObj.nums[index]>=_prodObj.stocks[index]){
					this.modal = {
						"show": true,
						"msg": "该商品库存不足"
					};
					return false;
				}
				this.updateDBnums(this.prodIds[index], 2, index);;
			},
			updateDBnums(prodId, type, index, del){
				var qs = require('qs'),
					that = this;
				this.$axios({
					url: 'api/api/Westorecart/editCartPrdNum',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"prdNo": prodId, "type": type})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						if(type==1 && del!="delete"){//minus -1
							that.$set(that.prodObj.nums, index, that.prodObj.nums[index]-1);//该方法用于只有数组内某一项值改变或者只有数组长度改变时
						}else if(type==2){//plus +1
							that.$set(that.prodObj.nums, index, that.prodObj.nums[index]+1);
						}else if(type==1 && del=="delete"){//delete
							//删除购物车中该商品，并更新prodObj
							that.list.splice(index,1);
							that.prodObj.nums.splice(index,1);
							that.prodObj.prices.splice(index,1);
							that.prodObj.status.splice(index,1);
							that.prodObj.stocks.splice(index,1);
							that.prodIds.splice(index,1);
							if(that.prodObj.nums.length==0){
								that.display_status = "block"
							}
						}
						that.updateTotal();
						ValuePass.$emit('myDefineEv', that.prodObj.nums.length);
					}else{
						that.modal = {
							"show": true,
							"msg": res.data.errmsg
						}
					}
				}).catch((err)=>{
					
				});
			},
			submitFn(){
				var that = this,
					_prodIds = [];
				this.prodIds.map(function(cv,i){
					if(cv!="" && that.prodObj.status[i]==1){
						_prodIds.push(cv)
					}
				});
				if(_prodIds.length<1){
					this.modal = {
						"show": true,
						"msg": "请选择要购买的商品"
					}
					return false;
				}
				for (var i in this.prodObj.nums) {
					if(this.prodObj.nums[i]>this.prodObj.stocks[i]){
						this.modal = {
							"show": true,
							"msg": "购物车中第"+(i+1)+"条商品库存不足"
						}
						return false;
					}
				}
				this.$router.push({path: './order', query: {prodIds: _prodIds.join()}});
			}
		},
		mounted(){
			this.getCartlist();
		},
		watch: {
			
		},
		updated(){
			
		}
	};
</script>

<style scoped>
#content {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 160px;
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
#content #empty {
  width: 100%;
  padding-top: 36%;
  display: none;
}
#content #empty img {
  display: block;
  margin: 0 auto;
}
#content #empty #browse {
  padding: 60px;
}
#content #container {
  width: 100%;
}
#content #container .list {
  width: 100%;
}
#content #container .list li {
  width: 100%;
  height: 250px;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content #container .list li .left {
  width: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content #container .list li .center {
  width: 188px;
  height: 188px;
  box-sizing: border-box;
  border: 1px #dcdcdc solid;
}
#content #container .list li .center img {
  width: 100%;
  height: 100%;
}
#content #container .list li .right {
  width: 328px;
  height: 188px;
  box-sizing: border-box;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  text-align: left;
}
#content #container .list li .right .price {
  margin: 15px 0;
}
#content #container .list li .right .price .now {
  color: #97262C;
}
#content #container .list li .right .price .old {
  font-size: 20px;
  text-decoration: line-through;
}
#content #container .list li .right .numBox {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content #container .list li .right .numBox .nums{
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#content #container .list li .right .numBox .minus,
#content #container .list li .right .numBox .num,
#content #container .list li .right .numBox .plus {
  padding: 20px;
  background: #f6f6f6;
}
#content #container .totalBox {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  border-top: 1px #dcdcdc solid;
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 80px;
  display: flex;
}
#content #container .totalBox .all {
  width: 220px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
#content #container .totalBox .all img {
  padding: 0 20px;
}
#content #container .totalBox .total {
  width: 220px;
  line-height: 80px;
}
#content #container .totalBox .total #total {
  color: #95262C;
}
#content #container .totalBox .submit {
  width: 200px;
  line-height: 80px;
  text-align: center;
  color: #fff;
  background: #95262C;
}
</style>