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
	message,
	TreeSelect,
	Row,
	Col
} from 'antd';
import { history } from 'umi';
const { TreeNode } = TreeSelect;
import ProTable from '@ant-design/pro-table';
const { Text } = Typography;
const UserInfo = memo(props => {
	const {
		getLocalLifePageListFowAdd,
		getaddLocalLife,
		getExtendcouponTypeList,
		getCityList,
		cityList,
		location,
		couponTypeList,
        getAssoiatList,
	} = props;
	const [selectedRowKeys,setSelectedRowKeys] = useState([])
	const [typeMap,setTypeMap] = useState([])
	const [addDisabled,setAddDisabled] = useState(false)
	const actionRef = useRef();
	const sourceMap = {1:"联联周边游",2:"平台",3:"侠侣",4:"商品券"}

	const [assoiatList1, setAssoiatList1] = useState([]) //关联服务项下方列表
	const [assoiatList20, setAssoiatList20] = useState([]) //关联服务项下方列表
	const [serviceId, setServiceId] = useState('')

	const id = location.query.id
	const [serviceType, setServiceType] = useState("") //折扣券下的关联服务 1加油 20洗美装
	const onSelectChange = selectedRowKeys=>{
		setSelectedRowKeys(selectedRowKeys)
	}
  	const rowSelection = {
		selectedRowKeys,
		onChange:onSelectChange,
	}

	useEffect(()=>{
		getCityList()
		getExtendcouponTypeList()
	},[])

	// 服务列表
	useEffect(()=>{
        getAssoiatList({ pid: serviceType }).then(res=>{
            if(res){
                if(serviceType==1){
                    setAssoiatList1(res)
                }else{
                    setAssoiatList20(res)
                }
            }
        })
	},[ serviceType])


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
								<Select.Option value={4}>商品券</Select.Option>
							</Select>
						);
					}
				},
				{
					title: '所属商户',
					dataIndex: 'thirdMerchantName',
					key:"thirdMerchantName",
					renderText:(_, row) => row.ownerMerchantName ? row.ownerMerchantName:row.thirdMerchantName,
					
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
					hideInSearch: true
				},
				// {
				// 	title: '已购买',
				// 	dataIndex: 'receiveNum',
				// 	hideInSearch: true
				// },
				{
					title: '所在区域',
					dataIndex: 'showAddress',
					ellipsis: true,
					render: (_,row) => [
						<div key={0}>{row.showAddress}</div>,
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
					renderText:(_, row) => {
						const  buyStartTime = row.buyStartTime ? row.buyStartTime.split(' ')[0] : "无限"
						const  buyEndTime = row.buyEndTime ? row.buyEndTime.split(' ')[0] : "无限"
						return buyStartTime+'~'+buyEndTime
					},
				},
				{
					title:"服务类型",
					dataIndex: 'serviceType',
					hideInTable:'true',
					renderFormItem: (_item, { value, onChange }) => (
			
								<Select onChange={val=>{
									setServiceType(val)
									setServiceId("")
								}}  defaultValue="">
									<Select.Option value="">全部</Select.Option>
									<Select.Option value={1}>加油</Select.Option>
									<Select.Option value={20}>洗美装</Select.Option>
								</Select>
					)
				},
					{
						title:"",
						dataIndex: 'serviceId',
						hideInTable:'true',
						renderFormItem: (_item, { value, onChange }) => (
							<TreeSelect
								showSearch
								style={{ width: '100%' }}
								value={ serviceId }
								placeholder="请选择"
								allowClear
								// multiple  多选
								onChange={(value)=>{
									setServiceId (value)
								}}
							>
								{
									(serviceType==1?assoiatList1:assoiatList20).map(v=>{
										return (
											<TreeNode value={v.id} title={v.name} key={v.id}>
												{
													v.children&&v.children.length!==0 ? 
													v.children.map(c2=>{
														return (
															<TreeNode value={c2.id} title={c2.name} key={c2.id}>
																{
																	c2.children&&c2.children.length!==0 ? 
																		c2.children.map(c3=>{
																			return (
																				<TreeNode value={c3.id} title={c3.name} key={c3.id}>
																					{
																						c3.children&&c3.children.length!==0 ? 
																							c3.children.map(c4=>{
																								return (
																									<TreeNode value={c4.id} title={c4.name} key={c4.id}></TreeNode>
																								)
																							})
																						:''
																					}
																				</TreeNode>
																			)
																		})
																	:''
																}
															</TreeNode>
														)
													})
														: ''
												}
											</TreeNode>
										)
									})
								}
							</TreeSelect>
						),

				}
		],
		[cityList,assoiatList1,assoiatList20,serviceType,serviceId],
	);
		return (
			<PageHeaderWrapper 
				footer={
					<Button onClick={()=>{
						props.history.go(-1)
					}}>返回</Button>
				}>
				<ProTable
					scroll={{ x: 'max-content'}}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					request={(params)=>getLocalLifePageListFowAdd(params,serviceType,serviceId)}
					columns={columns}
					toolBarRender={() => [
						<Button  key="add" type="primary" disabled={selectedRowKeys.length ==0 || addDisabled} onClick={()=>{
							setAddDisabled(true)
							getaddLocalLife({
								ids:selectedRowKeys,
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
										//清空服务类型数据
										setServiceType("")
										setServiceId("")
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
	({ global,couponMaintain }) => ({
		cityList: global.cityList, // 省市区数据
		couponTypeList:couponMaintain.couponTypeList,
	}),
	dispatch => ({
		async getLocalLifePageListFowAdd(payload,serviceType,serviceId) {
			return dispatch({
				type: 'localLife/getLocalLifePageListFowAdd',
				payload:{
					...payload,
					serviceType,
					serviceId,

				},
			});
		},
		async getaddLocalLife(payload) {
			return dispatch({
				type: 'localLife/getaddLocalLife',
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
		 // 获取关联服务项列表
		 async getAssoiatList(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
			return dispatch({
				type: 'coupon/getAssoiatList',
				payload
			});
        },
	}),
)(UserInfo);
