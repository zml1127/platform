export default {
    // 获取油品列表
    'POST /merchantOil/getOilPageList': (req, res) => {
        // console.log('req==', req)
        res.send({
            "code": "0000",
            "data": [
              {
                "createTime": "2020-08-03T08:31:55.042Z",
                "creator": 0,
                "id": 0,
                "level": 0,
                "merchantNum": 111,
                "name": "92#",
                "pid": 0,
                "sort": 0,
                "status": 0
              },
              {
                "createTime": "2020-08-03T08:31:55.042Z",
                "creator": 0,
                "id": 1,
                "level": 0,
                "merchantNum": 111,
                "name": "95#",
                "pid": 0,
                "sort": 0,
                "status": 1
              }
            ],
            "msg": "string",
            "pages": 0,
            "reqId": "string",
            "rows": 0,
            "success": true
          })
        // res.send({
        //     "code": "0000",
        //     "data": [
        //       {
        //         "carModelId": 0,  //车型car_model.id
        //         "cateList": [//
        //           "string"
        //         ],
        //         "createTime": "2020-08-03T02:27:13.130Z", //创建时间
        //         "creator": 0, //创建人账号id
        //         "headPic": "string", //商户服务头图
        //         "id": 0, //
        //         "intro": "string", //服务提示
        //         "isCombo": 0, //是否组合(0-否,1-是)
        //         "level": 0, //
        //         "merchantId": 0, //商户id
        //         "name": "string", //服务内容名称
        //         "oriPrice": 0, //原价
        //         "pic": "string", //图片url，多个用逗号隔开
        //         "pid": 0, //父级id
        //         "price": 0, //优惠价
        //         "remark": "string", //服务备注
        //         "serviceCate2Id": 0, //二级类目id
        //         "serviceCateId": 0, //实际绑定类目id
        //         "serviceHisId": 0, //版本id 
        //         "sort": 0, //推荐排序，升序
        //         "status": 0, //状态1-上线 0-下线
        //         "textId": 0,  //服务详情
        //       }
        //     ],
        //     "msg": "string",
        //     "reqId": "string",
        //     "success": true
        // })
    },

    // 删除油品
    'GET /merchantOil/deleteOil': (req, res) => {
        res.send({
            "code": "0000",
            "data": "",
            "msg": "删除成功",
            "reqId": "string",
            "success": true
        })
    },

    // 下架油品
    'GET /merchantOil/oilOffline': (req, res) => {
        console.log('下架油品参数req.bodu==', req.body)
        res.send({
            "code": "0000",
            "data": "",
            "msg": "下架成功",
            "reqId": "string",
            "success": true
        })
    },

     // 上架油品
     'GET /merchantOil/oilOnline': (req, res) => {
        console.log('上架油品参数req.bodu==', req.body)
        res.send({
            "code": "0000",
            "data": "",
            "msg": "上架成功",
            "reqId": "string",
            "success": true
        })
    },

    // 添加油品号
    'POST /merchantOil/createOil': (req, res) => {
        res.send({
            "code": "0000",
            "data": {
              "createTime": "2020-08-04T00:47:47.811Z",
              "creator": 0,
              "id": 0,
              "level": 0,
              "name": "string",
              "pid": 0,
              "sort": 0,
              "status": 0
            },
            "msg": "string",
            "reqId": "string",
            "success": true
          })
    },

    // 获取店铺油品服务列表
    'POST /merchantOil/MerchantOilPage': (req, res) => {
        res.send({
            "code": "0000",
            "data": [
              {
                "area": "区域111111", //区域名称(省-市-区
                "createTime": "2020-08-03T11:03:23.670Z", //创建时间
                "creator": 0, //创建人账号id
                "discountFixed": 0, //折扣固定值
                "discountPercent": 5, //折扣百分比
                "enableDiscountFixed": 0, //是否启用折扣固定值
                "enableDiscountPercent": 0, //是否启用折扣百分比
                "guidePrice": 0, //官方指导价
                "gunNo": "string", //枪号
                "id": 1, 
                "isDelete": 0, //是否删除,0-否,1-是
                "merchantId": 111111111111111, //商户id
                "merchantName": "商户名称商户名称111", //商户名称
                "oilId": 111111, //油号id
                "price": 0, //站内价格
                "privilegePrice": 0, //
                "sort": 0,  //排序，升序
                "status": 0, //状态
                "updateTime": "2020-08-03T11:03:23.670Z", //修改时间
                "updater": 0, // 修改人id
              },
              {
                "area": "区域2222222", //区域名称(省-市-区
                "createTime": "2020-08-03T11:03:23.670Z", //创建时间
                "creator": 0, //创建人账号id
                "discountFixed": 0, //折扣固定值
                "discountPercent": 5, //折扣百分比
                "enableDiscountFixed": 0, //是否启用折扣固定值
                "enableDiscountPercent": 0, //是否启用折扣百分比
                "guidePrice": 0, //官方指导价
                "gunNo": "string", //枪号
                "id": 2, 
                "isDelete": 0, //是否删除,0-否,1-是
                "merchantId": 222222, //商户id
                "merchantName": "商户名称商户名称222", //商户名称
                "oilId": 222, //油号id
                "price": 0, //站内价格
                "privilegePrice": 0, //
                "sort": 0,  //排序，升序
                "status": 0, //状态
                "updateTime": "2020-08-03T11:03:23.670Z", //修改时间
                "updater": 0, // 修改人id
              },
            ],
            "msg": "string",
            "pages": 0,
            "reqId": "string",
            "rows": 0,
            "success": true
          })
    },

    // 获取历史列表
    'POST /merchantOil/merchantOilHisPageList': (req, res) => {
        console.log('req==', req.body)
        res.send({
            "code": "0000",
            "data": [
              {
                "createTime": "2020-08-04T03:02:51.988Z",
                "creator": 0,
                "discountFixed": 11,
                "discountPercent": 11,
                "enableDiscountFixed": 111,
                "enableDiscountPercent": 1111,
                "guidePrice": 11111, //挂牌价
                "gunNo": "string",
                "id": 1,
                "isDelete": 11,
                "merchantId": 1,
                "merchantOilId": 1,
                "oilId": 1,
                "price": 1,
                "sort": 11,
                "status": 1,
                "updateTime": "2020-08-04T03:02:51.988Z",//修改时间
                "updater": 0
              },
              {
                "createTime": "2020-08-04T03:02:51.988Z",
                "creator": 2,
                "discountFixed": 2,
                "discountPercent": 2,
                "enableDiscountFixed": 2,
                "enableDiscountPercent": 22,
                "guidePrice": 22, //挂牌价
                "gunNo": "string",
                "id": 2,
                "isDelete": 22,
                "merchantId": 22,
                "merchantOilId": 222,
                "oilId": 22,
                "price": 2,
                "sort": 2,
                "status": 0,
                "updateTime": "2020-08-04T03:02:51.988Z",//修改时间
                "updater": 2
              }
            ],
            "msg": "string",
            "pages": 0,
            "reqId": "string",
            "rows": 50,
            "success": true
        })
    },

    // 获取排序列表
    'GET /merchantOil/getMerchantOilByMerchantId': (req, res) => {
        res.send({
            "code": "0000",
            "data": [
              {
                "createTime": "2020-08-04T04:17:41.676Z",
                "creator": 0,
                "discountFixed": 111,
                "discountPercent": 11,
                "enableDiscountFixed": 11,
                "enableDiscountPercent": 11,
                "guidePrice": 1111,
                "gunNo": "1",
                "id": 1,
                "isDelete": 1,
                "merchantId": 1,
                "oilId": 1,
                "oilName": "92#",
                "price": 11,
                "sort": 1,
                "status": 1,
                "updateTime": "2020-08-04T04:17:41.676Z",
                "updater": 1
              },
              {
                "createTime": "2020-08-04T04:17:41.676Z",
                "creator": 0,
                "discountFixed": 222,
                "discountPercent": 22,
                "enableDiscountFixed": 22,
                "enableDiscountPercent": 22,
                "guidePrice": 2222,
                "gunNo": "2",
                "id": 2,
                "isDelete": 2,
                "merchantId": 2,
                "oilId": 2,
                "oilName": "95#",
                "price": 22,
                "sort": 2,
                "status": 0,
                "updateTime": "2020-08-04T04:17:41.676Z",
                "updater": 2
              },
              {
                "createTime": "2020-08-04T04:17:41.676Z",
                "creator": 3,
                "discountFixed": 33,
                "discountPercent": 33,
                "enableDiscountFixed": 33,
                "enableDiscountPercent": 33,
                "guidePrice": 3333,
                "gunNo": "3",
                "id": 3,
                "isDelete": 3,
                "merchantId": 3,
                "oilId": 3,
                "oilName": "98#",
                "price": 33,
                "sort": 3,
                "status": 1,
                "updateTime": "2020-08-04T04:17:41.676Z",
                "updater": 3
              },
            ],
            "msg": "string",
            "reqId": "string",
            "success": true
        })
    },

    // 排序
    'GET /merchantOil/sorting': (req, res) => {
        res.send({
            "code": "0000",
            "data": '',
            "msg": "string",
            "reqId": "string",
            "success": true
          })
    },

    // 获取回显信息 getById
    'GET /merchantOil/getById': (req, res) => {
        res.send({
            "code": "0000",
            "data": {
              "createTime": "2020-08-04T05:09:06.807Z",
              "creator": 0,
              "enableDiscountFixed": 1,
              "discountFixed": 1111,
              "enableDiscountPercent": 0,
              "discountPercent": 2222,
              "guidePrice": 1111,
              "gunNo": '1,5,6',
              "id": 0,
              "isDelete": 0,
              "merchantId": 0,
              "oilId": '92###',
              "oilName": "string",
              "price": 11,
              "sort": 0,
              "status": 1,
              "updateTime": "2020-08-04T05:09:06.807Z",
              "updater": 0
            },
            "msg": "string",
            "reqId": "string",
            "success": true
          })
    },

    // 提交表单 
    'POST /merchantOil/updateMerchantOil': (req, res) => {
        res.send({
            "code": "0000",
            "data": {
              "createTime": "2020-08-04T05:34:05.738Z",
              "creator": 0,
              "discountFixed": 0,
              "discountPercent": 0,
              "enableDiscountFixed": 0,
              "enableDiscountPercent": 0,
              "guidePrice": 0,
              "gunNo": "1,3,6",
              "id": 0,
              "isDelete": 0,
              "merchantId": 0,
              "oilId": 0,
              "price": 0,
              "sort": 0,
              "status": 0,
              "updateTime": "2020-08-04T05:34:05.738Z",
              "updater": 0
            },
            "msg": "提交成功",
            "reqId": "string",
            "success": true
          })
    },
    // 获取油枪号
    'GET /merchantOil/MerchantOilGun': (req, res) => {
        // console.log('req==', req)
        res.send({ "code": "0000", "data": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], "msg": "成功", "reqId": "997a2282fe0d4850b831f2334783806d" })
    },

    // 导入
    'POST /service/import': (req, res) => {
        console.log('导入啊啊啊req==', req.body)
    }

}