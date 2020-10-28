// 引用axios
var axios = require('axios'),
	qs = require('qs');

var Common = {
	checkLogin(callback){
		axios({
			url: 'api/api/Api/isLogin',
			method: 'post',
			responseType: 'json',
			//data: new URLSearchParams({}),		//或者用qs.stringify()将参数序列化
			data: qs.stringify({})
		}).then((res)=>{
			//console.log(res);
			callback(res.data); //回调函数处理返回出具
		}).catch((err)=>{
			console.log(err);
		});
	},
	getCartNum(callback){
		axios({
			url: 'api/api/Westorecart/getUserCartCount',
			method: 'post',
			responseType: 'json',
			data: qs.stringify({})
		}).then((res)=>{
			//console.log(res);
			callback(res.data); //回调函数处理返回出具
		}).catch((err)=>{
			console.log(err);
		});
	}
}

export default Common;
