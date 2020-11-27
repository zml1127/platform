export default {
    // 获取油品列表
    'POST /api/coupon/getCouponList': (req, res) => {
        console.log('req==', req.body)
        if (req.body.platShopType == 1) { //平台
            res.send({
                "code": "0000", "data": [
                    {
                        id: 'PYHQ202000001',
                        name: '端午优惠券1',
                        serviceType: '标准洗车',
                        couponType: '满减券',
                        couponContent: '满100减10元',
                        save: '49/99',
                        usedNum: 30,
                        partShop: 111,
                        status: 1,
                    },
                    {
                        id: 'PYHQ202000002',
                        name: '国庆优惠券',
                        serviceType: '精致洗车',
                        couponType: '折扣券',
                        couponContent: '无门槛打7折',
                        save: '0/500',
                        usedNum: 0,
                        partShop: 222,
                        status: 0,
                    },
                    {
                        id: 'PYHQ202000003',
                        name: '10周年优惠券',
                        serviceType: '标准洗车',
                        couponType: '商品兑换全',
                        couponContent: '无门槛',
                        save: '100/111',
                        usedNum: 99,
                        partShop: 333,
                        status: 0,
                    },
                ],
                "total": 100,
                "msg": "成功", "reqId": "997a2282fe0d4850b831f2334783806d"
            })
        } else { //店铺
            res.send({
                "code": "0000", "data": [
                    {
                        id: 'QQQ020001111',
                        status: 1,
                        partShop: 111,
                        applicateServiceType: '加油',
                        validityTerm: '2020.05.05 12:00:00 至 2020.06.06 12:00:00',
                    },
                    {
                        id: 'WWW20202222',
                        status: 0,
                        partShop: 222,
                        applicateServiceType: '洗车',
                        validityTerm: '2222.05.05 12:00:00 至 2020.06.06 12:00:00',
                    },
                    {
                        id: 'EEE20203333',
                        status: 1,
                        partShop: 333,
                        applicateServiceType: '美容',
                        validityTerm: '3333.05.05 12:00:00 至 2020.06.06 12:00:00',
                    },
                ],
                "total": 30,
                "msg": "成功", "reqId": "997a2282fe0d4850b831f2334783806d"
            })
        }

    },

    // 点击参加店铺数获取店铺列表
    'POST /api/coupon/getShopList': (req, res) => {
        res.send({
            "code": "0000", "data": [
                { id: 1, area: '天津市-天津市-河东区', shopName: 'XXXXX1111' },
                { id: 2, area: '天津市-天津市-和平区', shopName: 'XXXXX2222' },
                { id: 3, area: '天津市-天津市-河北区', shopName: 'XXXXX3333' },
                { id: 4, area: '天津市-天津市-滨海新区', shopName: 'XXXXX4444' },
                { id: 5, area: '辽宁-大连啊啊啊-沙河口区星海广场', shopName: 'XXXXX5555' },
            ],
            "total": 100,
            "msg": "成功", "reqId": "997a2282fe0d4850b831f2334783806d"
        })
    },

    // 获取关联服务列表
    'GET /merchantService/serviceCategoryLinkage': (req, res) => {
        console.log('req-==', req.query)
        if (req.query.pid == 1) { //加油
            res.send({
                "code": "0000", "data": [{
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [],
                                            "createTime": "2020-07-29 17:22:35",
                                            "creator": 1,
                                            "id": "666",
                                            "level": 4,
                                            "name": "第四级1#",
                                            "pid": 6666666,
                                            "sort": 6666666,
                                            "status": 666666666
                                        },
                                        {
                                            "children": [],
                                            "createTime": "2020-07-29 17:22:35",
                                            "creator": 1,
                                            "id": "7771111231",
                                            "level": 4,
                                            "name": "第四级2#",
                                            "pid": 77777,
                                            "sort": 77777,
                                            "status": 7777,
                                        },
                                    ],
                                    "createTime": "2020-07-29 17:22:35",
                                    "creator": 1,
                                    "id": "333",
                                    "level": 3,
                                    "name": "第三季1#",
                                    "pid": 333,
                                    "sort": 333,
                                    "status": 333
                                },
                                {
                                    "children": [],
                                    "createTime": "2020-07-29 17:22:35",
                                    "creator": 1,
                                    "id": "44444444410",
                                    "level": 3,
                                    "name": "第三季2#",
                                    "pid": 4444,
                                    "sort": 4444,
                                    "status": 4444
                                },
                            ],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "21",
                            "level": 2,
                            "name": "92#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "22",
                            "level": 2,
                            "name": "95#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "23",
                            "level": 2,
                            "name": "98#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "24",
                            "level": 2,
                            "name": "0#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:36",
                            "creator": 1,
                            "id": "25",
                            "level": 2,
                            "name": "-10#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        }
                    ], "createTime": "2020-07-29 17:22:35", "creator": 1, "id": "1", "level": 1, "name": "加油", "pid": 0, "sort": 1, "status": 1
                }, {
                    "children": [
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:36",
                            "creator": 1,
                            "id": "201",
                            "level": 2,
                            "name": "洗车",
                            "pid": 20,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:36",
                            "creator": 1,
                            "id": "202",
                            "level": 2,
                            "name": "美容",
                            "pid": 20,
                            "sort": 1,
                            "status": 1
                        }], "createTime": "2020-07-29 17:22:36", "creator": 1, "id": "20", "level": 1, "name": "洗美", "pid": 0, "sort": 1, "status": 1
                }], "msg": "OK", "reqId": "0a26795e3d9c41ae8620c109604c7edd"
            })
        } else {
            res.send({
                "code": "0000", "data": [{
                    "children": [
                        {
                            "children": [
                                {
                                    "children": [
                                        {
                                            "children": [],
                                            "createTime": "2020-07-29 17:22:35",
                                            "creator": 1,
                                            "id": "410",
                                            "level": 4,
                                            "name": "第四级41#",
                                            "pid": 6666666,
                                            "sort": 6666666,
                                            "status": 666666666
                                        },
                                        {
                                            "children": [],
                                            "createTime": "2020-07-29 17:22:35",
                                            "creator": 1,
                                            "id": "420",
                                            "level": 4,
                                            "name": "第四级42#",
                                            "pid": 77777,
                                            "sort": 77777,
                                            "status": 7777
                                        },
                                    ],
                                    "createTime": "2020-07-29 17:22:35",
                                    "creator": 1,
                                    "id": "310",
                                    "level": 3,
                                    "name": "洗啊洗31#",
                                    "pid": 333,
                                    "sort": 333,
                                    "status": 333
                                },
                                {
                                    "children": [],
                                    "createTime": "2020-07-29 17:22:35",
                                    "creator": 1,
                                    "id": "3020",
                                    "level": 3,
                                    "name": "洗啊洗32",
                                    "pid": 444,
                                    "sort": 444,
                                    "status": 444
                                },
                            ],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "210",
                            "level": 2,
                            "name": "洗车21#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "220",
                            "level": 2,
                            "name": "洗车22#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "230",
                            "level": 2,
                            "name": "洗车23#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:35",
                            "creator": 1,
                            "id": "240",
                            "level": 2,
                            "name": "洗车24#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:36",
                            "creator": 1,
                            "id": "250",
                            "level": 2,
                            "name": "-洗车25#",
                            "pid": 1,
                            "sort": 1,
                            "status": 1
                        }
                    ], "createTime": "2020-07-29 17:22:35", "creator": 1, "id": "1111110", "level": 1, "name": "洗车", "pid": 0, "sort": 1, "status": 1
                }, {
                    "children": [
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:36",
                            "creator": 1,
                            "id": "200010",
                            "level": 2,
                            "name": "洗车",
                            "pid": 20,
                            "sort": 1,
                            "status": 1
                        },
                        {
                            "children": [],
                            "createTime": "2020-07-29 17:22:36",
                            "creator": 1,
                            "id": "2222220",
                            "level": 2,
                            "name": "美容",
                            "pid": 20,
                            "sort": 1,
                            "status": 1
                        }], "createTime": "2020-07-29 17:22:36", "creator": 1, "id": "1023", "level": 1, "name": "洗美", "pid": 0, "sort": 1, "status": 1
                }], "msg": "OK", "reqId": "0a26795e3d9c41ae8620c109604c7edd"
            })
        }

    },

    // 平台优惠券编辑回显
    'POST /market/merchantCoupon/getCouponInfo': (req, res) => {
        res.send({
            "code": "0000",
            "data": {
            "couponType": 1, //优惠券类型
            "name": "优惠券名称111", //优惠券名称
            "faceValue": 111, //优惠券面额
            "totalNum": 1111, //发券数量
            "serviceType": 20, //关联服务项 1为加油 20为洗美
              "couponServiceList": [
                {
                  "couponId": 0,
                  "serviceCateId": 0,
                  "serviceCateName": 0,
                  "serviceId": 0,
                  "serviceName": 0
                }
              ],
              "goodsId": '2', //兑换品ID
              "useCondition": 1, //使用门槛 0 标识无门槛,1-有门槛
              "matchAmount": 1111111, //满足面额使用条件

              "startLimitFlag": 0,//活动开始时间限制标识1限制，0不限制
              "startTime": "2000-08-06T06:06:41.866Z",
              "endLimitFlag": 1,
              "endTime": "2022-12-06T06:06:41.866Z",
              "effectFlag": 0, //生效标识  1立即生效 0选时间
              "useStartTime": "2020-11-06T06:06:41.866Z",
              "useEndTime": "2033-12-06T06:06:41.866Z", //用券开始时间
              
              "userType": 4, //用户类型0 不限制，1新用户，2普通用户，3活跃用户，4沉默用户
              "limitFlag": 1, //领取规则标识1限制，0不限制
              "ruleList": [ //限购规则
                {
                  "belongId": 0,
                  "belongType": 0,
                  "limitNum": 111, //限购人次-1表示不限制，正整数表示限购人次
                  "day": 6,
                  "hour": 7,
                  "minute": 8
                }
              ],
              "freeState": 1, //店铺自由参与标识1开启，0未开启
              "specifiedMerchantFlag": 0, //指定参加店铺参与标识1开启，0未开启
              "couponStatus": 0,
              
              "goodsNum": 0,
              "id": 0,
             
              
              "merchantListId": [
                1,2
              ],
              "remark": "string",
              
              "serviceItemFlag": 0,
            },
            "msg": "string",
            "reqId": "string",
            "success": true
          })
    },
    // 获取兑换物品列表
    'GET /market/actgoods/list': (req, res) => {
        res.send({ "code": "0000", "data": [{ "createTime": null, "creator": null, "id": "1", "name": "玻璃水", "pic": "", "totalNum": 111 }, { "createTime": null, "creator": null, "id": "2", "name": "水玻璃", "pic": "", "totalNum": 222 },{ "createTime": null, "creator": null, "id": "3", "name": "水玻璃啊啊啊", "pic": "", "totalNum": 222 }], "msg": "OK", "reqId": "bde68d6d511949849eb5bdeb45c7e513" })
    },

    // 获取店铺详情列表
    'POST /getCouponGroup': (req, res) => {
        console.log('获取店铺详情列表req.body==', req.body)
        res.send({
            "code": "0000",
            "data": [
              {
                "merchantName": "店铺名称11",
                "area": "地区111",
                "couponType": 2, //优惠券类型
                "useCondition": 0, //使用门槛 0 标识无门槛,1-有门槛
                "faceValue": 7, //面额
                "goodsName": "string",  //兑换品名称
                "goodsNum": 0, 
                "receiveNum": 10, //已领取数量
                "totalNum": 1000, //券数量,-1-无限制
                "couponCode": "string",
                "serviceName": "服务项目名称11",
                "couponTplId": 0,
                "createTime": "2020-08-10T05:11:32.572Z",
                "current": 0,
                "id": 0,
                "merchantId": 0,
                "pagesize": 0,
                "serviceCateId": 0,
                "serviceCateName": "string",
                "serviceId": 0,
                "serviceItemFlag": 0,
                "status": 0,
                "useNum": 0
              }
            ],
            "msg": "string",
            "pages": 0,
            "reqId": "string",
            "total": 70,
            "success": true
          })
    },
    // 店铺优惠券编辑回显
    'POST /getCouponTplInfo': (req, res) => {
        console.log('编辑湖西岸参数req.params', req)
        res.send({
            "code": "0000",
            "data": {
              "couponType": 2, //券类型,1-满减券,2-折扣券,3-商品兑换券
              "serviceCateId": '22', //服务类型id
              "startLimitFlag": 1, //活动开始时间限制标识1限制，0不限制
              "startTime": "2020-08-06T07:35:50.059Z",
              "endLimitFlag": 0, //活动结束时间限制标识1限制，0不限制
              "endTime": "2020-08-06T07:35:50.059Z",
              "userType": 2, //用户类型0 不限制，1新用户，2普通用户，3活跃用户，4沉默用户
              "limitFlag": 1, //领取规则标识1限制，0不限制
              "ruleList": [ //限制规则
                {
                  "belongId": 0,
                  "belongType": 0,
                  "limitNum": 100,
                  "day": 6,
                  "hour": 7,
                  "minute": 8
                }
              ],
              "freeState": 1, //店铺自由参与标识1开启，0未开启
              "specifiedMerchantFlag": 0, //指定参加店铺参与标识1开启，0未开启 
              "effectFlag": 0,//生效标识1 立即生效
              "id": 0,
              
              "merchantListId": [ //商户id集合
                0
              ],
              "name": "string", //名称
              "remark": "string",//备注
              
              "status": 0,
              "useEndTime": "2020-08-06T07:35:50.059Z",//用券结束时间
              "useStartTime": "2020-08-06T07:35:50.059Z",//用券开始时间
              
            },
            "msg": "string",
            "reqId": "string",
            "success": true
          })
    },

    // 优惠券详情页编辑
    'POST /updateMerchantCouponExtend': (req, res) => {
        res.send({
            "code": "0000",
            "data": "string",
            "msg": "string",
            "reqId": "string",
            "success": true
        })
    },  
    // 优惠券详情页编辑回显 
    'GET /getMerchantExtendById': (req, res) => {
        res.send({
            "code": "0000", 
            "data": {
              "couponType": 2, //券类型,1-满减券,2-折扣券,3-商品兑换券
              "name": "优惠券名称咿呀呀呀", //名称
              "faceValue": 111, //面额
              "totalNum": 222, //券数量
              "serviceType": 20, //1加油，20 洗美
              "couponServiceList": [ //服务列表
                // {'serviceCateId': "24", 'serviceId': "24"},
                {"serviceCateId":"21","serviceId":"28"},{"serviceCateId":"21","serviceId":"21"},{"serviceCateId":"21","serviceId":"27"},{"serviceCateId":"21","serviceId":"29"},{"serviceCateId":"24","serviceId":"24"} //洗美

                // {'serviceCateId': "6", 'serviceId': "6"}, //加油
                // {'serviceCateId': "3", 'serviceId': "3"}, //加油
              ],
              "goodsId": 2, //兑换品id
              "goodsNum": 1, //兑换品数量
              "useCondition": 0, //使用门槛 0 标识无门槛,1-有门槛
              "matchAmount": 999, //满足面额使用条件
              'startLimitFlag': 1, //活动开始时间限制标识1限制，0不限制
              'startTime': '1995-11-27 00:00:00',
              'endLimitFlag': 0, 
              'endTime': '2020-08-07 12:12:12',

              "effectFlag": 1, //生效标识1 立即生效
              "id": 0, 
              
              "useStartTime": "2020-12-07T07:01:15.304Z", //用券开始时间
              "useEndTime": "2032-08-07T07:01:15.304Z", //用券结束时间
            },
            "msg": "string",
            "reqId": "string",
            "success": true
          })
    },
}