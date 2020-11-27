import { connect } from 'dva';
import React, { useRef, useMemo, memo,useEffect,useState} from 'react';
import { useToggle } from 'react-use';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Select,
	Typography,
	message,
	DatePicker,
	Modal,
	Form,
	Input 
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import GoodMerchant from "./goodMerchant.js"
const { Text } = Typography;
const { useForm } = Form;
const UserInfo = memo(props => {
	const {
		getExtendcouponListAdd,
		createExtendsCouponIdAndMerchantIds,
		getCityList,
		cityList,
		location
	} = props;
	const [selectedRowKeys,setSelectedRowKeys] = useState([])
	const [currentRow,setCurrentRow] = useState({})
	const [addDisabled,setAddDisabled] = useState(false)

	const [storageVisible,setStorageVisible] = useState(false)
	const [modalVisible, toggleModalVisible] = useToggle(false);

	const [form] = useForm();
	const { submit } = form;
	const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;

	const actionRef = useRef();

	const id = location.query.id
	const { RangePicker } = DatePicker;
	const statusMap = [
		{ title:"全部",value:""},
		{ title:"未投放",value:"0"},
		{ title:"投放中",value:"1"},
	]
	const onSelectChange = selectedRowKeys=>{
		setSelectedRowKeys(selectedRowKeys)
	}
  	const rowSelection = {
		selectedRowKeys,
		onChange:onSelectChange,
	}

	useEffect(()=>{
		getCityList()
	},[])

	// 修改库存
	const changeStorage = ()=>{
	}
	
	 // 展示关联店铺列表
    const showMerchant = (row)=>{
        setCurrentRow(row)
        toggleModalVisible(true)
    }
	

	const columns = useMemo(
		() => [
				{
					title: 'ID',
					dataIndex: 'thirdMerchantName',
					key:"thirdMerchantName",
					hideInSearch: true
				},
				{
					title: '商品券名称',
					dataIndex: 'thirdMerchantName',
					key:"thirdMerchantName",
				},
				{
					title: '适用服务类型',
					dataIndex: 'name',
					key:"name",
					width:300,
					hideInSearch: true
				},
				{
					title: '服务原价',
					dataIndex: 'remainingAmount',
					hideInSearch: true
				},
				{
					title: '优惠价',
					dataIndex: 'receiveNum',
					hideInSearch: true
				},
				{
					title: '已关联店铺数',
					dataIndex: 'receiveNum',
					hideInSearch: true,
					render: (value, row) => <a onClick={ ()=>showMerchant(row) }>{ value }</a>,
				},
				{
					title: '有效期',
					dataIndex: 'buyStartTime',
					renderText:(_, row) => row.buyStartTime ? `${row.buyStartTime.split(" ")[0]}~${row.buyEndTime.split(" ")[0]}`:"",
					hideInSearch:true,
				},
				{
					title: '状态',
					dataIndex: 'goodsStatusStr',
					hideInSearch:true,
				},
				{
					title: '库存',
					dataIndex: 'receiveNum',
					hideInSearch: true,
					fixed:'right',
					width:120,
				},
				{
					title: '操作',
					dataIndex: 'id',
					valueType: 'options',
					hideInSearch: true,
					fixed:'right',
					width: 100,
					render: (_,row) => {
						return (
							<a key="see" style={{ margin:'0px 10px' }} type="text" onClick={()=>{
								setCurrentRow(row)
								setFieldsValue({storage:row.id})
								setStorageVisible(true)
							}}>设置库存</a>
						);
					},
				}

		],
		[cityList,selectedRowKeys],
	);
		return (
			<PageHeaderWrapper 
				footer={
					<Button onClick={()=>{
						history.push({
							pathname: '/merchantManage/merchant/details',
							query: {
								id,
								type:4
							},
						})
					}}>返回</Button>
				}>
				<ProTable
					scroll={{ x: 'max-content'}}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					request={(payload)=>getExtendcouponListAdd(payload,id,2)}
					columns={columns}
					toolBarRender={ false }
					search={ false }
					options={{ fullScreen: true, reload: true, density: false, setting: true }}
				/>
				<Modal width={300} destroyOnClose={true} title="库存设置" visible={storageVisible} onOk={submit}
					onCancel={()=>{ setStorageVisible(false) }} maskClosable={false}>
						<Form name="basic"  onFinish={ changeStorage } form={form}>	
							<Form.Item name="storage" label="" rules={[
								{ required: true,message: '请输入库存调整' }
							]}>
								<Input placeholder="请输入库存调整"/>
							</Form.Item>
						</Form>
				</Modal>
				<GoodMerchant
					currentRow = { currentRow }
					modalVisible = { modalVisible }
					onCancle = { ()=>toggleModalVisible(false) }
					onSearch = { getExtendcouponListAdd }
					>
				</GoodMerchant>
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
					typeForMerchant:2
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
