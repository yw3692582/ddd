import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
import SoilLayout from '@/components/SoilLayout'
import Login from '../views/Login.vue'

Vue.use(Router)

// 解决重复点击链接的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
	mode: 'history',
	// mode:'hash',
	routes: [{
			path: '/',
			name: 'Login',
			component: Login
		},
		// 重庆市墒情监控
		{
			path: '/soil',
			name: 'SoilLayout',
			component: SoilLayout,
			children: [{
					path: '/soilconsole',
					name: 'SoilConsole',
					component: (resolve) => require(['../soilviews/SoilConsole.vue'], resolve)
				}, {
					path: '/soilstatus',
					name: 'SoilStatus',
					component: (resolve) => require(['../soilviews/SoilStatus.vue'], resolve)
				},
				{
					path: '/soilarrival',
					name: 'SoilArrival',
					component: (resolve) => require(['../soilviews/SoilArrival.vue'], resolve)
				},
				{
					path: '/soilreal',
					name: 'SoilRealTimeDatas',
					component: (resolve) => require(['../soilviews/SoilRealTimeDatas.vue'], resolve)
				},
				{
					path: '/soilstatistics',
					name: 'SoilStatistics',
					component: (resolve) => require(['../soilviews/SoilStatistics.vue'], resolve)
				}, {
					path: '/soilhorizontal',
					name: 'SoilHorizontal',
					component: (resolve) => require(['../soilviews/SoilHorizontal.vue'], resolve)
				}, {
					path: '/soilvertical',
					name: 'SoilVertical',
					component: (resolve) => require(['../soilviews/SoilVertical.vue'], resolve)
				}, {
					path: '/soilecologyh',
					name: 'SoilEcologyH',
					component: (resolve) => require(['../soilviews/SoilEcologyH.vue'], resolve)
				}, {
					path: '/soilecologyv',
					name: 'SoilEcologyV',
					component: (resolve) => require(['../soilviews/SoilEcologyV.vue'], resolve)
				}, {
					path: '/soilstation',
					name: 'SoilStation',
					component: (resolve) => require(['../soilviews/SoilStation.vue'], resolve)
				}, {
					path: '/soilequiment',
					name: 'SoilEquiment',
					component: (resolve) => require(['../soilviews/SoilEquiment.vue'], resolve)
				}, {
					path: '/soiluser',
					name: 'SoilUser',
					component: (resolve) => require(['../soilviews/SoilUser.vue'], resolve)
				}, {
					path: '/soilmoisture',
					name: 'SoilMoisture',
					component: (resolve) => require(['../soilviews/SoilMoisture.vue'], resolve)
				},
				{
					path: '/soilcreateEq',
					name: 'SoilCreateEq',
					component: (resolve) => require(['../soilviews/SoilCreateEq.vue'], resolve)
				},
			]
		},

		// 气象的layout
		{
			path: '/layout',
			name: 'Layout',
			component: Layout,
			children: [{
					path: '/console',
					name: 'Main',
					component: (resolve) => require(['../views/Main.vue'], resolve)
				},
				{
					path: '/users',
					name: 'Users',
					component: (resolve) => require(['../views/Users.vue'], resolve)
				},
				{
					path: '/registered',
					name: 'Registered',
					component: (resolve) => require(['../views/Registered.vue'], resolve)
				},
				{
					path: '/project',
					name: 'Project',
					component: (resolve) => require(['../views/Project.vue'], resolve)
				},
				{
					path: '/equipment',
					name: 'Equipment',
					component: (resolve) => require(['../views/Equipment.vue'], resolve)
				},
				{
					path: '/createEq',
					name: 'CreateEq',
					component: (resolve) => require(['../views/CreateEq.vue'], resolve)
				},
				{
					path: '/meteorological',
					name: 'CreateMeteorological',
					component: (resolve) => require(['../views/CreateMeteorological.vue'], resolve)
				},
				{
					path: '/auxiliary',
					name: 'CreatAuxiliary',
					component: (resolve) => require(['../views/CreatAuxiliary.vue'], resolve)
				},
				{
					path: '/remotely',
					name: 'Remotely',
					component: (resolve) => require(['../views/Remotely.vue'], resolve)
				},
				{
					path: '/statistical',
					name: 'Statistical',
					component: (resolve) => require(['../views/Statistical.vue'], resolve)
				},
				{
					path: '/status',
					name: 'Status',
					component: (resolve) => require(['../views/Status.vue'], resolve)
				},
				{
					path: '/message',
					name: 'Message',
					component: (resolve) => require(['../views/Message.vue'], resolve)
				},
			]
		},
		{
			path: '/warning',
			name: 'Warning',
			component: (resolve) => require(['../views/Warning.vue'], resolve)
		},
		{
			path: '/warningc',
			name: 'Warningc',
			component: (resolve) => require(['../views/Warning_copy.vue'], resolve)
		},
		{
			path: "/404",
			component: (resolve) => require(['../views/404.vue'], resolve)
		},
		{
			path: "*",
			component: (resolve) => require(['../views/404.vue'], resolve)
		},
	]
})
// 全局路由守卫
router.beforeEach((to, from, next) => {
	let token = localStorage.getItem("token");
	if (to.path === "/") {
		next();
		return;
	} else {
		if (token === null || token === "") {
			alert('您暂未登录，请先登录')
			next("/")
		} else {
			next();
		}
	}
});

export default router;
