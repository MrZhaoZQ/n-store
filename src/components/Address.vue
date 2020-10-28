<template>
	<div id="content">
		
		<!--main page-->
		<div class="sec main" :class="{hide: !showMain}">
			<div class="top">
				<img class="back" @click="$router.go(-1);" src="../../static/img/back.png"/>
				<div class="subtitle">我的收货地址</div>
				<img id="toAdd" @click="toAdd" src="../../static/img/address/add.png"/>
			</div>
			<ul class="list">
				<li v-for="(item, index) in addresslist" @click="choose(item.id)">
					<div class="infoBox">
						<div class="info">
							<div class="default" :class="{hide: index!=0}">默认</div>
							<div class="name">{{item.name}}</div>
							<div class="tel">{{item.phone}}</div>
						</div>
						<div class="text">{{item.province+item.city+item.area+item.address_detail}}</div>
					</div>
					<img class="toEdit" v-on:click.stop="toEdit(item.id,index)" src="../../static/img/address/redact.png"/>
				</li>
			</ul>
		</div>
		
		<!--add page-->
		<div class="sec add" :class="{hide: !showAdd}">
			<div class="top">
				<img class="back" @click="toMain" src="../../static/img/back.png"/>
				<div class="subtitle">添加收货地址</div>
				<img class="save" @click="saveAddItem" src="../../static/img/address/save.png"/>
			</div>
			<div class="box">
				<div class="add_name">
					<input type="text" name="add_name" v-model="name_a" placeholder="收货人姓名" />
				</div>
				<div class="add_tel">
					<input type="tel" name="add_tel" v-model="tel_a" placeholder="手机号码" />
				</div>
				<div class="selectBox">
					<select ref="a_province" v-on:change="a_change" name="a_province"></select>
					<select ref="a_city" v-on:change="a_change" name="a_city"></select>
					<select ref="a_county" v-on:change="a_change" name="a_county"></select>
					<img class="selectImg1" src="../../static/img/select.png"/>
					<img class="selectImg2" src="../../static/img/select.png"/>
					<img class="selectImg3" src="../../static/img/select.png"/>
				</div>
				<div class="detail">
					<textarea v-model="detail_a" name="" rows="" cols="" placeholder="详细地址"></textarea>
				</div>
			</div>
			<div class="setDefault">
				<div>设为默认地址</div>
				<img @click="defaultBtn_add" :src='default_a==1?selectedSrc:unselectedSrc'/>
			</div>
		</div>
		
		<!--edit page-->
		<div class="sec edit" :class="{hide: !showEdit}">
			<div class="top">
				<img class="back" @click="toMain" src="../../static/img/back.png"/>
				<div class="subtitle">编辑收货地址</div>
				<img class="save" @click="saveEditItem" src="../../static/img/address/save.png"/>
			</div>
			<div class="box">
				<div class="edit_name">
					<input type="text" name="edit_name" v-model="name_e" />
				</div>
				<div class="edit_tel">
					<input type="tel" name="edit_tel" v-model="tel_e" />
				</div>
				<div class="selectBox">
					<select ref="e_province" v-on:change="e_change" name="e_province"></select>
					<select ref="e_city" v-on:change="e_change" name="e_city"></select>
					<select ref="e_county" v-on:change="e_change" name="e_county"></select>
					<img class="selectImg1" src="../../static/img/select.png"/>
					<img class="selectImg2" src="../../static/img/select.png"/>
					<img class="selectImg3" src="../../static/img/select.png"/>
				</div>
				<div class="detail">
					<textarea v-model="detail_e" name="" rows="" cols=""></textarea>
				</div>
			</div>
			<div class="setDefault">
				<div>设为默认地址</div>
				<img @click="defaultBtn_edit" :src='default_e==1?selectedSrc:unselectedSrc'/>
			</div>
			<div id="del" @click="delAddressItem">删除收货地址</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	import AddressLinkage from "./../modules/AddressLinkage.js";
	export default{
		name: "Address",
		data(){
			return {
				comefrom: "",
				addresslist: [],
				showMain: true,
				showAdd: false,
				showEdit: false,
				name_a: "",
				tel_a: "",
				province_a: "",
				city_a: "",
				county_a: "",
				detail_a: "",
				default_a: 0,
				addressId_e: 0,
				name_e: "",
				tel_e: "",
				province_e: "",
				city_e: "",
				county_e: "",
				detail_e: "",
				default_e: 0,
				selectedSrc: require("../../static/img/address/open.png"),
				unselectedSrc: require("../../static/img/address/close.png"),
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			toAdd(){
				this.showMain = false;
				this.showAdd = true;
				this.showEdit = false;
			},
			toEdit(address_id,ind){
				var editItem = this.addresslist[ind];
				this.addressId_e = editItem.id;
				this.name_e = editItem.name;
				this.tel_e = editItem.phone;
				this.province_e = editItem.province;
				this.city_e = editItem.city;
				this.county_e = editItem.area;
				this.detail_e = editItem.address_detail;
				this.default_e = editItem.is_default;
				
				var cmbProvince = this.$refs.e_province;
				var cmbCity = this.$refs.e_city;
				var cmbArea = this.$refs.e_county;
				AddressLinkage.init_3linkage(cmbProvince, cmbCity, cmbArea, this.province_e, this.city_e, this.county_e);
				this.showMain = false;
				this.showAdd = false;
				this.showEdit = true;
			},
			toMain(){
				this.showMain = true;
				this.showAdd = false;
				this.showEdit = false;
			},
			getAddresslist(){
				var qs = require('qs'),
					that = this;
				this.$axios({
					url: 'api/api/Westoreaddress/getAddressList',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.addresslist = res.data.result;
						that.toMain();
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
			choose(address_id){
				if(this.comefrom=="order"){
					localStorage.setItem("addressId", address_id);
					this.$router.go(-1);
					//window.location.href = document.referrer;
				}
			},
			a_change(){
				var that = this;
				setTimeout(function(){
					that.province_a = that.$refs.a_province.value;
					that.city_a = that.$refs.a_city.value;
					that.county_a = that.$refs.a_county.value;
				},1000);
			},
			defaultBtn_add(){
				var _default_a = this.default_a;
				this.default_a =  _default_a==1?0:1;
			},
			saveAddItem(){
				if(this.name_a==""){
					this.modal = {
						"show": true,
						"msg": "请填写收货人姓名"
					};
					return false;
				}
				if(/^1[3456789]\d{9}$/.test(this.tel_a)==false){
					this.modal = {
						"show": true,
						"msg": "请正确填写收货人手机号码"
					};
					return false;
				}
				if(this.province_a=="" || this.province_a=="省份" || this.city_a=="" || this.city_a=="城市" || this.county_a=="" || this.county_a=="区、县"){
					this.modal = {
						"show": true,
						"msg": "请选择收货人所在省、市、区县"
					};
					return false;
				}
				if(this.detail_a==""){
					this.modal = {
						"show": true,
						"msg": "请填写收货人详细地址"
					};
					return false;
				}
				var qs = require('qs'),
					that = this;
				this.$axios({
					url: 'api/api/Westoreaddress/addOrEditAddress',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({
						"province": this.province_a,
						"city": this.city_a,
						"area": this.county_a,
						"address_detail": this.detail_a,
						"name": this.name_a,
						"phone": this.tel_a,
						"is_default": this.default_a})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.getAddresslist();
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
			e_change(){
				var that = this;
				setTimeout(function(){
					that.province_e = that.$refs.e_province.value;
					that.city_e = that.$refs.e_city.value;
					that.county_e = that.$refs.e_county.value;
				},1000);
			},
			defaultBtn_edit(){
				var _default_e = this.default_e;
				this.default_e = _default_e==1?0:1;
			},
			saveEditItem(){
				if(this.name_e==""){
					this.modal = {
						"show": true,
						"msg": "请填写收货人姓名"
					};
					return false;
				}
				if(/^1[3456789]\d{9}$/.test(this.tel_e)==false){
					this.modal = {
						"show": true,
						"msg": "请正确填写收货人手机号码"
					};
					return false;
				}
				if(this.province_e=="" || this.province_e=="省份" || this.city_e=="" || this.city_e=="城市" || this.county_e=="" || this.county_e=="区、县"){
					this.modal = {
						"show": true,
						"msg": "请选择收货人所在省、市、区县"
					};
					return false;
				}
				if(this.detail_e==""){
					this.modal = {
						"show": true,
						"msg": "请填写收货人详细地址"
					};
					return false;
				}
				var qs = require('qs'),
					that = this;
				this.$axios({
					url: 'api/api/Westoreaddress/addOrEditAddress',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({
						"province": this.province_e,
						"city": this.city_e,
						"area": this.county_e,
						"address_detail": this.detail_e,
						"name": this.name_e,
						"phone": this.tel_e,
						"is_default": this.default_e,
						"address_id": this.addressId_e})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.getAddresslist();
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
			delAddressItem(){
				var qs = require('qs'),
					that = this;
				this.$axios({
					url: 'api/api/Westoreaddress/removeAddress',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"address_id": that.addressId_e})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.getAddresslist();
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
			this.getAddresslist();
			this.comefrom = this.$route.query.comefrom;
			
			var cmbProvince = this.$refs.a_province;
			var cmbCity = this.$refs.a_city;
			var cmbArea = this.$refs.a_county;
			AddressLinkage.init_3linkage(cmbProvince, cmbCity, cmbArea, "省份", "城市", "区、县");
		},
		updated(){
			
		}
	}
</script>

<style scoped>
#content{
  width: 100%;
}
.sec {
  width: 100%;
  background: #f6f6f6;
  font-size: 24px;
}
.sec .top {
  width: 100%;
  height: 60px;
  margin-bottom: 10px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sec .top .back {
  padding: 20px;
}
.sec .top .subtitle {
  flex: 1;
  text-align: center;
  line-height: 60px;
}
.sec .top #toAdd,
.sec .top .save {
  padding: 0 20px;
}
.sec .list {
  width: 100%;
  background: #fff;
}
.sec .list li {
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px #dcdcdc solid;
  padding: 20px 0 20px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sec .list li .infoBox {
  flex: 1;
}
.sec .list li .infoBox .info {
  width: 100%;
  margin-bottom: 6px;
  line-height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.sec .list li .infoBox .text{
	text-align: left;
}
.sec .list li .infoBox .info .default {
  width: 70px;
  height: 30px;
  margin-right: 20px;
  border: 1px #333 solid;
  font-size: 20px;
  text-align: center;
  line-height: 30px;
  border-radius: 10px;
}
.sec .list li .infoBox .info .name {
  margin-right: 12px;
}
.sec .list li .toEdit {
  width: 30px;
  padding: 20px;
}
.sec .box {
  width: 100%;
  background: #fff;
}
.sec .box .add_name,
.sec .box .add_tel,
.sec .box .edit_name,
.sec .box .edit_tel {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 0 20px;
  border-bottom: 1px #dcdcdc solid;
}
.sec .box .add_name input,
.sec .box .add_tel input,
.sec .box .edit_name input,
.sec .box .edit_tel input {
  width: 100%;
  height: 100%;
  font-size: 24px;
}
.sec .box .selectBox {
  width: 100%;
  height: 80px;
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
.sec .box .selectBox select {
  width: 180px;
  height: 100%;
  margin-right: 20px;
  font-size: 24px;
}
.sec .box .selectBox img {
  height: 10px;
  position: absolute;
  top: 50%;
  margin-top: -5px;
}
.sec .box .selectBox .selectImg1 {
  left: 180px;
}
.sec .box .selectBox .selectImg2 {
  left: 380px;
}
.sec .box .selectBox .selectImg3 {
  left: 580px;
}
.sec .box .detail {
  width: 100%;
  height: 160px;
  box-sizing: border-box;
  padding: 20px 20px;
  border-bottom: 1px #dcdcdc solid;
}
.sec .box .detail textarea {
  width: 100%;
  height: 100%;
  font-size: 24px;
}
.sec .setDefault {
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 0 20px;
  margin-top: 10px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sec #del {
  width: 400px;
  height: 60px;
  box-sizing: border-box;
  border: 1px #96262c solid;
  border-radius: 10px;
  margin: 40px auto 0;
  background: #fbe4eb;
  text-align: center;
  line-height: 60px;
  color: #97262C;
}
.main {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>