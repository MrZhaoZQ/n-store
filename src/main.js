// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/loading'
import router from './router'

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    store.commit('updateLoadingStatus', {isLoading: true})
    next()
})
router.afterEach(function (to) {
  	store.commit('updateLoadingStatus', {isLoading: false})
})

import 'swiper/dist/css/swiper.css'
import '../static/css/main.css'

/*引入封装配置的axios*/
/*import api from './api/index.js'    // 引用API文件
Vue.prototype.$api = api    // 将API方法绑定到全局*/

// 直接引入axios
import axios from 'axios'
//axios.defaults.withCredentials = true    // 跨域保存session; 跨域请求，需要配置withCredentials为true，这样避免每次都被识别为新的请求
axios.defaults.baseURL = 'http://brand.fugumobile.cn/nwestore/'
Vue.prototype.$axios = axios

//axios loading
/*let startRequest = true
axios.interceptors.request.use(config => {
	startRequest = true;
  	//console.log('axios begin request')
  	//console.log(startRequest);
  	setTimeout(function(){
  		//console.log("500ms:"+startRequest);
  		if(startRequest==true){
			store.commit('axiosStart')
		}
  	},2000);
  	return config;
})
axios.interceptors.response.use(config => {
	startRequest = false
  	//console.log('axios get response')
  	store.commit('axiosEnd')
  	return config
})*/

//导入modal组件
import Modal from './Components/Modal.vue'
Vue.component('Modal',Modal)

/* eslint-disable no-new */
new Vue({
  	el: '#app',
  	router,
  	store,
  	components: { App, Modal },
  	template: '<App/>'
})
