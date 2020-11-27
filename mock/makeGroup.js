export default {
    // 获取拼团列表
    'GET /market/marketGroupTpl/pageList': (req, res) => {
        console.log('获取拼团列表参数req.body==', req.body)
        res.send({
            "code": "0000",
            "data": [
              {
                "automaticState": 0,
                "effectNum": 0,
                "endLimitFlag": 0,
                "endTime": "2020-08-04T09:15:32.383Z", //活动结束时间
                "freeState": 0,
                "groupCode": "string",
                "id": 1,
                "joinMerchantNum": 100, //joinMerchantNum
                "limitFlag": 0,
                "serviceCateId": 0,
                "specifiedMerchantFlag": 0,
                "startLimitFlag": 0,
                "startTime": "2020-08-04T09:15:32.383Z", //活动开始时间
                "status": 2
              }
            ],
            "msg": "string",
            "pages": 0,
            "reqId": "string",
            "rows": 50,
            "success": true
          })
    },

    // 洗美类型二级查询 
    'GET /merchant/merchantService/serviceCategoryList': (req, res) => {
        res.send({
            "code": "0000",
            "data": [
              {
                "createTime": "2020-07-29 17:22:36",
                "creator": 1,
                "id": "21",
                "level": 2,
                "name": "洗车",
                "pid": 20,
                "sort": 1,
                "status": 1
              },
              {
                "createTime": "2020-07-29 17:22:36",
                "creator": 1,
                "id": "22",
                "level": 2,
                "name": "美容",
                "pid": 20,
                "sort": 1,
                "status": 1
              },
              {
                "createTime": "2020-07-29 17:22:36",
                "creator": 1,
                "id": "23",
                "level": 2,
                "name": "装饰改装",
                "pid": 20,
                "sort": 1,
                "status": 1
              }
            ],
            "msg": "OK",
            "reqId": ""
          })
    },
    // 提交表单 创建修改 
    'POST /market/marketGroupTpl/createOrUpdate': (req, res) => {
        res.send({
            "code": "0000",
            "data": "string",
            "msg": "string",
            "reqId": "string",
            "success": true
        })
    },
    // 编辑普通拼团回显
    'POST /marketGroupTpl/getGroupTplInfo': (req, res) => {
        res.send({
            "code": "0000",
            "data": {
              "id": 0,
              "serviceCateId": '22', ////服务类别id
              "startLimitFlag": 1, //开始时间标志  1限制 0不限制
              "startTime": "2020-08-05T03:22:14.967Z", //开始时间
              "endLimitFlag": 0, //结束时间标志
              "endTime": "2020-08-05T03:22:14.967Z",//结束时间
              "automaticState": 1, //自动补团状态1开启，0未开启
              "effectNum": 111, //拼团生效人数，0表示自动补齐
              "limitFlag": 1, //限购规则 1限购 0不限购
              "ruleList": [ //限制规则
                {
                  "belongId": 0,
                  "belongType": 0,
                  "day": 0,
                  "hour": 23,
                  "limitNum": 11111,
                  "minute": 59
                }
              ],
              "freeState": 0,   //店铺自由参与标识1开启，0未开启
              "specifiedMerchantFlag": 1, //指定参加店铺参与标识1开启，0未开启
              "merchantListId": [
                '1290249482260242433','1290249382033154049'
              ],
              
              "status": 0
            },
            "msg": "string",
            "reqId": "string",
            "success": true
        })
    },
    // 获取拼团详情列表
    'POST /getGroupDetailList': (req, res) => {
        res.send({
          "code": "0000",
          "data": [
            {
              "merchantName": "店铺名称11",
              "area": "地区啊啊",
              "groupName": "拼团名称11",
              "price": 111, //拼团价
              "joinNum": 1111, //参团人数
              "cloudsNum": 11111, //成团人数
              "serviceCateId": 0,
              "serviceId": 0,
              "stockNum": 1111111, //库存
              "createTime": "2020-08-10T04:43:29.498Z", //创建时间
              "current": 0,
              "groupCode": "string",
              "groupTplId": 0,
              "id": 0,
              "merchantId": 0,
              "pagesize": 0,
              "status": 0,
              "useStock": 0
            }
          ],
          "msg": "string",
          "pages": 0,
          "reqId": "string",
          "total": 70,
          "success": true
        })
    },
    'GET /getById': (req, res) => {
      res.send({
        "code": "0000",
        "data": {
          "groupName": "拼团名称呀呀呀呀", //拼团名称
          "price": 22222, //拼团价
          "stockNum": 33333, //库存,-1不限制
          "joinNum": 22, //参团人数
          "createTime": "2020-08-07T09:37:17.479Z",
          "creator": 0,  //创建人账号id
          "groupCode": "string", //拼团code，D(店铺)+PT(拼团)+2020(年份)+00001
          "groupTplId": 0, //活动模板表
          "id": 0, 
          "merchantId": 0, //店铺id
          "serviceCateId": 0, //服务2级类目id
          "serviceId": 0, //关联服务id
          "status": 0, //1开启0失效
          "useStock": 0, //库存已用数
        },
        "msg": "string",
        "reqId": "string",
        "success": true
      })
    },

}