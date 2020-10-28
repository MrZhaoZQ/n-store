<template>
	<div id="content">
		<div class="header">
			<img id="back" @click="$router.go(-1);" src="../../static/img/back.png"/>
			<li>积分列表</li>
		</div>

		<!--points container-->
		<div class="points">
			<ul class="tips">
				<li>日期</li>
				<li>积分</li>
				<li>详情</li>
			</ul>
			<ul class="list">
				<li v-for="item in list">
					<div class="date">{{item.recTime}}</div>
					<div class="point" :class="[item.pntVal>0?'green':'red']">{{item.pntVal}}</div>
					<div class="desc">{{item.typeName}}</div>
				</li>
			</ul>
		</div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	export default{
		name: "",
		data(){
			return {
				list: [],
				pageNum: 1,
				lastPage: 1,
				loadable: true,
				removeId: "",
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			getPointslist(){
				var qs = require('qs'),
					that = this,
					_url = escape(window.location.href);
				that.$axios({
					url: 'api/api/Api/getPointsList',
					method: 'post',
					responseType: 'json',
					data: qs.stringify({"pageNum": that.pageNum})
				}).then((res)=>{
					console.log(res);
					if(res.data.errcode==1){
						var resData = res.data.result.data;
						if(resData.length>0){
							for (var i in resData) {
								that.list.push(resData[i])
							}
						}else{
							//积分列表空空如也
						}
						that.pageNum = res.data.result.current_page+1;
						that.lastPage = res.data.result.last_page;
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
			scrollFn(){
				var de = document.documentElement;
				var	top = de.scrollTop,
					height = de.scrollHeight,
					h = de.offsetHeight;
				//console.log(top, height, h);
				if(top > height-h-200){
					//console.log("yes", this.pageNum, this.lastPage);
					if(this.pageNum == this.lastPage+1){
						//提示加载完毕
						
					}else if(this.loadable){
						//提示加载更多
						this.getPointslist();
						this.loadable = false;
					}
				}
			}
		},
		mounted(){
			this.getPointslist();
			window.addEventListener('scroll', this.scrollFn);
		},
		updated(){
			
		},
		destroyed(){
			window.removeEventListener('scroll', this.scrollFn);
		}
	}
</script>

<style scoped>
#content {
  width: 100%;
  font-size: 24px;
}
#content .header {
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  border-bottom: 1px #DCDCDC solid;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 666;
}
#content .header #back {
  width: auto;
  height: 20px;
  padding: 20px;
  position: absolute;
  left: 0;
  top: 0;
}
#content .points {
  width: 100%;
  padding-top: 60px;
}
#content .points .tips {
  width: 100%;
  height: 60px;
  background: #fff;
  box-sizing: border-box;
  border-bottom: 1px #dcdcdc solid;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content .points .tips li {
  flex: 1;
  line-height: 60px;
  box-sizing: border-box;
}
#content .points .tips li:first-child {
  flex: 2;
}
#content .points .list {
  width: 100%;
}
#content .points .list li {
  width: 100%;
  height: 60px;
  border-bottom: 1px #dcdcdc solid;
  display: flex;
}
#content .points .list li div {
  line-height: 60px;
  box-sizing: border-box;
}
#content .points .list li .date {
  flex: 2;
  padding-left: 20px;
}
#content .points .list li .point,
#content .points .list li .desc {
  flex: 1;
}
#content .points .list li .red {
  color: red;
}
#content .points .list li .green {
  color: green;
}
</style>