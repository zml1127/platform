import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Input,
	message,
	Switch,
	Cascader,
	DatePicker,
	Tooltip,
	Select,
	Typography, //复制、编辑、标题文本
	Popconfirm,
	Statistic,
	Modal, // 弹框
	Form,
	Row,Menu,Dropdown,
	Col,Breadcrumb,
} from 'antd';
import React, { useRef, useCallback, useMemo, memo, useState, useEffect, } from 'react';
import { connect } from 'dva';
import ProTable from '@ant-design/pro-table';

const GasModal = memo(props => {
	const { row, gasModalVisible, setGasModalVisible, getHistoryList, } = props
	const [historyList, setHistoryList] = useState([])
	const refuelNum = localStorage.getItem('refuelNum') //油品号
	const oilId = localStorage.getItem('oilId') //油品号ID

	
	const columns = useMemo(()=>[
		{
			title: '修改时间',
			dataIndex: 'updateTime',
			hideInSearch: true,
			width: 160,
			ellipsis: true, // 是否自动缩略
		},
		{
			title: '官方指导价',
			dataIndex: 'guidePrice',
			hideInSearch: true,
			width: 80,
			ellipsis: true, // 是否自动缩略
		},
		{
			title: '站内价格',
			dataIndex: 'price',
			hideInSearch: true,
			width: 80,
			ellipsis: true, // 是否自动缩略
		},
		{
			title: '定额优惠',
			dataIndex: 'discountFixed',
			hideInSearch: true,
			width: 80,
			ellipsis: true, // 是否自动缩略
			render: (_, row)=>{
				return row.discountFixed ? row.discountFixed : '--'
			}
		},
		{
			title: '优惠折扣',
			dataIndex: 'discountPercent',
			hideInSearch: true,
			width: 90,
			ellipsis: true, // 是否自动缩略
			render: (value, row) => {
				return (row.discountPercent&&row.discountPercent!==100) ? row.discountPercent+'折' : '--'
			},
		},
		{
			title: '优惠价格',
			dataIndex: 'privilegePrice',
			hideInSearch: true,
			width: 80,
			ellipsis: true, // 是否自动缩略
			render: (_, row)=>{
				return row.privilegePrice ? row.privilegePrice : '--'
			}
		},
		{
			title: '首页位置',
			dataIndex: 'sort',
			hideInSearch: true,
			width: 60,
			ellipsis: true, // 是否自动缩略
		},
		{
			title: '操作角色',
			dataIndex: 'updaterType',
			hideInSearch: true,
			width: 60,
			ellipsis: true, // 是否自动缩略
			render: (value, row) => {
				return row.updaterType ? row.updaterType : ''
			},
		},
	],[ ])

	// console.log('弹框里的row==', row)

    return (
		<Modal 
			width={800}
			destroyOnClose={true}
			title={`${refuelNum}  ${row.merchantName} `}
			visible={gasModalVisible}
			onCancel={()=>{ setGasModalVisible(false) }}
			footer={false}
		>
          <ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				// actionRef={actionRef}
				columns={columns}
				search={false}
				rowKey="id"
				key="id"
				request={ params=>{ return getHistoryList({ ...params, ...{ oilId: oilId, merchantId: row.merchantId } }) } }
				options={{ fullScreen: false, reload: false, density: false, setting: false }}
				pagination={{
					showSizeChanger: true,
					pageSize: 10
				}}
			/>
      </Modal>
    );
});


export default connect(
	({ gasService, global, }) => ({
		
	}),
	dispatch => ({
		async getHistoryList(payload) {
			return dispatch({
				type: 'gasService/getHistoryList',
				payload
			});
		},
	}),
)(GasModal);
