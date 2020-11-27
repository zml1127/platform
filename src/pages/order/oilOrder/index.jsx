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
	Popover,
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
const statusMap = {
	'0': '全部',
	'1': '待支付',
	'2': '待核销',
	'3': '已完成',
	'4': '拼团中',
	'5': '退款中',
	'6': '退款完成',
	'-1': '已取消'
};

const Order = memo(props => {
	const {
		getList,
		cityList,
		list,
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
				dataIndex: 'orderStatus',
				filters: false,
				valueEnum: statusMap,
			},
			{
				title: '油品号',
				dataIndex: 'oilNum',
				hideInSearch: true
			},
			{
				title: '油枪号',
				dataIndex: 'gunNo',
				hideInSearch: true
			},
			{
				title: '应付（元）',
				dataIndex: 'originalAmount',
				hideInSearch: true,
			},
			{
				title: '优惠（元）',
				dataIndex: 'totalDiscountAmount',
				hideInSearch: true,
				render: (_, row) => {
					let content = null
					content = (
						<div>
							{
								row.couponName && [
								    <p>优惠劵类型：{row.couponType}</p>,
								    <p>优惠劵名称：{row.couponName}</p>,
								    <p>优惠劵内容：{row.couponText}</p>,
								]
							}
							{
								row.shopInnerAmount > 0 &&
							    <p>店内优惠：{row.shopInnerAmount}</p>
							}
						</div>
					)
					if ( row.totalDiscountAmount && ( row.couponName || row.shopInnerAmount ) ) {
						return(
							<Popover placement="top" content={content}>
						        <span>{row.totalDiscountAmount}</span>
					      	</Popover>
						)
					} else {
						return row.totalDiscountAmount || '-'
					}
				}
			},
			{
				title: '实付（元）',
				dataIndex: 'payAmount',
				hideInSearch: true,
			},
			{
				title: '渠道',
				dataIndex: 'gatheringChannel',
				hideInSearch: true,
				valueEnum:{
					0: '-',
					1: '微信支付',
					2: '随行付'
				}
			},
			{
				title: '服务费(元)',
				dataIndex: 'profitPay',
				hideInSearch: true,
			},
			{
				title: '支付手续费利润(元)',
				dataIndex: 'profitService',
				hideInSearch: true,
			},
			{
				title: '平台利润(元)',
				dataIndex: 'platformPay',
				hideInSearch: true,
				renderText: (value, row) => {
					let platformPay = row.profitPay + row.profitService
					return platformPay || '-'
				}
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
				title: '商户名称',
				dataIndex: 'merchantName',
				hideInTable: true,
			},
			{
				title: '商户名称',
				dataIndex: 'name',
				hideInSearch: true
			},
			{
				title: '归属连锁商户',
				dataIndex: 'merchantChainName',
				hideInSearch: true
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
		list: order.oil,
	}),
	dispatch => ({
		async getList(payload) {
			return dispatch({
				type: 'order/getOilList',
				payload,
			});
		},
	}),
)(Order);
