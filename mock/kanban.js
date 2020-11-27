function getChart(req, res, u, b) {

  	const { type='day', start='', end='' } = req.query;

  	let map = {
  		hour: 1,
  		day: 24,
  		month: 24*30
  	}

  	let space = 60*60*map[type]
  	let arr = [];
  	let current = start

  	while(Number(current)<Number(end)) {
  		arr.push(current)
  		current += space
  	}

  	let r = (max=1, min=0) => {
  		let temp = max-min
  		let times = map[type]
  		return Math.floor(Math.random()*temp + min)*times
  	}
  	let data = arr.map(()=>{
  		return {
  			vistor: r(20),
  			register: r(10),
  			merchant: r(50),
  			chain: r(10),
  			refund: r(5),
			service: r(100),
            oil: r(20),
            wash: r(15),
            improve: r(15),
            ornament: r(15),
            goods: r(20),
            keep: r(15),
            spray: r(17),
  		}
  	})
	const result = {
		"code": "0000",
		"data": data
	};
	res.json(result);
}

export default {
    'GET /api/kanban/platform': {
		"code": "0000",
		"data": {
			vistor: {
			    volume: 666,
	            register: 200
			},
			merchant: {
	            volume: 300,
	            chain: 30
	        },
			business: {
	            serviceNumber: 555,
	            refundNumber: 11,
	            oilNumber: 111,
	            washNumber: 122,
	            improveNumber: 133,
	            ornamentNumber: 144,
	            goodsNumber: 155,
	            keepNumber: 166,
	            sprayNumber: 177,
	            serviceAmount: 1555,
	            refundAmount: 111,
	            oilAmount: 1111,
	            washAmount: 1122,
	            improveAmount: 1133,
	            ornamentAmount: 1144,
	            goodsAmount: 1155,
	            keepAmount: 1166,
	            sprayAmount: 1177,
	        }
		},
	},
	'GET /api/kanban/platformChart': getChart
}