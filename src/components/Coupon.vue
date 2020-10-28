<template>
	<div id="content">
		<div class="top">
			<div id="back" @click="$router.go(-1);">
				<img src="../../static/img/list/back.png"/>
			</div>
			<img class="logo" src="../../static/img/logo.png"/>
		</div>
		<div class="list">暂无可使用优惠券</div>
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
  box-sizing: border-box;
  padding-bottom: 160px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
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
#content .list {
  text-align: center;
}
</style>