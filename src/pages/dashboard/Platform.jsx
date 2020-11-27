import { connect } from 'dva';
import React, { useCallback, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Statistic, Card, Row, Col, Form, Input, Button, Cascader, Empty, Tabs, Divider } from 'antd';
import { Line } from '@ant-design/charts';
import MyChart from './MyChart'
import moment from 'moment';
import style from './Platform.less'


const { Fragment } = React

const orderMap = [
    {
        key: 'orderTotalSum',
        title:'服务总订单'
    },
    {
        key: 'orderRefundSum',
        title:'退款订单'
    },
    {
        key: 'orderOilSum',
        title:'加油订单'
    },
    {
        key: 'orderWashSum',
        title:'洗车订单'
    },
    {
        key: 'packSum',
        title:'套餐订单',
    },
    {
        key: 'orderBeautySum',
        title:'美容订单'
    },
    {
        key: 'orderRefitSum',
        title:'装饰改装订单'
    },
    {
        key: 'orderDepartmentSum',
        title:'精品百货订单'
    },
    {
        key: 'orderRepairSum',
        title:'保养订单'
    },
    {
        key: 'orderPaintingSum',
        title:'喷漆订单'
    }
]

const amountMap = [
    {
        key: 'orderAmountSum',
        title:'服务总金额'
    },
    {
        key: 'refundAmountSum',
        title:'退款金额'
    },
    {
        key: 'oilMoneySum',
        title:'加油金额'
    },
    {
        key: 'washMoneysum',
        title:'洗车金额'
    },
    {
        key: 'packMoneySum',
        title:'套餐交易额'
    },
    {
        key: 'beautyMoneySum',
        title:'美容金额'
    },
    {
        key: 'refitMoneySum',
        title:'装饰改装金额'
    },
    {
        key: 'departmentMoneySum',
        title:'精品百货金额'
    },
    {
        key: 'repairMoneySum',
        title:'保养金额'
    },
    {
        key: 'paintingMoneySum',
        title:'喷漆金额'
    }
]

const tabList = [
    {
        key: 'total',
        tab: '总',
    },
    {
        key: 'on',
        tab: '上',
    },
    {
        key: 'off',
        tab: '下',
    },
];

const Dashhoard = props => {
    const {
        getPlatformData,
        getPlatformChart,
        data,
        chart
    } = props;

    const [ key, setKey ] = useState('total')

    useEffect(() => {
        // let end = moment().format('YYYY-MM-DD HH:mm:ss')
        // let begin = moment().add(-30, 'days').format('YYYY-MM-DD HH:mm:ss')
        // let init = {
        //     begin,
        //     end,
        //     type:'4'
        // }
        getPlatformData();
        // getPlatformChart(init);
    }, []);

    const [form] = Form.useForm();

    const valueList = {
        total: {
            stores: data.storesOfflineSum+data.storesOlineSum || '',
            chain: data.chainOfflineSum+data.chainOlineSum || ''
        },
        on: {
            stores: data.storesOlineSum,
            chain: data.chainOlineSum
        },
        off: {
            stores: data.storesOfflineSum,
            chain: data.chainOfflineSum
        },
    }

    return (
        <Fragment>
            <Row>
                <Card title="访问数据" style={{width: '14%'}}>
                    <Row>
                        <Statistic title="访问量" value={data.memberLogSum} suffix="人" />
                    </Row>
                    <Row>
                        <Statistic title="注册量" value={data.registNum} suffix="人" />
                    </Row>
                </Card>
                <Card
                    style={{width: '16%'}}
                    title="店铺数"
                    tabList={tabList}
                    activeTabKey={key}
                    onTabChange={key => {setKey(key)}}
                >
                    <Row>
                        <Statistic title="加盟店铺" value={valueList[key].stores} suffix="家" />
                    </Row>
                    <Row>
                        <Statistic title="连锁店铺" value={valueList[key].chain} suffix="家" />
                    </Row>
                </Card>
                <Card title="业务数据" style={{width: '70%',overflow: 'scroll'}} className={style.card_con}>
                    <div style={{height:"260px"}}>
                        <div style={{minWidth:1500}}>
                            <Row justify={'space-around'} style={{ minWidth:1500,padding:"10px"}}>
                                {
                                    orderMap.map((item)=>{
                                        let { title, key } = item
                                        return (
                                            <Col
                                                flex={'10%'}
                                                key={key}
                                            >
                                                <Statistic
                                                    title={title}
                                                    value={data[key]} 
                                                    suffix="单" />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                            <Row justify={'space-around'} style={{padding:"10px",}}>
                                {
                                    amountMap.map((item)=>{
                                        let { title, key } = item
                                        return (
                                            <Col
                                                flex={'10%'}
                                                key={key}
                                            >
                                                <Statistic
                                                    title={title}
                                                    value={data[key]}
                                                    precision={2}
                                                    suffix="元" />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                            <Row justify={'space-around'} style={{padding:"10px",}}>
								<Col flex={'10%'}>
									<Statistic title="分销券数" value={ data.distCouponNum || 0 } precision={2} suffix="" />
								</Col>
								<Col  flex={'10%'}>
									<Statistic title="订单完成数（分销）" value={ data.finishOrderNum || 0 } precision={2} suffix="元" />
								</Col>
								<Col  flex={'10%'}>
									<Statistic title="待支付订单数(分销)" value={ data.unpaidOrderNum || 0 } precision={2} suffix="元" />
								</Col>
								<Col  flex={'10%'}>
									<Statistic title="分销订单总金额" value={data.distOrderAllMoney || 0 } precision={2} suffix="元" />
								</Col>
								<Col  flex={'10%'}>
									<Statistic title="分佣总金额" value={ data.distComm || 0 } precision={2} suffix="元" />
								</Col>
								<Col  flex={'10%'}>
									<Statistic title="团长数量" value={ data.leaderNum || 0 } precision={2} suffix="" />
								</Col>
								<Col  flex={'10%'}>
									<Statistic title="团员数量" value={ data.memberNum || 0 } precision={2} suffix="" />
								</Col>
                                <Col  flex={'10%'}></Col>
                                <Col  flex={'10%'}> </Col>
                                <Col  flex={'10%'}> </Col>
						   </Row>
                        </div>
                    </div>
                </Card>
            </Row>
            <Divider />
            <MyChart
                data={chart}
                getData={getPlatformChart}
                title={'平台数据'}
                isMerchant={false}
            />
            
        </Fragment>
    );
};

export default connect(
    ({ dashboard, global }) => ({
        data: dashboard.platformData,
        chart: dashboard.platformChart,
    }),
    dispatch => ({
        async getPlatformData(payload) {
            return dispatch({
                type: 'dashboard/getPlatformData',
                payload,
            });
        },
        async getPlatformChart(payload){
            return dispatch({
                type: 'dashboard/getPlatformChart',
                payload,
            });
        }
    }),
)(Dashhoard);
