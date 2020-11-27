export default {
  // 支持值为 Object 和 Array
  'GET /api/operation/mayerialList': {
    code: '0000',
    current: 1,
    data: [
      {
      id:"1",
      materialSpecs:"400*500",
      imgUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595931790705&di=9fbcf948fb4d834b14acfe0dbac849f0&imgtype=0&src=http%3A%2F%2Fbbsfiles.vivo.com.cn%2Fvivobbs%2Fattachment%2Fforum%2F201610%2F10%2F223520gj6otfv9t51t9oi9.jpg',
      materailName:"优秀",
      remark:"不错不错",
      name:"123",
    },
    {
      id:"2",
      materialSpecs:"700*800",
      imgUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596014744057&di=def293d0e9bff792020a3a677917b6fa&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3De67e5086054f78f0800b9afb49300a83%2F56b50df3d7ca7bcb17d509fdb8096b63f424a8f5.jpg',
      materailName:"好极了",
      remark:"不错不错",
      name:"123",
    },

    ],
    total: 123
  },
  'GET /api/opmaterial/getById': {
    code: '0000',
    current: 1,
    id:"2",
    type:1,
    specs:"700*800",
    imgUrl:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596014744057&di=def293d0e9bff792020a3a677917b6fa&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3De67e5086054f78f0800b9afb49300a83%2F56b50df3d7ca7bcb17d509fdb8096b63f424a8f5.jpg',
    materailName:"好极了",
    remark:"不错不错",
    name:"123",
  },

  'GET /api/opmaterial/delete': {
    code: '0000',
    msg:""
  },
 
  'GET /api/operation/appletsList': {
    code: '0000',
    current: 1,
    data: [
      {
      id:"1",
      infoType:"1",
      userName:"啊哈哈哈",
      phone:'13467891234',
      weekStart:"2012-12-12",
      weekEnd:"2012-12-13",
      templateCon:"ahhhahahahhah",
      timeList:[{time:"09:34:36"},{time:"09:34:39"}],
    },
    {
      id:"2",
      infoType:"2",
      userName:"啊哈哈哈",
      phone:'13467891234',
      imgBanner:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596014744057&di=def293d0e9bff792020a3a677917b6fa&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3De67e5086054f78f0800b9afb49300a83%2F56b50df3d7ca7bcb17d509fdb8096b63f424a8f5.jpg',
      temName:"好极了",
      remark:"不错不错",
      weekStart:"2012-12-12",
      weekEnd:"2012-12-13",
      templateCon:"ahhhahahahhah",
      timeList:[{time:"09:34:36"}],
    },

    ],
  },
  'GET /api/operation/feedBackList': {
    code: '0000',
    current: 1,
    data: [
      {
      id:"1",
      infoType:"1",
      userName:"啊哈哈哈",
      phone:'13467891234',
      weekStart:"2012-12-12",
      weekEnd:"2012-12-13",
      templateCon:"ahhhahahahhah",
      timeList:[{time:"09:34:36"},{time:"09:34:39"}],
    },
    {
      id:"2",
      infoType:"2",
      userName:"啊哈哈哈",
      phone:'13467891234',
      imgBanner:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1596014744057&di=def293d0e9bff792020a3a677917b6fa&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fforum%2Fw%3D580%2Fsign%3De67e5086054f78f0800b9afb49300a83%2F56b50df3d7ca7bcb17d509fdb8096b63f424a8f5.jpg',
      temName:"好极了",
      remark:"不错不错",
      weekStart:"2012-12-12",
      weekEnd:"2012-12-13",
      templateCon:"ahhhahahahhah",
      timeList:[{time:"09:34:36"}],
    },

    ],
    total: 123
  },
};