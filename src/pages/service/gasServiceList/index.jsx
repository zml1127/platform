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
	Row, Menu, Dropdown,
	Col, Breadcrumb,
} from 'antd';
import React, { useRef, useCallback, useMemo, memo, useState, useEffect, } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'dva';
import styled from "styled-components";
import GasModal from '../components/gasModal/index'


const gasService = memo(props => {
	const { location, getCityList, cityList, getMerchantOilPage, } = props
	// console.log('props.location=', location.query)
	const [gasModalVisible, setGasModalVisible] = useState(false)
	const [currentRow, setCurrentRow] = useState({})
	const refuelNum = localStorage.getItem('refuelNum') //油品号
	const oilId = localStorage.getItem('oilId') //油品号ID

	useEffect(() => {
		getCityList()
	}, [])

	const beforeSearchSubmit = ({ merchantName = '', area = [] }) => { //搜索参数处理
		const params = {};
		if (merchantName) {
			params.merchantName = merchantName.replace(/\s/g, ""); // 去掉空格
		}
		if (area.length !== 0) {
			params.provinceId = area[0]
			params.cityId = area[1] ? area[1] : null
			params.districtId = area[2] ? area[2] : null
		}
		// console.log('搜索参数params==', params)
		return params;
	};

	const showHistoryModal = useCallback(row => {
		setCurrentRow(row)
		setGasModalVisible(true)
	}, [])

	const columns = useMemo(() => [
		{
			title: '店铺名称',
			dataIndex: 'merchantName',
			// hideInSearch: true,
			width: 220,
			ellipsis: true, // 是否自动缩略
			renderFormItem: (_item, { value, onChange }) => (
				<Input allowClear placeholder="请输入" onChange={onChange} />
			),
			render: (value, row) => {
				return <a onClick={() => {
					props.history.push(`/merchantManage/merchant/details?id=${row.merchantId}`)
				}}>{row.merchantName ? row.merchantName : '--'}</a>
			}
		},
		{
			title: '店铺所在区域',
			dataIndex: 'area',
			// hideInSearch: true,
			width: 200,
			ellipsis: true, // 是否自动缩略
			renderFormItem: (_item, { value, onChange }) => (
				<Cascader
					options={cityList}
					fieldNames={{ label: 'name', value: 'id', children: 'children' }}
					showSearch
					value={value} // 指定选中项目
					allowClear
					onChange={onChange}
					style={{ width: '200px' }}
				/>
			),
		},
		{
			title: '官方指导价',
			dataIndex: 'guidePrice',
			hideInSearch: true,
			width: 100,
			ellipsis: true, // 是否自动缩略
			render: (_, row) => {
				return row.guidePrice ? row.guidePrice+'元' : '--'
			}
		},
		{
			title: '站内价格',
			dataIndex: 'price',
			hideInSearch: true,
			width: 100,
			ellipsis: true, // 是否自动缩略
			render: (_, row) => {
				return row.price ? row.price+'元' : '--'
			}
		},
		{
			title: '定额优惠',
			dataIndex: 'discountFixed',
			hideInSearch: true,
			width: 100,
			ellipsis: true, // 是否自动缩略
			render: (_, row) => {
				return row.discountFixed ? row.discountFixed+'元' : '--'
			}
		},
		{
			title: '优惠折扣',
			dataIndex: 'discountPercent',
			hideInSearch: true,
			width: 100,
			ellipsis: true, // 是否自动缩略
			render: (value, row) => (row.discountPercent && row.discountPercent !== 100) ? row.discountPercent/10 + '折' : '--',
		},
		{
			title: '优惠价格',
			dataIndex: 'privilegePrice',
			hideInSearch: true,
			width: 100,
			ellipsis: true, // 是否自动缩略
			render: (_, row) => {
				return row.privilegePrice ? row.privilegePrice+'元' : '--'
			}
		},
		{
			title: '首页位置',
			dataIndex: 'sort',
			hideInSearch: true,
			width: 80,
			ellipsis: true, // 是否自动缩略
		},
		{
			title: '状态',
			dataIndex: 'status',
			hideInSearch: true,
			width: 80,
			ellipsis: true, // 是否自动缩略
			render: (value, row) => row.status == 1 ? '上架' : '下架',
		},
		{
			title: '修改时间',
			dataIndex: 'updateTime',
			hideInSearch: true,
			width: 160,
			ellipsis: true, // 是否自动缩略
		},
		{
			title: '操作',
			hideInSearch: true,
			width: 160,
			ellipsis: true, // 是否自动缩略
			fixed: 'right',
			render: (value, row) => {
				return <div>
					<a style={{ paddingRight: '6px' }} onClick={() => {
						localStorage.setItem('gasServiceMerchantId', row.merchantId)
						props.history.push(`/service/gasService/gasServiceList/gasSort?merchantName=${row.merchantName}`)
					}}>排序</a>
					<a style={{ paddingRight: '6px' }} onClick={() => { showHistoryModal(row) }}>历史</a>
					<a onClick={() => {
						// console.log('row啊啊啊', row)
						props.history.push(`/service/gasService/gasServiceList/gasEdit?id=${row.id}&merchantName=${row.merchantName}&merchantId=${row.merchantId}`)
					}}>编辑</a>
				</div>
			},
		},
	], [cityList,])


	return (
		<BOLD content={refuelNum}>
			<ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				// actionRef={actionRef}
				columns={columns}
				request={params => getMerchantOilPage({ ...params, ...{ oilId: oilId } })}
				beforeSearchSubmit={searchProps => beforeSearchSubmit(searchProps)}
				rowKey="id"
				key="id"
				options={{ fullScreen: false, reload: true, density: true, setting: true }}
				pagination={{
					showSizeChanger: true,
				}}
				// search={false}
				search={{
					collapsed: false,
					optionRender: ({ searchText, resetText }, { form }) => (
						<>
							<Button
								type="primary"
								htmlType="submit"
								onClick={() => {
									form.submit();
								}}
							>
								{searchText}
							</Button>{' '}
							<Button
								onClick={() => {
									form.resetFields();
									form.submit();
								}}
							>
								{resetText}
							</Button>{''}
						</>
					)
				}}
			/>
			<GasModal
				gasModalVisible={gasModalVisible}
				setGasModalVisible={setGasModalVisible}
				row={currentRow}
			/>
		</BOLD>
	);
});

const BOLD = styled(PageHeaderWrapper)`
	.ant-pro-page-container-content {
		font-size:20px;
		font-weight: bold;
	}
`


export default connect(
	({ gasService, global, }) => ({
		cityList: global.cityList, //省市区列表

	}),
	dispatch => ({
		async getCityList(payload) {
			return dispatch({
				type: 'global/getCityList',
				payload,
			});
		},
		// 获取店铺油品服务列表
		async getMerchantOilPage(payload) {
			return dispatch({
				type: 'gasService/getMerchantOilPage',
				payload,
			});
		},
	}),
)(gasService);
