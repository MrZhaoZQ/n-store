import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import Footer from '@/components/Footer'

import Login from '@/components/Login'
import Collect from '@/components/Collect'
import Cart from '@/components/Cart'
import Mine from '@/components/Mine'
import Search from '@/components/Search'
import List from '@/components/List'
import Brand from '@/components/Brand'
import More from '@/components/More'
import Prod from '@/components/Prod'
import Order from '@/components/Order'
import Success from '@/components/Success'
import Fail from '@/components/Fail'
import OrderList from '@/components/OrderList'
import OrderInfo from '@/components/OrderInfo'
import Logistics from '@/components/Logistics'
import Address from '@/components/Address'
import Coupon from '@/components/Coupon'
import Points from '@/components/Points'

Vue.use(Router)

export default new Router({
	//mode: 'history',
	base: '/nstore/',
	routes: [
		{
			path: "*",
			redirect: "/Index"
		},
		{
			path: '/',
			name: 'index',
			components: {
				content: Index,
				footer: Footer
			},
			meta: {
				title: 'Inspiration to the nth Power',
				keepAlive: true
			}
		},
		{
			path: "/login",
			name: 'login',
			components: {
				content: Login
			},
			meta: {
				title: '登录'
			}
		},
		{
			path: "/collect",
			name: 'collect',
			components: {
				content: Collect,
				footer: Footer
			},
			meta: {
				title: '我的收藏'
			}
		},
		{
			path: "/cart",
			name: 'cart',
			components: {
				content: Cart,
				footer: Footer
			},
			meta: {
				title: '购物车'
			}
		},
		{
			path: "/mine",
			name: 'mine',
			components: {
				content: Mine,
				footer: Footer
			},
			meta: {
				title: '我的n'
			}
		},
		{
			path: "/search",
			name: 'search',
			components: {
				content: Search
			},
			meta: {
				title: 'Inspiration to the nth Power',
				keepAlive: true
			}
		},
		{
			path: "/list",
			name: 'list',
			components: {
				content: List,
				footer: Footer
			},
			meta: {
				title: 'Inspiration to the nth Power',
				keepAlive: true
			}
		},
		{
			path: "/brand",
			name: 'brand',
			components: {
				content: Brand
			}
		},
		{
			path: "/more/:type",
			name: 'more',
			components: {
				content: More
			},
			meta: {
				title: 'Inspiration to the nth Power'
			}
		},
		{
			path: "/prod/:prodId",
			name: 'prod',
			components: {
				content: Prod
			},
			meta: {
				title: '商品详情'
			}
		},
		{
			path: "/order",
			name: 'order',
			components: {
				content: Order
			},
			meta: {
				title: 'Inspiration to the nth Power'
			}
		},
		{
			path: "/success",
			name: 'success',
			components: {
				content: Success
			},
			meta: {
				title: '支付成功'
			}
		},
		{
			path: "/fail",
			name: 'fail',
			components: {
				content: Fail
			},
			meta: {
				title: '支付失败'
			}
		},
		{
			path: "/orderList",
			name: 'orderList',
			components: {
				content: OrderList
			},
			meta: {
				title: '订单列表'
			}
		},
		{
			path: "/orderInfo",
			name: 'orderInfo',
			components: {
				content: OrderInfo
			},
			meta: {
				title: '订单详情'
			}
		},
		{
			path: "/logistics",
			name: 'logistics',
			components: {
				content: Logistics
			},
			meta: {
				title: '物流信息'
			}
		},
		{
			path: "/address",
			name: 'address',
			components: {
				content: Address
			},
			meta: {
				title: '地址管理'
			}
		},
		{
			path: "/coupon",
			name: 'coupon',
			components: {
				content: Coupon
			},
			meta: {
				title: '我的优惠券'
			}
		},
		{
			path: "/points",
			name: 'points',
			components: {
				content: Points
			},
			meta: {
				title: '我的积分'
			}
		}
	],
  	scrollBehavior (to, from, savedPosition) {
  		if (savedPosition) { 
	        return savedPosition
	    } else {
          return { x: 0, y: 0 }
	    }
	}
})
