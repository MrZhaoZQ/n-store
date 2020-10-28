<template>
	<div class="alert_popup" :class="{hide:!value}">
		<div class="alert_box">
			<div class="alert_context">{{msg}}</div>
			<div @click="onConfirm" class="confirm_alert_btn">{{confirmVal}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Modal',
		props: {
			value: {
				type: Boolean,
				default: false
			},
			title: {
				default: null
			},
			msg: {
				type: String,
				default: '网络出错，请稍后重试...'
			},
			confirmVal: {
				type: String,
				default: 'OK'
			}
		},
		methods: {
			onConfirm() {
				this.$emit('onConfirm')
				this.$emit('input', false)
			}
		}
	}
</script>

<style scoped>
.alert_popup{
	width: 100%; height: 100%;
	position: fixed; left: 0; top: 0;
	z-index: 666666;
	background: rgba(0,0,0,0.3);
}
.alert_box{
	width: 462px; height: 212px;
	background: #f9f9f9;
	border-radius: 10px;
	position: absolute; left: 50%; margin-left: -231px; top: 50%; margin-top: -106px;
}
.alert_context{
	width: 100%; height: 136px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.confirm_alert_btn{
	width: 100%; height: 76px;
	box-sizing: border-box;
	border-top: 1px #e4e4e4 solid;
	font-size: 28px;
	color: #006bd1;
	text-align: center;
	line-height: 76px;
}
</style>