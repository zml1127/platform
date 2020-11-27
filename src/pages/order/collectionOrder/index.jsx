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
import { Link } from 'umi';
import { PlusOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
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
				title: '订单编号',
				dataIndex: 'orderNum',
			},
			{
				title: '订单生成时间',
				dataIndex: 'createTime',
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
			},
			{
				title: '订单支付时间',
				dataIndex: 'payTime',
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
				renderText: _ => _ || '--',
			},
			{
				title: '来源',
				dataIndex: 'orderStatus',
				filters: false,
				valueEnum: sourceMap,
			},
			{
				title: '商户名称',
				dataIndex: 'merchantName',
				hideInSearch: true
			},
			{
				title: '区域',
				dataIndex: 'area',
				ellipsis: true,
				renderFormItem: (_item, { value, onChange }) => (
					<Cascader
						options={cityList}
						showSearch
						allowClear
						style={{ width: '100%' }}
						fieldNames={{ label: 'name', value: 'id', children:'children'}} // 定义label/value/children对应字段
						value={value} // 指定选中项目
						onChange={onChange}
					/>
				),
			},
			{
				title: '券头图',
				dataIndex: 'serviceName',
				hideInSearch: true
			},
			{
				title: '券名称',
				dataIndex: 'originalAmount',
				hideInSearch: true,
			},
			{
				title: '原价（元）',
				dataIndex: 'payAmount',
				hideInSearch: true,
			},
			{
				title: '优惠价（元）',
				dataIndex: 'payAmount',
				hideInSearch: true,
			},
			{
				title: '总分佣',
				dataIndex: 'merchantName',
				hideInTable: true
			},
			{
				title: '平均分佣',
				dataIndex: 'name',
				hideInSearch: true
			},
			{
				title: '团长分佣',
				dataIndex: 'merchantChainName',
				hideInSearch: true
			},
			{
				title: '团长昵称',
				dataIndex: 'nick',
			},
			{
				title: '团长手机号',
				dataIndex: 'merchantChainName',
			},
			{
				title: '团员分佣',
				dataIndex: 'fen',
				hideInSearch: true
			},
			{
				title: '支付状态',
				dataIndex: 'status',
				hideInSearch: true,
			},
			{
				title: '支付方式',
				dataIndex: 'pay',
				hideInSearch: true,
			},
			{
				title: '付款人姓名',
				dataIndex: 'createTime',
				hideInSearch: true
			},
			{
				title: '付款人手机号',
				dataIndex: 'createTime',
				hideInSearch: true,
			},
			{
				title: '是否添加核销码',
				dataIndex: 'isAddCheckQrcode',
				renderFormItem: (_item, { value, onChange }) => {
					return (
						<Select defaultValue="" onChange={onChange}>
							<Select.Option value="">全部</Select.Option>
							<Select.Option value={1}>是</Select.Option>
							<Select.Option value={0}>否</Select.Option>
						</Select>
					);
				}
			},
			{
				title: '操作',
				key: 'option',
				valueType: 'option',
				fixed:"right",
				render: (_,row) => [
					[2,3].includes(row.orderStatus) ?
						<a key="delete" onClick={() => {
							Modal.confirm({
								title: '提示',
								icon: <ExclamationCircleOutlined />,
								content: `确定要退款吗`,
								okText: '确认',
								cancelText: '取消',
								onOk:()=>{
									getExtendcouponorderRefund({orderId:row.id}).then(res=>{
										if(res.code == "0000"){
											actionRef.current.reload()
										}
									})
								} 
							});
						}}>
							<Text type="danger">退款</Text>
						</a>:null,
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
