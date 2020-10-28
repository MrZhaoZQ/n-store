<template>
	<div id="content">
		<div class="container">
			<div class="title">为了使用方便需要绑定您的手机号</div>
			<ul>
				<li>
					<input type="tel" name="tel" v-model="telNo" placeholder="手机号" />
					<div class="getCodeBtn" @click="getCode" :class="{gotten: btnTxt=='发送成功'}">{{btnTxt}}</div>
				</li>
				<li>
					<input type="number" name="code" v-model="passCode" placeholder="验证码" />
				</li>
			</ul>
			<div id="submit" @click="submitFn">提交</div>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	export default{
		name: "Login",
		data(){
			return {
				backurl: "",
				telNo: "",
				btnTxt: "获取验证码",
				passCode: "",
				modal:{
					show: false,
					msg: ""
				}
			}
		},
		methods: {
			getCode(){
				if(/^1[3456789]\d{9}$/.test(this.telNo)==false){
					this.modal = {
						"show": true,
						"msg": "请输入正确的手机号码"
					}
					return false;
				}
				if(this.btnTxt=="发送成功"){
					this.modal = {
						"show": true,
						"msg": "验证码已发送"
					}
					return false;
				}
				var qs = require('qs'),
					that = this;
				that.$axios({
					url: 'api/api/Sms/sendcode',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"phone": that.telNo})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						that.btnTxt = "发送成功"
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
			submitFn(){
				if(/^1[3456789]\d{9}$/.test(this.telNo)==false){
					this.modal = {
						"show": true,
						"msg": "请输入正确的手机号码"
					}
					return false;
				}else if(this.passCode==""){
					this.modal = {
						"show": true,
						"msg": "请先获取并输入验证码"
					}
					return false;
				}
				var qs = require('qs'),
					that = this;
				that.$axios({
					url: 'api/api/Api/Login',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"phone": that.telNo, 'yzcode': that.passCode})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						if(that.backurl){
							window.location.href = unescape(that.backurl)
						}else{
							that.$router.push({name: "index"})
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
			this.backurl = this.$route.query.backUrl;
		},
		updated(){
			
		}
	}
</script>

<style scoped>
#content{
	width: 100%; height: 100%;
	background: #454545;
	box-sizing: border-box;
	padding-top: 26%;
	position: fixed; left: 0; top: 0;
}
.container{
	width: 86%;
	padding: 15px;
	margin: 0 auto;
	background: #dadada;
	border-radius: 10px;
}
.title{
	width: 100%; height: 80px;
	text-align: center;
	line-height: 80px;
}
.container ul{
	width: 100%;
}
.container ul li{
	width: 100%; height: 80px;
	margin-bottom: 15px;
	box-sizing: border-box;
	padding: 0 20px;
	background: #fff;
	border-radius: 10px;
	position: relative; left: 0; top: 0;
}
.container ul li input{
	width: 100%; height: 100%;
	border-radius: 10px;
	font-size: 24px;
}
.getCodeBtn{
	height: 80px;
	position: absolute; right: 20px; top: 0;
	line-height: 80px;
	color: #EE7970;
}
.gotten{
	color: green;
}
#submit{
	width: 100%; height: 80px;
	color: #fff;
	background: #ee7970;
	border-radius: 10px;
	text-align: center;
	line-height: 80px;
	margin-bottom: 20px;
}
</style>