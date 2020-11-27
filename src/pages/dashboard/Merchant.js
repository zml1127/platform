import { connect } from 'dva';
import React, { useCallback, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Statistic, Card, Row, Col, Form, Input, Button, Cascader, Empty, Tabs, Divider } from 'antd';
import { Line } from '@ant-design/charts';
import MyChart from './MyChart'

const { Fragment } = React
const { Item } = Form

const washOrderMap = [
    {
        key: 'orderTotalSum',
        title:'服务总订单'
    },
    {
        key: 'orderRefundSum',
        title:'退款订单'
    },
    {
        key: 'orderWashSum',
        title:'洗车订单'
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

const washAmountMap = [
    {
        key: 'orderAmountSum',
        title:'服务总金额'
    },
    {
        key: 'refundAmountSum',
        title:'退款金额'
    },
    {
        key: 'washMoneysum',
        title:'洗车金额'
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

const oilOrderMap = [
    {
        key: 'orderRefundSum',
        title:'退款订单'
    },
    {
        key: 'orderOilSum',
        title:'加油订单'
    },
]

const oilAmountMap = [
    {
        key: 'refundAmountSum',
        title:'退款金额'
    },
    {
        key: 'oilMoneySum',
        title:'加油金额'
    },
]

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const Dashhoard = props => {
    const {
    	getMerchantData,
    	getMerchantChart,
    	data,
    	chart,
    	cityList
	 } = props;

    useEffect(() => {
        getMerchantData();
        // getMerchantChart();
    }, []);

    const [form] = Form.useForm();

    const onFinish = values => {
		const { address, merchantName } = values;
		if (address && address.length>1) {
			values.provinceId = address[0];
			values.cityId = address[1];
			values.districtId = address[2];	
		} 
		delete values.address;
		getMerchantData(values)
	}

	const washCard = () => {
		return (
		    <Card title="业务数据" style={{width: '70%'}}>
            	<div style={{overflow: 'scroll'}}>
                	<div style={{minWidth:1200}}>
	                    <Row justify={'space-around'}>
	                        {
	                            washOrderMap.map((item)=>{
	                                let { title, key } = item
	                                return (
	                                    <Col
	                                        flex={'11%'}
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
	                    <Row justify={'space-around'}>
	                        {
	                            washAmountMap.map((item)=>{
	                                let { title, key } = item
	                                return (
	                                    <Col flex={'11%'}>
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
                    </div>
                </div>
            </Card>
		)
	}

	const oilCard = () => {
		return (
		    <Card title="业务数据">
            	<div style={{overflow: 'scroll'}}>
                	<div style={{minWidth: 300}}>
	                    <Row justify={'space-around'}>
	                        {
	                            oilOrderMap.map((item)=>{
	                                let { title, key } = item
	                                return (
	                                    <Col key={key} span={12}>
	                                        <Statistic
	                                            title={title}
	                                            value={data[key]} 
	                                            suffix="单" />
	                                    </Col>
	                                )
	                            })
	                        }
	                    </Row>
	                    <Row justify={'space-around'}>
	                        {
	                            oilAmountMap.map((item)=>{
	                                let { title, key } = item
	                                return (
	                                    <Col key={key} span={12}>
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
                    </div>
                </div>
            </Card>
		)
	}

    return (
        <Fragment>
            <Row>
            	<Card style={{width: '30%'}}>
		            <Form
				      	{...layout}
				      	onFinish={onFinish}
				    >
				      	<Item
					        label="店铺名称"
					        name="merchantName"
					        rules={[
					          	{
						            required: true,
						            message: '请输入店铺名称',
					          	},
					        ]}
				      	>
				        <Input allowClear/>
				      	</Item>
				      	<Item
				      		label="区域"
				      		name="address"
				      		rules={[
					          	{
						            required: true,
						            message: '请输入店铺地址',
					          	},
					        ]}
						>
							<Cascader
								options={cityList}
								showSearch
								allowClear
								fieldNames={{ label: 'name', value: 'id', children:'children'}} // 定义label/value/children对应字段
							/>
						</Item>
				      <Item {...tailLayout}>
			        	<Button type="primary" htmlType="submit">
			          		查询
			        	</Button>
				      </Item>
				    </Form>
			    </Card>
			    {
			    	data.serviceId === 2 && washCard()
                }
                {
			    	data.serviceId === 1 && oilCard()
                }
            </Row>
            <Divider />
            {
            	data.serviceId &&
	            <MyChart
	                data={chart}
	                getData={getMerchantChart}
	                merchantId={data.merchantId}
	                serviceType={data.serviceId}
	                title={data.merchantName}
	                isMerchant={true}
	            />
            }
            
        </Fragment>
    );
};

export default connect(
    ({ dashboard, global }) => ({
        data: dashboard.merchantData,
        chart: dashboard.merchantChart,
        cityList: global.cityList,
    }),
    dispatch => ({
        async getMerchantData(payload) {
            return dispatch({
                type: 'dashboard/getMerchantData',
                payload,
            });
        },
        async getMerchantChart(payload){
            return dispatch({
                type: 'dashboard/getMerchantChart',
                payload,
            });
        }
    }),
)(Dashhoard);
