import { connect } from 'dva';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Statistic, Card, Row, Col, Form, Input, Button, Cascader, Empty, Tabs, Divider, Select, Radio, DatePicker } from 'antd';
import moment from 'moment';

import { Line } from '@ant-design/charts';

const { RangePicker } = DatePicker;
const { Option } = Select;
const options = {
    platform: [
        {
            label: '服务订单',
            // value: 'orderTotalSum',
            value: 'value',
        },
        {
            label: '加油订单',
            value: 'orderOilSum'
        },
        {
            label:'退款订单',
            value: 'orderRefundSum',
        },
        {
            label:'注册量',
            value: 'registNum',
        },
        {
            label:'访问量',
            value: 'memberLogSum',
        },
        {
            label:'店铺数',
            value: 'merchantSum',
        },
        {
            label:'连锁店铺数',
            value: 'merchantChainSum',
        },
    ],
    1: [
        {
            label: '加油订单',
            value: 'orderOilSum'
        }
    ],
    2: [
        {
            label: '服务总订单',
            // value: 'orderTotalSum',
            value: 'value',
        },
    ]
}

const serviceMap = {
    orderTotalSum: '总订单',
    orderWashSum: '洗车订单',
    orderBeautySum: '美容订单',
    orderRefitSum: '装饰改装订单',
    orderDepartmentSum: '精品百货订单',
    orderRepairSum: '保养订单',
    orderPaintingSum: '喷漆订单'
}

const typeMap = {
	'day': '1',
	'week': '4',
	'month': '4',
	'year': '3'
}

const timeOptions = [
    { label: '今日', value: 'day' },
    { label: '本周', value: 'week' },
    { label: '本月', value: 'month' },
    { label: '全年', value: 'year' },
];

const formatterMap = {
	'1': {
		formatter: (v)=>(moment(v).format('MM/DD HH时')),
		alias: '时间(小时)'
	},
	'3': {
        formatter: (v)=>(moment(v).format('YY/MM')),
        alias: '时间(月)'
    },
    '4': {
        formatter: (v)=>(moment(v).format('MM/DD')),
        alias: '时间(日)'
	}
}

const MyChart = ({ title, data, getData, merchantId, serviceType, isMerchant }) => {

	const [ show, setShow ] = useState('value')
	const [ type, setType ] = useState('4')
    const [ time, setTime ] = useState()

    useEffect(()=>{
        let end = moment().format('YYYY-MM-DD')
        let begin = moment().add(-30, 'days').format('YYYY-MM-DD')
        let init = {
            begin,
            end,
            type:'4'
        }
        if ( !isMerchant ) {
            getData(init)
        } else {
            if (merchantId&&serviceType){
                init.merchantId = merchantId
                init.merchantType = serviceType
                if ( serviceType === 1 ) {
                    setShow('orderOilSum')
                } else {
                    setShow('value')
                }
                getData(init)
            }
        }

    }, [merchantId, serviceType, isMerchant])

    const serviceData = useMemo(() => {
        let serviceLine = [];
        data.forEach((item)=>{
            let serviceArr = Object.keys(serviceMap);
            serviceArr.forEach((key)=>{
                serviceLine.push({
                    date: item.date,
                    type: serviceMap[key],
                    value: item[key]
                })
            })
        })
        return serviceLine;
    }, [data])

	const changeShow = (value) => {
		setShow(value)
	}

	const changeType = (e) => {
        let {value} = e.target
        setTime(value)

		let end = moment().format('YYYY-MM-DD')
		let begin = moment().startOf(value).format('YYYY-MM-DD')

		setType(typeMap[value]);
        let payload = {type: typeMap[value], begin, end}
        if ( isMerchant ) {
            payload.merchantId = merchantId
            payload.merchantType = serviceType
        }
		getData(payload)
	}

	const changeDate = (value) => {
        let begin = value[0].format('YYYY-MM-DD')
        let end = value[1].format('YYYY-MM-DD')

        setType('4');
        setTime('')
        let payload = {type: '4', begin, end}
        if ( isMerchant ) {
            payload.merchantId = merchantId
            payload.merchantType = serviceType
        }
        getData(payload)
	}

    const disabledDate = (current) => {
      // Can not select days before today and today
      return current > moment().endOf('start') || current < moment('2020-6-18');
    }
	const config = useMemo(
		()=>({
		title: {
			visible: true,
			text: title,
		},
        forceFit: window.innerWidth > 712,
        height: 500,
		data: show==='value'?serviceData:data,
		xField: 'date',
		yField: show,
		smooth: true, //曲线
        seriesField: show==='value'?'type':'',
        legend: {
            position: 'right-top'
        },
		meta: {
			date: formatterMap[type],
            registNum: {
                alias:'注册量',
            },
            memberLogSum: {
                alias:'访问量',
            },
            merchantSum: {
                alias:'店铺数',
            },
            merchantChainSum: {
                alias:'连锁店铺数',
            },
            orderTotalSum: {
                alias:'服务总订单'
            },
            orderRefundSum: {
                alias:'退款订单'
            },
            orderOilSum: {
                alias:'加油订单'
            },
            /*orderWashSum: {
                alias:'洗车订单'
            },
            orderBeautySum: {
                alias:'美容订单'
            },
            orderRefitSum: {
                alias:'装饰改装订单'
            },
            orderDepartmentSum: {
                alias:'精品百货订单'
            },
            orderRepairSum: {
                alias:'保养订单'
            },
            orderPaintingSum: {
                alias:'喷漆订单'
            }*/
		}

	}), [data, show, type])

	return (
		<React.Fragment>
            {
    			<Select
    				defaultValue="value"
    				style={{ width: 120 }}
    				onChange={changeShow}
    				value={show}
                    options={!isMerchant? options.platform : options[serviceType]}
                    disabled={isMerchant}
    			/>
            }
		    <div style={{float: 'right'}}>
    		    <Radio.Group
                    optionType='button'
                    buttonStyle='solid'
                    onChange={changeType}
                    options={timeOptions}
                    value={time}
    		    />
    		    <RangePicker
                    onChange={changeDate}
                    disabledDate={disabledDate}
                />
	    	</div>
			<Line {...config} />
		</React.Fragment>
	)
};

export default MyChart