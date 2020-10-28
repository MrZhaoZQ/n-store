<template>
	<div id="content">
		<img class="resImg" src="../../static/img/right.png"/>
		<div class="text success">付款成功</div>
		<div class="btns">
			<div @click="toIndex" class="toIndex">返回首页</div>
			<div @click="toOrderList">查看订单</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: "",
		data(){
			return {
				
			}
		},
		methods: {
			toIndex(){
				this.$router.push({name: "index"});
			},
			toOrderList(){
				this.$router.push({name: "orderList"});
			}
		},
		mounted(){
			
		},
		updated(){
			
		}
	}
</script>

<style scoped>
#content {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  font-size: 24px;
}
#content .resImg {
  height: 30px;
  display: block;
  margin: 0 auto;
  padding-top: 70px;
}
#content .text {
  width: 100%;
  text-align: center;
  margin-top: 30px;
}
#content .success {
  color: #3bb239;
}
#content .fail {
  color: #97262c;
}
#content .error {
  width: 100%;
  margin-top: 10px;
  text-align: center;
}
#content .btns {
  width: 100%;
  height: 60px;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content .btns div {
  width: 220px;
  height: 60px;
  box-sizing: border-box;
  border: 1px #aaa solid;
  border-radius: 5px;
  color: #595757;
  text-align: center;
  line-height: 60px;
}
#content .btns .toIndex {
  margin-right: 20px;
}
</style>