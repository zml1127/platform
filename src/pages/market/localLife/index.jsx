import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState,} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Cascader,
	Switch,
	Select,
	Popconfirm,
	Typography,
	message,
	Input,
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
const { Text } = Typography;
const UserInfo = memo(props => {
	const {
		getLocalLifePageListForShow,
		delLocalLife,
		updateLocalLifeStatus,
		getExtendcouponTypeList,
		getCityList,
		cityList,
		couponTypeList,
		switchLoading
	} = props;
	const [selectedRowKeys,setSelectedRowKeys] = useState([])
	const actionRef = useRef();
	const sourceMap = {1:"联联周边游",2:"平台",3:"侠侣亲子游",4:'商品券'}

    useEffect(()=>{
		getCityList()
		getExtendcouponTypeList()
	},[])

	const onSelectChange = selectedRowKeys=>{
		setSelectedRowKeys(selectedRowKeys)
		console.log(selectedRowKeys)
	}

	const rowSelection = {
		selectedRowKeys,
		onChange:onSelectChange,
	}
	
	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { showAddress } = search;
		let provinceId = showAddress&&showAddress[0]?showAddress[0]:null
		let cityId = showAddress&&showAddress[1]?showAddress[1]:null
		let districtId =showAddress&&showAddress[2]?showAddress[2]:null
		let params = {
			...search,
			provinceId,
			cityId,
			districtId,
		}
		delete params.showAddress
		return params;

	};

	const changeSwitch=(row)=>{
		updateLocalLifeStatus({id:row.id}).then(res=>{
			actionRef.current.reload()
		})
	}

	const columns = useMemo(
		() => [
				{
					title: '三方名称',
					dataIndex: 'source',
					renderText:(_, row) => row.source ? sourceMap[row.source]:"",
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue={0} onChange={onChange}>
								<Select.Option value={0} key={0}>全部</Select.Option>
								<Select.Option value={1} value={1}>联联周边游</Select.Option>
								<Select.Option value={2} value={2}>平台</Select.Option>
								<Select.Option value={3} value={3}>侠侣</Select.Option>
								<Select.Option value={3} value={4}>商品券</Select.Option>
							</Select>
						);
					}
				},
				{
					title: '券名称',
					dataIndex: 'name',
					key:"name",
					width:300,
					renderFormItem: (_item, { value, onChange }) =><Input placeholder="请输入优惠券名称"/>
				},
				{
					title: '券头图',
					dataIndex: 'headPic',
					filters: false,
					hideInSearch: true,
					width:140,
					render: (_,row) => [
						<img src={`${row.headPic}`} key="img" style={{width:"120px",height:"120px"}}/>
					]
				},
				{
					title: '券类型',
					dataIndex: 'type',
					renderText:(_, row) => row.typeStr ?  row.typeStr:"",
					width:120,
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select  defaultValue="" onChange={onChange}>
								{
									[{id:"",name:"全部"}].concat(couponTypeList).map((item)=>{
										return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
									})
								}
							</Select>
						);
					}
				},
				{
					title: '券库存',
					dataIndex: 'remainingAmount',
					hideInSearch: true,
					
				},
				{
					title: '已购买',
					dataIndex: 'receiveNum',
					hideInSearch: true
				},
				{
					title: '商户名称',
					dataIndex: 'thirdMerchantName',
					key:"thirdMerchantName",
					renderFormItem: (_item, { value, onChange }) =><Input placeholder="请输入商户名称"/>
				},
				{
					title: '所在区域',
					dataIndex: 'showAddress',
					ellipsis: true,
					render: (_,row) => [
						<div key={0}>{row.showAddress}</div>,
						<div key={1}>{row.address}</div>
					],
					renderFormItem: (_item, { value, onChange }) => (
						<Cascader
							options={cityList}
							showSearch
							allowClear
							style={{ width: '100%' }}
							fieldNames={{ label: 'name', value: 'id', children:'children'}} // 定义label/value/children对应字段
							value={value} // 指定选中项目
							onChange={onChange}
							style={{ width: '200px' }}
						/>
					),
				},
				{
					title: '购买日期',
					dataIndex: 'buyStartTime',
					hideInSearch: true,
					renderText:(_, row) => {
						const  buyStartTime = row.buyStartTime ? row.buyStartTime.split(' ')[0] : "无限"
						const  buyEndTime = row.buyEndTime ? row.buyEndTime.split(' ')[0] : "无限"
						return buyStartTime+'~'+buyEndTime
					},
				},
				{
					title: '状态',
					dataIndex: 'localLifeStatus',
					hideInSearch: true,
					render: (localLifeStatus, row) => {
						return (
							<Switch
								size="large"
								checked={localLifeStatus == 1}
								onChange={ (e)=>{
									if (switchLoading) return
									changeSwitch(row)
								}}
								loading={switchLoading}
								disabled={switchLoading}
							/>
						);
					},
				},
				{
					title: '操作',
					key: 'option',
					valueType: 'option',
					fixed:"right",
					render: (_,row) => [
					<Popconfirm
							title={'确定要删除吗？'}
							okType={'danger'}
							okText={'确定'}
							key="delete"
							onConfirm={() => {
								delLocalLife({id:row.id}).then(res=>{
									if(res.code == "0000"){
										message.success('删除成功')
										actionRef.current.reload()
									}
								})

							}}
					>
							<a key="delete">
								<Text type="danger" style={{cursor:"pointer"}}>删除</Text>
							</a>
					</Popconfirm>,
					<a key="see" style={{ margin:'0px 10px' }} onClick={()=>{
						history.push({
							pathname: '/market/localLife/see',
							query: {
								id: row.id,
							},
						})
					}}>查看</a>
				   ]
				},
		],
		[cityList, switchLoading,couponTypeList],
	);

		return (
			<PageHeaderWrapper>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					// pagination={{
					// 	showSizeChanger: true,
					// }}
					rowSelection = { rowSelection }
					request={getLocalLifePageListForShow}
					columns={columns}
					toolBarRender={() => [
						<Button type="primary" onClick={()=>{
							props.history.push(`/market/localLife/add`)
						}}><PlusOutlined/>新增本地生活券</Button>,
						<Button type="primary" disabled = { selectedRowKeys.length ==0  } onClick={()=>{
							props.history.push(
								{
									pathname:`/market/localLife/choose`,
									query: {
										extendCouponIds:selectedRowKeys.join(','),
									}
								}
							)
						}}>推送分销券</Button>,
						<Button type="primary" onClick={()=>{
							props.history.push(`/market/localLife/record`)
						}}>推送记录</Button>
					]}
					search={{
						collapsed: false,
						optionRender: ({ searchText, resetText }, { form }) => (
							<>
								<Button
									type="primary"
									onClick={() => {
										form.submit();
									}}
									htmlType="submit"
								>
									{searchText}
								</Button>{' '}
								<Button
									onClick={() => {
										form.resetFields();
										form.submit();
									}}
								>
									{resetText}
								</Button>{''}
							</>
						),
					}}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
				/>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global, order, loading,couponMaintain }) => ({
		cityList: global.cityList, // 省市区数据
		orderList: order.orderList,
		serviceTypeContent: global.serviceTypeContent,
		couponTypeList:couponMaintain.couponTypeList,
  		switchLoading: loading.effects['localLife/updateLocalLifeStatus'],
}),
	dispatch => ({
		async getLocalLifePageListForShow  (payload) {
			return dispatch({
				type: 'localLife/getLocalLifePageListForShow',
				payload,
			});
		},
		async delLocalLife  (payload) {
			return dispatch({
				type: 'localLife/delLocalLife',
				payload,
			});
		},
		async updateLocalLifeStatus  (payload) {
			return dispatch({
				type: 'localLife/updateLocalLifeStatus',
				payload,
			});
		},
		async getCityList (payload) {
			return dispatch({
				type: 'global/getCityList',
				payload,
			});
		},
		async getExtendcouponTypeList  (payload) {
			return dispatch({
				type: 'couponMaintain/getExtendcouponTypeList',
				payload,
			});
		},
	}),
)(UserInfo);
