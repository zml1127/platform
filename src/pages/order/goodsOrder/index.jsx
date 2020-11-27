import { connect } from 'dva';

import React, { useRef, useCallback, useMemo, memo, useState } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Button,
	Input,
	message,
	Switch,
	Cascader,
	DatePicker,
	Tooltip,
	Select,
	Typography,
	Popconfirm,
	Row,
} from 'antd';
import { Link } from 'umi';
import { useEffectOnce, useMountedState, useToggle } from 'react-use';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import OrderTemplate from '../component/template';


const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const Order = memo(props => {
	const {
		list,
		getList,
		cityList,
		orderList,
	} = props;


	const columns = useMemo(
		() => [
			{
				title: '订单编号',
				dataIndex: 'orderNum',
			},
			{
				title: '会员手机号',
				dataIndex: 'phone',
			},
			{
				title: '订单状态',
				dataIndex: 'status',
				filters: false,
				valueEnum: {
					'0': '未兑换',
					'1': '已兑换'
				},
				hideInSearch: true
			},
			{
				title: '商户名称',
				dataIndex: 'merchantName',
				hideInTable: true
			},
			{
				title: '商户名称',
				dataIndex: 'name',
				hideInSearch: true
			},
			{
				title: '商户类型',
				dataIndex: 'merchantTypeId',
				valueEnum: {
					'1': '加油',
					'2': '洗美'
				},
				hideInTable: true
			},
			{
				title: '商户类型',
				dataIndex: 'merchantType',
				hideInSearch: true
			},
			{
				title: '商户区域',
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
				title: '归属连锁商户',
				dataIndex: 'merchantChainName',
				hideInSearch: true,
			},
			{
				title: '兑换商品',
				dataIndex: 'goodsName',
				hideInSearch: true,
			},
			{
				title: '商品数量',
				dataIndex: 'goodsNum',
				hideInSearch: true,
			},
			{
				title: '名称',
				dataIndex: ' couponName',
				hideInSearch: true,
			},
			{
				title: '使用门槛',
				dataIndex: 'couponUsedDescribe',
				hideInSearch: true,
			},
			{
				title: '订单生成时间',
				dataIndex: 'createTime',
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
			},
			{
				title: '订单核销时间',
				dataIndex: 'writeoffTime',
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
				renderText: _ => _ || '--',
			},
		],
		[cityList],
	);
	return (
		<OrderTemplate
			getOrderList={getList}
			cityList={cityList}
			orderList={list}
			columns={columns}
		/>
	)
})

export default connect(
	({ global, order }) => ({
		cityList: global.cityList, // 省市区数据
		list: order.goods,
	}),
	dispatch => ({
		async getList(payload) {
			return dispatch({
				type: 'order/getGoodsList',
				payload,
			});
		},
	}),
)(Order);
