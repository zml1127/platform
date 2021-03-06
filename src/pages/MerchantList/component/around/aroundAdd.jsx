import { connect } from 'dva';
import React, { useRef, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Cascader,
	Switch,
	Select,
	Popconfirm,
	Typography,
	message
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
const { Text } = Typography;
const UserInfo = memo(props => {
	const {
		getExtendcouponListAdd,
		createExtendsCouponIdAndMerchantIds,
		getExtendcouponTypeList,
		getCityList,
		cityList,
		deleteOpmaterial,
		location
	} = props;
	const [selectedRowKeys,setSelectedRowKeys] = useState([])
	const [typeMap,setTypeMap] = useState([])
	const [addDisabled,setAddDisabled] = useState(false)
	const actionRef = useRef();
	const sourceMap = {1:"联联周边游",2:"平台",3:"侠侣"}
	const id = location.query.id
	const onSelectChange = selectedRowKeys=>{
		setSelectedRowKeys(selectedRowKeys)
	}
  	const rowSelection = {
		selectedRowKeys,
		onChange:onSelectChange,
	}

	useEffect(()=>{
		getCityList()
		getExtendcouponTypeList().then(res=>{
			if(res.code === "0000"){
				setTypeMap(res.data)
			}
		})
	},[])
	
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

	const columns = useMemo(
		() => [
				{
					title: '第三方名称',
					dataIndex: 'source',
					renderText:(_, row) => row.source ? sourceMap[row.source]:"",
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue={0} onChange={onChange}>
								<Select.Option value={0}>全部</Select.Option>
								<Select.Option value={1}>联联周边游</Select.Option>
								<Select.Option value={2}>平台</Select.Option>
								<Select.Option value={3}>侠侣</Select.Option>
							</Select>
						);
					}
				},
				{
					title: '所属商户',
					dataIndex: 'thirdMerchantName',
					key:"thirdMerchantName",
				},
				{
					title: '券名称',
					dataIndex: 'name',
					key:"name",
					width:300,
				},
				{
					title: '券头图',
					dataIndex: 'headPic',
					filters: false,
					hideInSearch: true,
					render: (_,row) => [
						<img src={`${row.headPic}`} key="img" style={{width:"120px",height:"120px"}}/>
					]
				},
				{
					title: '券类型',
					dataIndex: 'type',
					renderText:(_, row) => row.typeStr ? row.typeStr:"",
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select  defaultValue="" onChange={onChange}>
								{
									[{id:"",name:"全部"}].concat(typeMap).map((item)=>{
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
					hideInSearch: true
				},
				{
					title: '已购买',
					dataIndex: 'receiveNum',
					hideInSearch: true
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
				// {
				// 	title: '套参数',
				// 	dataIndex: 'thirdPrice',
				// 	hideInSearch: true,
				// },
				{
					title: '购买日期',
					dataIndex: 'buyStartTime',
					hideInSearch: true,
					renderText:(_, row) => row.buyStartTime ? `${row.buyStartTime.split(" ")[0]}~${row.buyEndTime.split(" ")[0]}`:"",
				},
				{
					title: '距离',
					dataIndex: 'distance',
					// hideInTable:true,
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue="" onChange={onChange}>
								<Select.Option value="">由近到远</Select.Option>
								<Select.Option value={500}>500米以内</Select.Option>
								<Select.Option value={1000}>1000米以内</Select.Option>
								<Select.Option value={2000}>2000米以内</Select.Option>
								<Select.Option value={4000}>4000米以内</Select.Option>
								<Select.Option value={8000}>8000米以内</Select.Option>
							</Select>
						);
					}
				},
		],
		[cityList],
	);
		return (
			<PageHeaderWrapper 
				footer={
					<Button onClick={()=>{
						history.push({
							pathname: '/merchantManage/merchant/details',
							query: {
								id,
								type:4,
								tabType:1
							},
						})
					}}>返回</Button>
				}>
				<ProTable
					scroll={{ x: 'max-content'}}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					request={(payload)=>getExtendcouponListAdd(payload,id)}
					columns={columns}
					toolBarRender={() => [
						<Button  key="add" type="primary" disabled={selectedRowKeys.length ==0 || addDisabled} onClick={()=>{
							console.log(id)
							setAddDisabled(true)
							createExtendsCouponIdAndMerchantIds({
								extendCouponIds:selectedRowKeys,
								merchantId:id
							}).then(res=>{
								setTimeout(()=>setAddDisabled(false),1000)
								if(res.code == "0000"){
									actionRef.current.reload()
									setSelectedRowKeys([])
									message.success("添加成功")
								}
							})
						}}>添加</Button>,
					]}
					rowSelection = { rowSelection }
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
					options={{ fullScreen: true, reload: true, density: false, setting: true }}
				/>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global }) => ({
		cityList: global.cityList, // 省市区数据
	}),
	dispatch => ({
		async getExtendcouponListAdd(payload,id) {
			return dispatch({
				type: 'around/getExtendcouponListAdd',
				payload:{
					...payload,
					merchantId:id,
					typeForMerchant:1
				}
			});
		},
		async createExtendsCouponIdAndMerchantIds(payload) {
			return dispatch({
				type: 'around/createExtendsCouponIdAndMerchantIds',
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
