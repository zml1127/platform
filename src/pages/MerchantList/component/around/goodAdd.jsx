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
		getListForExtendCouponMerchant ,
		getCityList,
		cityList,
		updateMerchantStock,
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
	const goodStatusMap = [
		{ title:"全部",value:""},
		{ title:"已失效",value:"0"},
		{ title:"未开始",value:"1"},
		{ title:"进行中",value:"2"},
	]
	const goodStatusObj = {
		"0":"已失效",
		"1":"未开始",
		"2":"进行中",
	}
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
	const changeStorage = (value)=>{
		const merchantId = id
		const { totalNum } = value
		updateMerchantStock({merchantId,totalNum,extendCouponId:currentRow.id}).then(res=>{
            if(res.code == "0000"){
                setStorageVisible(false)
                actionRef.current.reload()
            }
        })
	}
	
	 // 展示关联店铺列表
    const showMerchant = (row)=>{
        setCurrentRow(row)
        toggleModalVisible(true)
    }
	
	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { buyTime } = search;
		let buyStartTime = ""
		let buyEndTime = ""
		if(buyTime){
			buyStartTime = buyTime[0].format("YYYY-MM-DD")
			buyEndTime = buyTime[1].format("YYYY-MM-DD")
		}
		let params = {
			...search,
			buyStartTime,
			buyEndTime
		}
		delete params.buyTime
		return params;

	};

	const columns = useMemo(
		() => [
				{
					title: 'ID',
					dataIndex: 'id',
					key:"id",
					hideInSearch: true
				},
				{
					title: '商品券名称',
					dataIndex: 'name',
					key:"name",
					width:180,
					ellipsis:true,
				},
				{
					title: '适用服务类型',
					dataIndex: 'serviceTypeStr',
					key:"serviceTypeStr",
					width:140,
					hideInSearch: true,
					ellipsis:true,
				},
				{
					title: '服务原价',
					dataIndex: 'thirdPrice',
					hideInSearch: true
				},
				{
					title: '优惠价',
					dataIndex: 'price',
					hideInSearch: true
				},
				{
					title: '已关联店铺数',
					dataIndex: 'useNum',
					hideInSearch: true,
					render: (value, row) => <a onClick={ ()=>showMerchant(row) }>{ value }</a>,
				},
				{
					title: '有效期',
					dataIndex: 'buyTime',
					renderText:(_, row) => {
						const  buyStartTime = row.buyStartTime ? row.buyStartTime.split(' ')[0] : "无限"
						const  buyEndTime = row.buyEndTime ? row.buyEndTime.split(' ')[0] : "无限"
						return buyStartTime+'~'+buyEndTime
					},
					renderFormItem: (_item, { value, onChange }) => (
						<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
					),
				},
				{
					title: '状态',
					dataIndex: 'goodsStatus',
					renderText:(_, row) =>goodStatusObj[row.goodsStatus],
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue="" onChange={onChange}>{
								goodStatusMap.map((item,index)=><Select.Option value={item.value} key={index}>{ item.title }</Select.Option>)
							}	
							</Select>
						);
					}
				},
				{
					title: '剩余库存',
					dataIndex: 'stock',
					hideInSearch: true,
					fixed:'right',
					renderText:(_, row) =>row.stock>0?row.stock:'无限',
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
							<a key="see" 
							// disabled={!selectedRowKeys.includes(row.id)} 
							style={{ margin:'0px 10px' }} type="text" onClick={()=>{
								setSelectedRowKeys([row.id])
								setCurrentRow(row)
								setFieldsValue({"totalNum":""})
								setStorageVisible(true)
							}}>添加</a>
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
								type:4,
								tabType:2
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
					request={(payload)=>getExtendcouponListAdd(payload,id,2)}
					columns={columns}
					toolBarRender={() => [
						// <Button  key="add" type="primary" disabled={ selectedRowKeys.length ==0 || addDisabled } onClick={()=>{
						// 	setAddDisabled(true)
						// 	createExtendsCouponIdAndMerchantIds({
						// 		extendCouponIds:selectedRowKeys,
						// 		merchantId:id
						// 	}).then(res=>{
						// 		setTimeout(()=>setAddDisabled(false),1000)
						// 		if(res.code == "0000"){
						// 			actionRef.current.reload()
						// 			setSelectedRowKeys([])
						// 			message.success("添加成功")
						// 		}
						// 	})
						// }}>添加</Button>,
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
				<Modal width={300} destroyOnClose={true} title="库存设置" visible={storageVisible} onOk={submit}
					onCancel={()=>{ setStorageVisible(false) }} maskClosable={false}>
						<Form name="basic"  onFinish={ changeStorage } form={form}>	
							<Form.Item name="totalNum" label="" rules={[
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
					onSearch = { getListForExtendCouponMerchant  }
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
		 // 店铺下商户列表
		 async getListForExtendCouponMerchant  (payload) {
            return dispatch({
                type: 'around/getListForExtendCouponMerchant',
                payload,
            });
		},
         // 店铺下商户库存修改
		 async updateMerchantStock  (payload) {
            return dispatch({
                type: 'around/updateMerchantStock',
                payload,
            });
        },
	}),
)(UserInfo);
