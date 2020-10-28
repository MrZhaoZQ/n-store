<template>
	<div id="content">
		<!--top-->
		<div class="IndexTop">
			<img src="../../static/img/logo.png"/>
			<img v-on:click="toSearch" id="search" src="../../static/img/search.png"/>
			<img v-on:click="toList" id="classify" src="../../static/img/classify.png"/>
		</div>
		
		<!--banner-->
		<div class="swiper-container bannerSwiper">
		    <div class="swiper-wrapper">
		    	<div v-for="item in banners" class="swiper-slide" :slide-id="item.id">
		    		<!--<router-link :to="{name:'kindlist',params:{classid:item.classID}}">
		    			<img :src="item.img_url">
		    		</router-link>-->
		    		<img :src="item.img_url">
		    	</div>
		    </div>
		    <div class="swiper-pagination"></div>
		</div>
		
		<div class="activity">
			<div class="subtitleBox">
				<div class="subtitle">人气推荐 | Top-selling</div>
				<img @click="toMore(0)" class="more activity_more" moreType="0" src="../../static/img/more.png"/>
			</div>
			<div class="swiper-container activitySwiper">
			    <div class="swiper-wrapper">
			    	<div v-for="i in (activity.length/3)" class="swiper-slide">
			    		<router-link :to="{name: 'prod', params: {prodId: activity[i].prdNo}}">
			    			<div class="swiperItem" :prodId="activity[i].prdNo">
				        		<img class="img_prod" :src="activity[i].color_pic"/>
					        	<div class="name_prod">{{activity[i].prdName}}</div>
					        	<div class="price_prod">￥{{activity[i].stdPrice}}</div>
				        	</div>
			    		</router-link>
			    		
				        <router-link :to="{name: 'prod', params: {prodId: activity[i+1].prdNo}}">
				        	<div class="swiperItem middle" :prodId="activity[i+1].prdNo">
				        		<img class="img_prod" :src="activity[i+1].color_pic"/>
					        	<div class="name_prod">{{activity[i+1].prdName}}</div>
					        	<div class="price_prod">￥{{activity[i+1].stdPrice}}</div>
				        	</div>
				        </router-link>
				        
				        <router-link :to="{name: 'prod', params: {prodId: activity[i+2].prdNo}}">
				        	<div class="swiperItem" :prodId="activity[i+2].prdNo">
				        		<img class="img_prod" :src="activity[i+2].color_pic"/>
					        	<div class="name_prod">{{activity[i+2].prdName}}</div>
					        	<div class="price_prod">￥{{activity[i+2].stdPrice}}</div>
				        	</div>
				        </router-link>
			        </div>
			    </div>
			    <div class="swiper-pagination"></div>
			</div>
		</div>
		
		<!--classify-->
		<div class="classifyBox">
			<div v-for="(item, index) in classifyinfo" class="classifyItem">
				<img class="subtitleImg" :src="item.img_url"/>
				<div class="moreBox">
					<img v-on:click="toMore(item.id)" class="more" :moreType="item.id" src="../../static/img/more.png"/>
				</div>
				<div :class="'swiper-container swiper'+index">
				    <div class="swiper-wrapper">
				    	<div v-for="(prodInfo,j) in item.goods" v-if="j<item.goods.length/3" class="swiper-slide">
				        	<router-link :to="{name: 'prod', params: {prodId: item.goods[j].prdNo}}">
				        		<div class="swiperItem" :prodId="item.goods[j].prdNo">
					        		<img class="img_prod" :src="item.goods[j].color_pic"/>
						        	<div class="name_prod">{{item.goods[j].prdName}}</div>
						        	<div class="price_prod">￥{{item.goods[j].stdPrice}}</div>
					        	</div>
				        	</router-link>
				        	<router-link :to="{name: 'prod', params: {prodId: item.goods[j+1].prdNo}}">
				        		<div class="swiperItem middle" :prodId="item.goods[j+1].prdNo">
					        		<img class="img_prod" :src="item.goods[j+1].color_pic"/>
						        	<div class="name_prod">{{item.goods[j+1].prdName}}</div>
						        	<div class="price_prod">￥{{item.goods[j+1].stdPrice}}</div>
					        	</div>
				        	</router-link>
				        	<router-link :to="{name: 'prod', params: {prodId: item.goods[j+2].prdNo}}">
				        		<div class="swiperItem" :prodId="item.goods[j+2].prdNo">
					        		<img class="img_prod" :src="item.goods[j+2].color_pic"/>
						        	<div class="name_prod">{{item.goods[j+2].prdName}}</div>
						        	<div class="price_prod">￥{{item.goods[j+2].stdPrice}}</div>
					        	</div>
				        	</router-link>
				        </div>
				    </div>
				    <div class="swiper-pagination"></div>
				</div>
			</div>
		</div>

		<img class="banner" src="../../static/img/banner.jpg"/>
		<div class="txt"><img src="../../static/img/txt.png"/></div>
		
		<Modal v-model="modal.show" :msg="modal.msg"></Modal>
		
	</div>
</template>

<script>
	import Swiper from 'swiper';
	export default {
		name: "Index",
		data(){
			return {
				swiperOptions: {
					loop: false,
					pagination: '.swiper-pagination',
					autoplay: false,
					observer:true,
					observeParents:true
				},
				banners: [],
				activity: [],
				classifyinfo: [],
				storeid: "",
				modal: {
					"show": false,
					"msg": ""
				}
			}
		},
		methods: {
			initSwiper: function(){
				for (var s=0; s<8; s++) {		//init classify swiper
					new Swiper ('.swiper'+s, this.swiperOptions);
				}
			},
			toSearch: function(){
				this.$router.push('search')
			},
			toList: function(){
				this.$router.push('list')
			},
			toMore: function(moreType){
				this.$router.push({name: 'more', params: {"type": moreType}});
			}
		},
		mounted(){
			var that = this,
				qs = require('qs');
			this.$axios({
				url: 'api/api/Homepage/getHomepageInfo',
				method: 'post',
				responseType: 'json',
				//data: new URLSearchParams({}),		//或者用qs.stringify()将参数序列化
				data: qs.stringify({})
			}).then((res)=>{
				//console.log(res);
				that.banners = res.data.result.banner;
				that.activity = res.data.result.topGood;
				that.classifyinfo = res.data.result.classifyResult;
				that.storeId = res.data.result.storeId;
			}).catch((err)=>{
				console.log(err);
				that.modal = {
					"show": true,
					"msg": err
				};
			});
			
			//调用封装配置的axios
			/*this.$api.post('api/api/Homepage/getHomepageInfo',null, res => {
		        console.log(res)
	      	});*/
		},
		watch:{
			/*classifyinfo: function(n,o){	//new old
				console.log("new:"+n, "old:"+o);
			}*/
		},
		updated(){
			var bannerSwiper = new Swiper ('.bannerSwiper', {
				loop: true,
				pagination: '.swiper-pagination',
				autoplay: 2000,
  				autoplayDisableOnInteraction: false,
				observer:true, //修改swiper自己或子元素时，自动初始化swiper
				observeParents:true //修改swiper的父元素时，自动初始化swiper
			});
			
			var activitySwiper = new Swiper ('.activitySwiper', this.swiperOptions);
			
			this.initSwiper();
		}
	}
</script>

<style scoped>
#content {
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 80px;
}
#content .IndexTop {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 0;
  top: 0;
}
#content .IndexTop #search {
  width: 32;
  height: 42px;
  position: absolute;
  right: 80px;
  top: 9px;
}
#content .IndexTop #classify {
  width: 30;
  height: 41px;
  position: absolute;
  right: 20px;
  top: 9px;
}
#content .bannerSwiper {
  width: 100%;
  height: 400px;
}
#content .swiper-pagination-bullets {
  bottom: 36px;
}
#content .swiper-pagination-bullet {
  width: 10px;
  height: 10px;
  display: inline-block;
  border: 1px #959595 solid;
  border-radius: 50%;
  background: #fff;
  opacity: 1;
}
#content .swiper-pagination-bullet-active {
  width: 30px;
  height: 10px;
  border: none;
  border-radius: 5px;
  background: #959595;
}
#content .more {
  width: 59px;
  height: 13px;
  padding: 20px;
}
#content .middle {
  margin: 0 15px;
}
#content .activity {
  width: 100%;
  height: 490px;
  border-top: 1px solid #dcdcdc;
}
#content .activity .subtitleBox {
  width: 100%;
  height: 65px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#content .activity .subtitleBox .subtitle {
  padding-left: 20px;
}
#content .activity .activitySwiper {
  width: 600px;
  height: 400px;
  margin: 0 20px;
}
#content .activity .activitySwiper .swiper-wrapper {
  width: 100%;
}
#content .activity .activitySwiper .swiper-wrapper .swiper-slide {
  width: 100%;
  display: flex;
}
#content .activity .activitySwiper .swiper-wrapper .swiper-slide .swiperItem {
  width: 190px;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
#content .activity .activitySwiper .swiper-wrapper .swiper-slide .swiperItem .img_prod {
  width: 188px;
  height: 188px;
  border: solid 1px #dcdcdc;
  margin-bottom: 10px;
}
#content .activity .activitySwiper .swiper-wrapper .swiper-slide .swiperItem .name_prod {
  width: 188px;
  height: 60px;
  margin-bottom: 5px;
  font-size: 22px;
  text-align: left;
  color: #333;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
#content .activity .activitySwiper .swiper-wrapper .swiper-slide .swiperItem .price_prod {
  width: 188px;
  text-align: left;
  color: #95262c;
}
#content .classifyBox {
  width: 100%;
}
#content .classifyBox .classifyItem {
  width: 100%;
}
#content .classifyBox .classifyItem .subtitleImg {
  width: 100%;
}
#content .classifyBox .classifyItem .moreBox {
  width: 100%;
  height: 45px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
#content .classifyBox .classifyItem .swiper-container {
  width: 600px;
  height: 400px;
  margin: 0 20px;
}
#content .classifyBox .classifyItem .swiper-container .swiper-wrapper {
  width: 100%;
  height: 100%;
}
#content .classifyBox .classifyItem .swiper-container .swiper-wrapper .swiper-slide {
  width: 100%;
  display: flex;
}
#content .classifyBox .classifyItem .swiper-container .swiper-wrapper .swiper-slide .swiperItem {
  width: 190px;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
#content .classifyBox .classifyItem .swiper-container .swiper-wrapper .swiper-slide .swiperItem .img_prod {
  width: 188px;
  height: 188px;
  border: solid 1px #dcdcdc;
  margin-bottom: 10px;
}
#content .classifyBox .classifyItem .swiper-container .swiper-wrapper .swiper-slide .swiperItem .name_prod {
  width: 188px;
  height: 60px;
  margin-bottom: 5px;
  text-align: left;
  font-size: 22px;
  color: #333;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
#content .classifyBox .classifyItem .swiper-container .swiper-wrapper .swiper-slide .swiperItem .price_prod {
  width: 188px;
  text-align: left;
  color: #95262c;
}
#content .redLogoBox {
  width: 100%;
  height: 106px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#content .txt {
  width: 100%;
  height: 145px;
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>