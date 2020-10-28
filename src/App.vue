<template>
  <div id="app">
  	<keep-alive>      
		    <router-view v-if="$route.meta.keepAlive" name="content"/>    
		</keep-alive>    
		<router-view v-if="!$route.meta.keepAlive" name="content"/>
    <!--<router-view name="content"/>-->
    <router-view name="footer"/>
    <loading v-show="isLoading" ></loading>
  </div>
</template>

<script>
import Weshare from "./modules/Weshare.js";
import Loading from './components/Loading';
import {mapState} from 'vuex';
export default {
  name: 'App',
  components:{
  	Loading
  },
  computed:{
	  ...mapState({
	    isLoading: state => state.loading.isLoading
	  })
	},
  data(){
		return {
			
		}
	},
	methods: {
		
	},
	mounted(){
		Weshare.wxconfig();
	},
	updated(){
		
	}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
