import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {SearchOutlined,PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Tabs,
	Popconfirm,
	Typography,
	message,
	Cascader,
	Select,
	Modal,
	Form,
	Input
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import style from './index.less';
const { useForm } = Form;
const { TextArea } = Input;

const statusMap = [ 
	{title:"全部",value:""},
	{title:"审核中",value:0},
	{title:"驳回",value:-1}
 ]


const UserInfo = memo(props => {
	const {
		getCityList,
		queryApplyLeaderPage,
		updateLeaderStatus,
		cityList
	} = props;

	const actionRef = useRef();
	const [form] = useForm();
	const { submit } = form;
	const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
	const [statusVisable,setStatusVisable] = useState(false)
	const [status,setStatus] = useState(false)
	const [currentRow,setCurrentRow] = useState({})

	const tabArr =[
		{
			key:1,
			value:"团长列表"
		},
		{
			key:2,
			value:"申请列表"
		}
	]

    useEffect(()=>{
		getCityList()
	},[])
	// 通过/驳回请求
	const changeStatus = value=>{
		const { id } = currentRow
		const { reason } = value
		const params =  { id,status,reason }
		updateLeaderStatus(params).then(res=>{
			if(res.code == "0000"){
				message.success("成功")
				setStatusVisable(false)
				actionRef.current.reload()
			}
		})
	}
	 // 表格搜索函数
	const beforeSearchSubmit = search => {	
		const { address } = search;
		let provinceId = address&&address[0]?address[0]:null
		let cityId = address&&address[1]?address[1]:null
		let districtId =address&&address[2]?address[2]:null
		let params = {
			...search,
			provinceId,
			cityId,
			districtId,
		}
		delete params.address
		return params;
	};
	const handleReject = value=>{
		console.log(value)
	}
	const columns = useMemo(
		() => [
				{
					title: '用户ID',
					key:"id",
					dataIndex: 'id',
					filters: false,
					renderFormItem: (_item, { value, onChange }) => (
						<Input placeholder="请输入用户ID"/>
					),
				},
				{
					title: '用户名称',
					dataIndex: 'name',
					key:"name",
					hideInSearch:true,
					filters: false,
				},
				{
					title: "用户头像",
					dataIndex: 'avatar',
					key:"avatar",
					hideInSearch: true,
					render: (_,row) => [
						<img src={`${row.avatar}`} key="img" style={{width:"100px",height:"100px"}}/>
					]
				},
				{
					title: '团员',
					dataIndex: 'hasMember',
					filters: false,
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue={0} onChange={onChange}>
								<Select.Option value={0} key={0}>全部</Select.Option>
								<Select.Option value={1} value={1}>是</Select.Option>
								<Select.Option value={2} value={2}>否</Select.Option>
							</Select>
						);
					}
				},
				{
					title: '用户手机号',
					dataIndex: 'phone',
					renderFormItem: (_item, { value, onChange }) => (
						<Input placeholder="请输入用户手机号"/>
					),
				},
				{
					title: '用户位置',
					dataIndex: 'address',
					// renderText:(value,row)=>
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
					title: '注册时间',
					dataIndex: 'createTime',
					filters: false,
					hideInSearch: true,
				},
				{
					title: '购买分销券次数',
					dataIndex: 'payDistributionNum',
					hideInSearch: true
				},
				{
					title: '分享分销券次数',
					dataIndex: 'shareDistributionNum',
					hideInSearch: true,
				},
				{
					title: '状态',
					dataIndex: 'status',
					render:(value,row)=>value==0?"审核中":"驳回",
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue="" onChange={onChange}>{
								statusMap.map((item,index)=><Select.Option value={item.value} key={index}>{item.title}</Select.Option>)
							}
							</Select>
						);
					}
				},
				{
					title: '操作',
					key: 'option',
					width: 200,
					valueType: 'option',
					fixed: 'right',
					render: (_,row) => 
					row.status == 0?
						[
							<div>
								<a key="active" onClick={()=>{
									setCurrentRow(row)
									setStatus(1)
									setStatusVisable(true)
								}}>审核通过</a>,
								<a key="apply" onClick={()=>{
									setCurrentRow(row)
									setStatus(-1)
									setStatusVisable(true)
								}}>驳回请求</a>
							</div>
					]:null
				  },
		],[],
	);
		return (
				<div>
					<ProTable
						scroll={{ x: 'max-content' }}
						tableClassName="pro-table-padding"
						className={style.material_con}
						actionRef={actionRef}
						rowKey="id"
						beforeSearchSubmit={beforeSearchSubmit}
						pagination={{
							showSizeChanger: true,
						}}
						request={(params)=>queryApplyLeaderPage(params)}
						columns={columns}
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
						toolBarRender={() => [
						]}
						options={{ fullScreen: false, reload: false, density: false, setting: false }}
					/>
					<Modal width={status == -1?600:300} destroyOnClose={true} title="" visible={ statusVisable } onOk={submit}
						onCancel={()=>{ setStatusVisable(false) }} maskClosable={false}>
							
						<div style={{fontSize:"16px",textAlign:"center",margin:"15px"}}>确定要{ status == 1?"通过":"驳回"}请求吗？</div> 
						<Form name="basic"  form={form}  onFinish={ changeStatus }>	
						{
							status == -1 ? 
								<Form.Item name="reason" label="" rules={[
									{ required: true,message: '请输入驳回原因'}
								]}>
									<TextArea rows={4} placeholder="请输入驳回原因"/>
								</Form.Item>:null
						}
						</Form>	
					</Modal>
				</div>
		);
	})

export default connect(
	({ global, order }) => ({
		cityList: global.cityList,
		orderList: order.orderList,
		serviceTypeContent: global.serviceTypeContent
	}),
	dispatch => ({
		async queryApplyLeaderPage(params,type) {
			return dispatch({
				type: 'retail/queryApplyLeaderPage',
				payload:{
					...params,
					type
				}
			});
		},
		async updateLeaderStatus(payload) {
			return dispatch({
				type: 'retail/updateLeaderStatus',
				payload,
			});
		},
		async getCityList (payload) {
			return dispatch({
				type: 'global/getCityList',
				payload,
			});
		},
		
	}),
)(UserInfo);
