import { connect } from 'dva';
import React, { useRef, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Typography,
	Input
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import AroundDetail from './editAddSee'
const { Text } = Typography;
const UserInfo = memo(props => {
	const {
		getExtendcouponListAdd,
		getProductList,
		getExtendcouponTypeList,
		getCityList,
		cityList,
		deleteOpmaterial,
		location
	} = props;
	const [selectedRowKeys,setSelectedRowKeys] = useState([])
	const [seeVisible,setSeeVisible] = useState(false)
	const [seeParam,setSeeParam] = useState({})
	
	const actionRef = useRef();
	const sourceMap = {1:"联联周边游",2:"平台",3:"侠侣"}
	const {type} = location.query
	const onSelectChange = selectedRowKeys=>{
		setSelectedRowKeys(selectedRowKeys)
	}
  	const rowSelection = {
		type:"radio",
		selectedRowKeys,
		onChange:onSelectChange,
	}

	useEffect(()=>{
		
	},[])
	
	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { name } = search;
		let params = {
			name:name||""
		}

		return params;

	};

	// 获取列表数据
	const getList = (params,type)=>{
		 return getProductList({
			 ...params,
			 type
		 }).then(res=>{
			if(res.code == "0000"){
				let data = res.data
				if(data.length==1)setSelectedRowKeys([ data[0]['id'] ])
				return res
			}
		})
	}

	const columns = useMemo(
		() => [
				{
					title: '所属商户',
					dataIndex: 'thirdMerchantName',
					key:"thirdMerchantName",
					hideInSearch:true
				},
				{
					title: '搜索',
					dataIndex: 'name',
					key:"name",
					hideInTable:true,
					renderFormItem: (_item, { value, onChange }) => (
						<Input
							style={{ width: '100%' }}
							value={value} 
							onChange={onChange}
							placeholder={type==3?"请输入产品Id":"请输入名称/地址"}
						/>
					),
				},
				{
					title: '所在区域',
					dataIndex: 'showAddress',
					ellipsis: true,
					hideInSearch:true,
					render: (_,row) => [
						<div key="0">{row.showAddress}</div>,
						<div key="1">{row.address}</div>
					],
					// renderFormItem: (_item, { value, onChange }) => (
					// 	<Cascader
					// 		options={cityList}
					// 		showSearch
					// 		allowClear
					// 		style={{ width: '100%' }}
					// 		fieldNames={{ label: 'name', value: 'id', children:'children'}} // 定义label/value/children对应字段
					// 		value={value} // 指定选中项目
					// 		onChange={onChange}
					// 		style={{ width: '200px' }}
					// 	/>
					// ),
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
					title: '券名称',
					dataIndex: 'name',
					key:"name",
					hideInSearch: true,
				},
				// {
				// 	title: '券类型',
				// 	dataIndex: 'type',
				// 	renderText:(_, row) => row.typeStr ? row.typeStr:"",
				// 	hideInSearch:true,
				// },
				{
					title: '原价',
					dataIndex: 'thirdPrice',
					hideInSearch: true,
					render: (_,row) => [
						<div key="0">￥{row.thirdPrice}</div>
					]
				},
				{
					title: '优惠价',
					dataIndex: 'price',
					hideInSearch: true,
					render: (_,row) => [
						<div key="0">￥{row.price}</div>
					]
				},
				
				// {
				// 	title: '返佣价',
				// 	dataIndex: 'commissionAmount',
				// 	hideInSearch: true,
				// },
				// {
				// 	title: '购买日期',
				// 	dataIndex: 'buyStartTime',
				// 	hideInSearch: true,
				// 	renderText:(_, row) => row.buyStartTime ? `${row.buyStartTime.split(" ")[0]}~${row.buyEndTime.split(" ")[0]}`:"",
				// },
				{
					title: '使用日期',
					dataIndex: 'useStartTime',
					hideInSearch: true,
					renderText:(_, row) => row.useStartTime ? `${row.useStartTime.split(" ")[0]}~${row.useEndTime.split(" ")[0]}`:"",
				},
				{
					title: '商家电话',
					dataIndex: 'thirdMerchantPhone',
					hideInSearch: true,
				},
				{
					title: '操作',
					key: 'option',
					valueType: 'option',
					fixed:"right",
					render: (_,row) => [
						<a href={`${window.location.origin}/#/market/around/edit/see?type=${type}&id=${row.id}`} target="_blank">查看</a>,
						// <a key="see" onClick={()=>{
						// 	history.push({
						// 		pathname: '/market/around/edit/see',
						// 		query: {
						// 			type:type,
						// 			id:row.id,
						// 		},
						// 	})
						// }}>查看</a>,
					]
				}
		],[type]
	);
		return (
			<PageHeaderWrapper 
				footer={
					<div style={{textAlign:"left"}}>
						<Button  key="add" type="primary" disabled={selectedRowKeys.length ==0} onClick={()=>{
							history.push({
								pathname: '/market/around/edit',
								query: {
									from:"add",
									id: selectedRowKeys[0],
									bannerType:type
								},
							})
							
						}}>编辑添加</Button>{' '}
						<Button onClick={()=>{
							history.push({
								pathname: '/market/around/edit',
								query: {
									bannerType:type
								},
							})
						}}>返回</Button>
					</div>
					
				}>
				<ProTable
					scroll={{ x: 'max-content'}}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					request={(payload)=>getList(payload,type)}
					columns={columns}
					// pagination={ false }
					toolBarRender={() => [
		
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
				{/* <Modal  destroyOnClose={true} title="查看" visible={seeVisible} footer={null} width={1000}
					onCancel={()=>{ setSeeVisible(false) }} maskClosable={false}>
						<AroundDetail seeParam={seeParam} type={type}></AroundDetail>
				</Modal> */}
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global }) => ({
		cityList: global.cityList, // 省市区数据
	}),
	dispatch => ({
		async getProductList({name,type}) {
			return dispatch({
				type: 'around/getProductList',
				payload:{
					name:name||"",
					pageSize:9999999,
					type,
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
