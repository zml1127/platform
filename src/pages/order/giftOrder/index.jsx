import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useState,useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Input,
	message,
	Cascader,
	DatePicker,
	Select,
	Typography,
	Modal,
	Upload,
	Form
} from 'antd';

import moment from 'moment';
import OrderTemplate from '../component/template';
const { Item, useForm } = Form;

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const sourceMap = {
	'0': '全部',
	'1': '联联',
	'2': '平台',
	'3': '侠侣',
	'4': '商品券',
};

const Order = memo(props => {
	const {
		getList,
		cityList,
		list,
		serviceList,
		getExtendcouponorderRefund,
	} = props;
	const [form] = useForm();
	const { submit } = form;
	const { setFieldsValue } = form;
	
	const serviceMap = useMemo(()=>{
		let map = {};
		serviceList.forEach((item)=>{
			let { id, name } = item
			map[id] = name
		})
		return map
	}, [serviceList])
	useEffect(()=>{
	
	},[])
	const columns = useMemo(
		() => [
			{
				title: '会员手机号',
				dataIndex: 'orderNum',
			},
			{
				title: '礼包名称',
				dataIndex: 'name',
			},
			{
				title: '礼包内容',
				dataIndex: 'payTime',
				hideInSearch:true,
			},
			{
				title: '原价',
				dataIndex: 'orderStatus',
				filters: false,
				hideInSearch: true
			},
			{
				title: '优惠价',
				dataIndex: 'merchantName',
				hideInSearch: true
			},
			{
				title: '购买时间',
				dataIndex: 'buyTime',
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
			},
			{
				title: '状态',
				dataIndex: 'payAmount',
				hideInSearch: true,
			},
			{
				title: '操作',
				key: 'option',
				valueType: 'option',
				fixed:"right",
				render: (_,row) => [
					
					<a key="see" onClick={() => {
						props.history.push({
							pathname: '/order/giftOrder/detail',
							query: {
								id:row.id,
							},
						})
					}}>查看</a>,
			   ]
			}
		],
		[cityList],
	);
	return (
		<div>
			<OrderTemplate
				getOrderList={getList}
				cityList={cityList}
				orderList={list}
				columns={columns}
			/>
		</div>
		
	)
})

export default connect(
	({ global, order }) => ({
		cityList: global.cityList, // 省市区数据
		list: order.service,
		serviceList: order.serviceList,
	}),
	dispatch => ({
		async getList(payload) {
			return dispatch({
				type: 'order/getServiceList',
				payload,
			});
		},
		async getExtendcouponorderRefund (payload) {
			return dispatch({
				type: 'around/getExtendcouponorderRefund',
				payload,
			});
		},
		async getExtendcouponorderAddCheckCode (payload,id) {
			return dispatch({
				type: 'around/getExtendcouponorderAddCheckCode',
				payload:{
					...payload,
					extendCouponId:id
				},
			});
		}
	}),
)(Order);
