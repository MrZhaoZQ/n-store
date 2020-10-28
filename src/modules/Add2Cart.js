// 引用axios
var axios = require('axios'),
	qs = require('qs');

var Add2Cart = {
	add(prodId,callback){
		axios({
			url: 'api/api/Westorecart/addGoodsToCart',
			method: 'post',
			responseType: 'json',
			//data: new URLSearchParams({}),		//或者用qs.stringify()将参数序列化
			data: qs.stringify({"prdNo": prodId, "prdNum": 1})
		}).then((res)=>{
			//console.log(res);
			callback(res.data); //回调函数处理返回出具
		}).catch((err)=>{
			console.log(err);
		});
	}
}

export default Add2Cart;