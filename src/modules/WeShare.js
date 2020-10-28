import wx from 'weixin-js-sdk'	//微信sdk依赖

var serverUrl = "http://brand.fugumobile.cn/nwestore/",
	axios = require('axios'),
	qs = require('qs'),
	ua = window.navigator.userAgent.toLowerCase(),
	wxurl = window.location.href.split('#')[0],
	sharefriendData = {
		title: "Inspiration to the nth Power",
		desc: "n次方微商城",
		linkurl: serverUrl,
		imgurl: serverUrl+"static/img/share.jpg"
	},
	sharetimelineData = {
		title: "Inspiration to the nth Power",
		desc: "n次方微商城",
		linkurl: serverUrl,
		imgurl: serverUrl+"static/img/share.jpg"
	},
	shareQQData = {
		title: "Inspiration to the nth Power",
		desc: "n次方微商城",
		linkurl: serverUrl,
		imgurl: serverUrl+"static/img/share.jpg"
	},
	shareweiboData = {
		title: "Inspiration to the nth Power",
		desc: "n次方微商城",
		linkurl: serverUrl,
		imgurl: serverUrl+"static/img/share.jpg"
	};

function wxconfig(config, apilist) {
	if(ua.indexOf('micromessenger') < 0) return false;	//判断是否在微信中
	if(!apilist) apilist = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'];
	if(config && config.appId && config.timestamp && config.nonceStr && config.signature) {
		wx.config({
			debug: false,
			appId: config.appId,
			timestamp: config.timestamp,
			nonceStr: config.nonceStr,
			signature: config.signature,
			jsApiList: apilist	// 必填，需要使用的JS接口列表
		});
	}else{
		axios({
			url: 'api/api/Js/share',
			method: 'post',
			responseType: 'json',
			//data: new URLSearchParams({}),		//或者用qs.stringify()将参数序列化
			data: qs.stringify({"url": wxurl})
		}).then((res)=>{
			//console.log(res);
			var data = res.data.result;
			if(data){
				if(data.appId && data.timestamp && data.nonceStr && data.signature) {
					wx.config({
						debug: false,
						appId: data.appId,
						timestamp: data.timestamp,
						nonceStr: data.nonceStr,
						signature: data.signature,
						jsApiList: apilist
					});
					wx.ready(function () {
				      	wxevent();
				   	});
				    wx.error(function (res) {
				      	//console.log("微信验证失败");
				    });
				}
			}
		}).catch((err)=>{
			console.log(err);
			//alert("生成微信签名失败，请重试！");
		});
	}
}
function setwxshare(data1, data2, data3, data4){
	if(ua.indexOf('micromessenger') < 0) return false;	//判断是否在微信中
	if(data1) sharefriendData = data1;
	if(data2) sharetimelineData = data2;
	if(data3) shareQQData = data3;
	if(data4) shareweiboData = data4;
	wxevent();
}
function wxevent(){
	// 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
	wx.onMenuShareAppMessage({
	    title: sharefriendData.title,
	    desc: sharefriendData.desc,
	    link: sharefriendData.linkurl,
	    imgUrl: sharefriendData.imgurl,
	    trigger: function trigger(res) {
	    	
	    },
	    success: function success(res) {
	    	
	    },
	    cancel: function cancel(res) {
	    	
	    },
	    fail: function fail(res) {
	    	
	    }
  	});
  	// 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
  	wx.onMenuShareTimeline({
	    title: sharetimelineData.title,
	    link: sharetimelineData.linkurl,
	    imgUrl: sharetimelineData.imgurl,
	    trigger: function trigger(res) {
	    	
	    },
	    success: function success(res) {
	    	
	    },
	    cancel: function cancel(res) {
	    	
	    },
	    fail: function fail(res) {
	    	
	    }
  	});
	// 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
  	wx.onMenuShareQQ({
	    title: shareQQData.title,
	    desc: shareQQData.desc,
	    link: shareQQData.linkurl,
	    imgUrl: shareQQData.imgurl,
	    trigger: function trigger(res) {
	    	
	    },
	    complete: function complete(res) {
	    	
	    },
	    success: function success(res) {
	    	
	    },
	    cancel: function cancel(res) {
	    	
	    },
	    fail: function fail(res) {
	    	
	    }
  	});
  	// 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
  	wx.onMenuShareWeibo({
	    title: shareweiboData.title,
	    desc: shareweiboData.desc,
	    link: shareweiboData.linkurl,
	    imgUrl: shareweiboData.imgurl,
	    trigger: function trigger(res) {
	    	
	    },
	    complete: function complete(res) {
	    	
	    },
	    success: function success(res) {
	    	
	    },
	    cancel: function cancel(res) {
	    	
	    },
	    fail: function fail(res) {
	    	
	    }
  	});
}

export default {
  	wxconfig: wxconfig,		//初始化的自定义分享内容
  	setwxshare: setwxshare	//自定义不同于初始化的分享内容
}