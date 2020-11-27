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
	Statistic,
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
	'3': '已完成',
	'7': '待核保',
	'-1': '已取消',
	'-2': '信息尚未填写完成'
};


const WashOrder = memo(props => {
	const {
		list,
		getList,
		cityList,
	} = props;


	const columns = useMemo(
		() => [
			{
				title: '订单编号',
				dataIndex: 'orderNum',
			},
			{
				title: '订单生成时间',
				dataIndex: 'createTime',
				// hideInTable: true,
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
			},
			{
				title: '订单支付时间',
				dataIndex: 'payTime',
				// hideInTable: true,
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
				renderText: _ => _ || '--',
			},
			{
				title: '所属渠道',
				dataIndex: 'channelName',
				hideInSearch: true
			},
			{
				title: '手机号',
				dataIndex: 'phone',
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
				title: '车牌号',
				dataIndex: 'licenseNo',
				hideInSearch: true
			},
			{
				title: '车主',
				dataIndex: 'ownerName',
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
				title: '保险公司',
				dataIndex: 'icName',
				hideInSearch: true
			},
			{
				title: '购买险别',
				dataIndex: 'risksList',
				hideInSearch: true
			},
			{
				title: '总订单金额(元)',
				dataIndex: 'payAmount',
				hideInSearch: true
			},
			{
				title: '交强+车船金额(元)',
				dataIndex: 'tax',
				hideInSearch: true
			},
			{
				title: '交强险积分（比例）',
				dataIndex: 'forceRate',
				hideInSearch: true
			},
			{
				title: '商业险金额',
				dataIndex: 'bizTotal',
				hideInSearch: true
			},
			{
				title: '商业险金额积分（比例）',
				dataIndex: 'bizRate',
				hideInSearch: true
			},
			{
				title: '商业险投保单号',
				dataIndex: 'bizProp',
				hideInSearch: true
			},
			{
				title: '交强险投保单号',
				dataIndex: 'forceProp',
				hideInSearch: true
			},
			{
				title: '订单状态',
				dataIndex: 'orderStatus',
				hideInSearch: true,
				valueEnum: statusMap,
			},
			{
				title: '交强险保单号',
				dataIndex: 'forcePolicy',
				hideInSearch: true
			},
			{
				title: '商业险保单号',
				dataIndex: 'bizPolicy',
				hideInSearch: true
			},

		],
		[cityList],
	);
	return (
		<OrderTemplate
			getOrderList={getList}
			position={cityList}
			orderList={list}
			columns={columns}
		/>
	)
})

export default connect(
	({ global, order }) => ({
		cityList: global.cityList, // 省市区数据
		list: order.insure,
	}),
	dispatch => ({
		async getList(payload) {
			return dispatch({
				type: 'order/getInsureList',
				payload,
			});
		},
	}),
)(WashOrder);
