<template>
	<ul id="footer">
		<li>
			<router-link to="/"><img :src="'index'==$route.name ? imgs.selected[0] : imgs.unselected[0]"/></router-link>
		</li>
		<li>
			<router-link to="/collect"><img :src="'collect'==$route.name ? imgs.selected[1] : imgs.unselected[1]"/></router-link>
		</li>
		<li>
			<router-link to="/cart"><img :src="'cart'==$route.name ? imgs.selected[2] : imgs.unselected[2]"/></router-link>
			<div class="cartNum" :class="{hide:cartNum==0}">{{cartNum}}</div>
		</li>
		<li>
			<router-link to="/mine"><img :src="'mine'==$route.name ? imgs.selected[3] : imgs.unselected[3]"/></router-link>
		</li>
	</ul>
</template>

<script>
	import Common from "./../modules/Common.js";
	import ValuePass from "./../modules/ValuePass.js";
	export default {
		name: "Footer",
		data(){
			return {
				imgs: {
					selected: [require("./../../static/img/home_2.png"), 
								require("./../../static/img/collect_2.jpg"),
								require("./../../static/img/shopping-cart_2.png"),
								require("./../../static/img/My-n_2.png")],
					unselected: [require("./../../static/img/home_1.png"), 
								require("./../../static/img/collect_1.jpg"),
								require("./../../static/img/shopping-cart_1.png"),
								require("./../../static/img/My-n_1.png")]
				},
				cartNum: 0
			}
		},
		watch:{
			/*$route:function(){
				console.log(this.$route)
			}*/
		},
		mounted(){
			var that = this;
			Common.getCartNum(function(data){
				//console.log(data);
				if(data.errcode==1){
					that.cartNum = data.result.count;
				}
			});
			ValuePass.$on("myDefineEv", function(data){
				that.cartNum = data;
			});
		},
		updated(){
			
		}
	};
</script>

<style>
</style>