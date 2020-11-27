export default [
	{
		path: '/user',
		component: '../layouts/UserLayout',
		routes: [
			{
				name: 'login',
				path: '/user/login',
				component: './user/login',
			},
		],
	},
	{
		path: '/',
		component: '../layouts/SecurityLayout',
		routes: [
			{
				path: '/',
				component: '../layouts/BasicLayout',
				routes: [
					{
						path: '/',
						redirect: '/dashboard',
					},
					{
						path: '/dashboard',
						authority: 'dashboard',
						name: '数据看板',
						icon: 'smile',
						component: './dashboard',
					},
					{
						name: '店铺管理',
						icon: 'table',
						path: '/merchantManage',
						authority: 'merchantManage',
						routes:[
							{
								path: './',
								redirect: './merchant'
							},
							{
								icon: 'table',
								name:"店铺详情列表",
								path: '/merchantManage/merchant',
								component: './MerchantList',
								authority: 'merchant',
							},
							{
								icon: 'table',
								name:"店铺",
								hideInMenu:true,
								path: '/merchantManage/merchant/edit',
								component: './MerchantList/component/edit',
								authority: 'merchant',
							},
							{
								icon: 'table',
								name:"店铺详情",
								hideInMenu:true,
								path: '/merchantManage/merchant/details',
								component: './MerchantList/component',
								authority: 'merchant',
							},
							{
								name: '周边券查看',
								icon: 'schedule',
								hideInMenu:true,
								path: '/merchantManage/merchant/details/around/see',
								component: './MerchantList/component/around/aroundSee',
							},
							{
								name: '周边券添加',
								icon: 'schedule',
								hideInMenu:true,
								path: '/merchantManage/merchant/details/around/add',
								component: './MerchantList/component/around/aroundAdd',
							},
							{
								name: '商品券添加',
								icon: 'schedule',
								hideInMenu:true,
								path: '/merchantManage/merchant/details/good/add',
								component: './MerchantList/component/around/goodAdd',
							},
							{
								name: '商品券编辑',
								icon: 'schedule',
								hideInMenu:true,
								path: '/merchantManage/merchant/details/good/edit',
								component: './MerchantList/component/around/goodEdit',
							},
							{
								icon: 'table',
								name:"连锁店铺详情列表",
								path: '/merchantManage/bromerchant',
								component: './BroMerchantList',
								authority: 'bromerchant',
							},
							{
								icon: 'table',
								name:"连锁店铺",
								hideInMenu:true,
								path: '/merchantManage/bromerchant/edit',
								component: './BroMerchantList/component/edit',
								authority: 'bromerchant',
							},
							{
								name:'合同签约数据',
								authority:'tract',
								icon:'car',
								path:'/merchantManage/contractsigning',
								component:'./contractsigning',
								authority: 'merchant',
							},
						]
					},
					{
						name: '服务管理',
						icon: 'schedule',
						path: '/service',
						authority: 'service',
						routes: [
							{
								path: './',
								redirect: './gasService'
							},
							{
								name: '油品管理',
								icon: 'schedule',
								path: '/service/gasService',
								component: './service/gasService',
								authority: 'gasService'
							},
							{
								hideInMenu:true,
								name: '店铺油品服务列表',
								icon: 'schedule',
								path: '/service/gasService/gasServiceList',
								component: './service/gasServiceList',
								authority: 'gasService'
							},
							{
								hideInMenu:true,
								name: '店铺排序服务页',
								icon: 'schedule',
								path: '/service/gasService/gasServiceList/gasSort',
								component: './service/gasSort',
								authority: 'gasService'
							},
							{
								name: '店铺洗美服务列表',
								icon: 'schedule',
								hideInMenu:true,
								path: '/service/washService/list',
								component: './service/washService/component',
								authority: 'washService'
							},
							{
								name: '店铺洗美排序页',
								icon: 'schedule',
								hideInMenu:true,
								path: '/service/washService/list/sort',
								component: './service/washService/component/sort',
								authority: 'washService'
							},
							{
								name: '店铺洗美服务编辑页',
								icon: 'schedule',
								hideInMenu:true,
								path: '/service/washService/list/edit',
								component: './service/washService/component/edit',
								authority: 'washService'
							},
							{
								component: './404',
								hideInMenu:true,
								name: '店铺油品编辑页',
								icon: 'schedule',
								path: '/service/gasService/gasServiceList/gasEdit',
								component: './service/gasEdit',
								authority: 'gasService'
							},
							{
								name: '洗美服务列表',
								icon: 'schedule',
								path: '/service/washService',
								component: './service/washService',
								authority: 'washService'
							},
							{
								component: './404',
							},
						],
					},
					{
						name: '营销管理',
						icon: 'schedule',
						path: '/market',
						authority: 'market',
						routes: [
							{
								path: './',
								redirect: './makeGroup'
							},
							{
								name: '多人拼团',
								icon: 'schedule',
								path: '/market/makeGroup',
								component: './market/makeGroup',
								authority: 'makeGroup',
							},
							{
								name: '多人拼团参加店铺详情',
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/makeGroup/makeGroupDetail',
								component: './market/makeGroup/makeGroupDetail',
								authority: 'makeGroup',
							},
							{
								name: '普通拼团', //多人拼团员页编辑跳过来的
								curd: true, //
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/makeGroup/cEGroup',
								component: './market/makeGroup/cEGroup',
								authority: 'makeGroup',
							},
							{
								name: '编辑', //店铺详情页编辑跳过来的
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/makeGroup/makeGroupDetail/edit',
								component: './market/makeGroup/edit',
								authority: 'makeGroup',
							},
							{
								name: '优惠券管理',
								icon: 'schedule',
								path: '/market/coupon',
								component: './market/coupon',
								authority: 'coupon',
							},
							{
								name: '平台优惠券',
								curd: true, //
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/coupon/createEditPlatCoupon',
								component: './market/coupon/createEditPlatCoupon',
								authority: 'coupon',
							},
							{
								name: '店铺优惠券',
								curd: true, //
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/coupon/createEditShopCoupon',
								component: './market/coupon/createEditShopCoupon',
								authority: 'coupon',
							},
							{
								name: '商品券',
								curd: true, 
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/coupon/createEditGoods',
								component: './market/coupon/createEditGoods',
								authority: 'coupon',
							},
							{
								name: '优惠券参加店铺详情',
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/coupon/partShopDetail',
								component: './market/coupon/partShopDetail',
								authority: 'coupon',
							},
							{
								name: '编辑',
								hideInMenu: true,
								icon: 'schedule',
								path: '/market/coupon/partShopDetail/edit',
								component: './market/coupon/edit',
								authority: 'coupon',
							},
							{
								name: '周边券管理',
								icon: 'schedule',
								path: '/market/around',
								component: './market/around',
								authority: 'around',
							},
							{
								name: '(周边券)',
								icon: 'schedule',
								hideInMenu: true,
								path: '/market/around/edit',
								component: './market/around/edit',
								authority: 'around',
								curd:true,
								parentText:"新增"
							},
							{
								name: '调取券数据',
								icon: 'schedule',
								hideInMenu: true,
								path: "/market/around/edit/add",
								component: './market/around/editAdd',
								authority: 'around',
								curdD:true,
							},
							{
								name: '调取券数据',
								icon: 'schedule',
								hideInMenu: true,
								path: "/market/around/edit/see",
								component: './market/around/editAddSee',
								authority: 'around',
								curdD:true,
							},
							{
								name: '服务券订单',
								icon: 'schedule',
								hideInMenu: true,
								path: '/market/around/serverCouponOrder',
								component: './market/around/serverCouponOrder/index',
								authority: 'around',
							},
							{
								name: '券类型维护',
								icon: 'schedule',
								path: '/market/couponMaintenance',
								component: './market/couponmaintain',
								authority: 'around',
							},
							{
								name: '本地生活服务',
								icon: 'schedule',
								path: '/market/localLife',
								component: './market/localLife',
								authority: 'localLife',
							},
							{
								name: '添加本地车生活',
								icon: 'schedule',
								path: '/market/localLife/add',
								component: './market/localLife/add',
								authority: 'localLife',
								hideInMenu: true,
							},
							{
								name: '查看',
								icon: 'schedule',
								path: '/market/localLife/see',
								component: './market/localLife/see',
								authority: 'localLife',
								hideInMenu: true,
							},
							{
								name: '选择团长',
								icon: 'schedule',
								path: '/market/localLife/choose',
								component: './market/localLife/choose',
								authority: 'localLife',
								hideInMenu: true,
							},
							{
								name: '推送记录',
								icon: 'schedule',
								path: '/market/localLife/record',
								component: './market/localLife/record',
								authority: 'localLife',
								hideInMenu: true,
							},
							{
								name: '推送详情',
								icon: 'schedule',
								path: '/market/localLife/record/detail',
								component: './market/localLife/recordDetail',
								authority: 'localLife',
								hideInMenu: true,
							},
							{
								component: './404',
							},
						],
					},
					{
						name: '用户管理',
						icon: 'schedule',
						path: '/userManagement',
						authority:'userManagement',
						routes: [
							{
								path: './',
								redirect: './userInfo',
							},
							{
								name: '用户信息',
								icon: 'schedule',
								authority:'userInfo',
								path: '/userManagement/userInfo',
								component: './userManagement/userInfo',
							},
							{
								name: '用户信息详情查看',
								path: '/userManagement/userInfo/detail',
								component: './userManagement/userInfo/detail',
								hideInMenu:true,
								authority:'userInfo',
							},
							{
								component: './404',
							},
						]
					},
					{
						name:'活动管理',
						icon:'schedule',
						path:'/MOA',
						authority: 'moa',
						routes:[
							{
								path: './',
								redirect: './entrance',
							},
							{
								path:"/MOA/entrance",
								name:"活动入口",
								icon: 'schedule',
								component:"./MOA/entrance",
								authority: 'moa',
							},
							{
								path:"/MOA/entrance/edit",
								name:"活动入口",
								hideInMenu:true,
								curd: true,
								icon: 'schedule',
								component:"./MOA/entrance/edit",
								authority: 'moa',
							},
							{
								path:"/MOA/set",
								name:"活动设置",
								icon: 'schedule',
								component:"./MOA/set",
								authority: 'moa',
							},
							{
								path:"/MOA/set/edit",
								name:"平台活动",
								hideInMenu:true,
								curd: true,
								icon: 'schedule',
								component:"./MOA/set/edit",
								authority: 'moa',
							},
							{
								path:"/MOA/set/edit",
								name:"平台活动",
								hideInMenu:true,
								curd: true,
								icon: 'schedule',
								component:"./MOA/set/edit",
								authority: 'moa',
							},
						]
					},
					{
						name:'分销管理',
						icon:'schedule',
						path:'/retail',
						authority: 'retail',
						routes:[
							{
								path: './',
								redirect: './retail',
							},
							{
								name:"团长列表",
								icon: 'schedule',
								path:"/retail/teamLeader",
								component:"./retail/teamLeader",
								authority: 'teamLeader',
							},
							{
								name:"提现申请列表",
								icon: 'schedule',
								path:"/retail/application",
								component:"./retail/application",
								authority: 'application',
							},
							{
								name:"提现设置",
								icon: 'schedule',
								path:"/retail/setting",
								component:"./retail/setting",
								authority: 'withdrawSetting',
							},
						]
					},
					
					{
						name: '运营管理',
						icon: 'schedule',
						path: '/operation',
						authority:'operate',
						routes: [
							{
								path: './',
								redirect: './material',
							},
							{
								name: '素材库',
								icon: 'schedule',
								path: '/operation/material',
								component: './operation/material',
								authority:'material',
							},
							{
								name: '素材',
								path: '/operation/material/detail',
								component: './operation/material/detail',
								authority:'material',
								hideInMenu:true,
								curd:true,
							},
							// {
							// 	name: '小程序模板消息',
							// 	icon: 'schedule',
							// 	path: '/operation/applets',
							// 	component: './operation/applets',
							// 	authority:'applets',
							// },
							// {
							// 	name: '模版消息',
							// 	path: '/operation/applets/detail',
							// 	component: './operation/applets/detail',
							// 	curd:true,
							// 	authority:'applets',
							// 	hideInMenu:true,
							// },
							{
								name: '意见反馈',
								icon: 'schedule',
								path: '/operation/feedback',
								component: './operation/feedback',
								authority:'feedback',
							},
							{
								name: '意见反馈详情',
								path: '/operation/feedback/detail',
								component: './operation/feedback/detail',
								hideInMenu:true,
								curd:true,
								authority:'feedback',
							},
							{
								component: './404',
							},
						]
					},
					{
						name: '交易查询',
						icon: 'schedule',
						path: '/order',
						authority: 'order',
						routes: [
							{
								path: './',
								redirect: './oilOrder',
							},
							{
								name: '加油订单',
								authority: 'oilOrder',
								icon: 'cluster',
								path: '/order/oilOrder',
								component: './order/oilOrder',
							},

							{
								name: '服务订单',
								authority: 'serviceOrder',
								icon: 'car',
								path: '/order/serviceOrder',
								component: './order/serviceOrder',
							},
							{
								name: '兑换记录',
								authority: 'goodsOrder',
								icon: 'schedule',
								path: '/order/goodsOrder',
								component: './order/goodsOrder',
							},
							{
								name: '保险订单',
								authority: 'insureOrder',
								icon: 'car',
								path: '/order/insureOrder',
								component: './order/insureOrder',
							},
							{
								name: '分销订单',
								authority: 'distributionOrder',
								icon: 'car',
								path: '/order/distributionOrder',
								component: './order/distributionOrder',
							},
							// {
							// 	name: '礼包记录订单',
							// 	authority: 'giftOrder',
							// 	icon: 'car',
							// 	path: '/order/giftOrder',
							// 	component: './order/giftOrder',
							// },
							// {
							// 	name: '礼包记录详情',
							// 	authority: 'giftOrder',
							// 	icon: 'car',
							// 	path: '/order/giftOrder/detail',
							// 	component: './order/giftOrder/detail.jsx',
							// 	hideInMenu:true,
							// },
							// {
							// 	name: '平台收款订单',
							// 	authority: 'collectionOrder',
							// 	icon: 'car',
							// 	path: '/order/collectionOrder',
							// 	component: './order/collectionOrder',
							// },
							{
								component: './404',
							},
						],
					},
					/*{
						name: '保险设置',
						authority: 'insure',
						icon: 'setting',
						path: '/insure',
						routes: [
							{
								path: '/insure',
								redirect: './agent',
							},
							{
								name: '代理人信息',
								authority: 'agent',
								icon: 'userSwitch',
								path: '/insure/agent',
								component: './insure/agent',
							},
							{
								component: './404',
							}
						]
					},*/
					{
						name: '系统设置',
						authority: 'system',
						icon: 'setting',
						path: '/system',
						routes: [
							{
								path: './',
								redirect: './role',
							},
							{
								name: '权限设置',
								authority: 'role',
								path: '/system/role',
								component: './system/role',
								icon: 'userSwitch',
							},
							{
								name: '权限',
								authority: 'role',
								curd: true,
								hideInMenu: true,
								path: '/system/role/detail',
								component: './system/role/detail',
							},
							{
								name: '管理员设置',
								authority: 'admin',
								icon: 'team',
								path: '/system/admin',
								component: './system/admin',
							},
							{
								name: '管理员',
								authority: 'admin',
								curd: true,
								hideInMenu: true,
								path: '/system/admin/detail',
								component: './system/admin/detail',
							},
							/*{
								name: '操作日志',
								authority: 'log',
								icon: 'database',
								path: '/system/log',
								component: './system/log',
							},*/
							{
								component: './404',
							},
						],
					},
					{
						component: './404',
					},
				],
			},
			{
				component: './404',
			},
		],
	},
	{
		component: './404',
	},
];
