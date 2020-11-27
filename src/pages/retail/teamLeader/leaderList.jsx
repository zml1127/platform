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
const { Text } = Typography;
const { TextArea } = Input; 
const { useForm } = Form;
const baseUrl = "http://sk-business.oss-cn-zhangjiakou.aliyuncs.com"

// 格式化传参 （分离分页参数和data）
const formatPayload = payload => {
	const params = { ...payload };
	const pagination = {
		current: payload.current,
		pageSize: payload.pageSize,
	};
	const { current, pageSize } = payload;
	delete params.current;
	delete params.pageSize;
	return {
		// ...payload
		current: String(current),
		pageSize: String(pageSize),
	};
};

const UserInfo = memo(props => {
	const {
		getCityList,
		cityList,
		cityListBasic,
		queryLeaderPage,
		updateLeaderCardStatus,
		updateLeaderRate,
		addTeamLeader
	} = props;
	// const [type,SetType] = useState()
	const [addVisible,setAddVisible] = useState(false)
	const [scaVisible,setScaVisible] = useState(false)
	const [statusVisable,setStatusVisable] = useState(false)
	const [currentRow,setCurrentRow] = useState({})
	const [sortType,setSortType] = useState(0)
	
	
	const actionRef = useRef();
	const [form] = useForm();
	const { submit } = form;
	const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;

    useEffect(()=>{
		getCityList()
	},[])
		
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
	// 添加团长
	const handleAdd = (value)=>{
		const { address,area,phone } = value
		const provinceId = area[0] || ""
		const cityId = area[1] || ""
		const districtId = area[2] || ""
		addTeamLeader({
			address,
			phone,
			provinceId,
			cityId,
			districtId,
		}).then(res=>{
			if(res.code == "0000"){
				message.success("添加成功")
				setAddVisible(false)
				actionRef.current.reload()
			}
		})
	}
	// 打开分佣比例
	const setSca = row=>{
		setFieldsValue({
			leaderRate:row.leaderRate,
			memberRate:row.memberRate
		})
		setCurrentRow(row)
		setScaVisible(true)
	}
	// 分佣比例调整
	const changeSal = value=>{
		const { id } = currentRow
		const { leaderRate,memberRate } = value
		if(Number(leaderRate)+Number(memberRate) == 100){
			updateLeaderRate({ id,leaderRate,memberRate }).then(res=>{
				if(res.code == "0000"){
					message.success("修改成功")
					setScaVisible(false)
					actionRef.current.reload()
				}
			})
		}else{
			message.warning("分佣比例之和应为100")
		}
		
	}
	//激活、冻结账户
	const changeStatus = value=>{
		const {id,status} = currentRow
		const { reason } = value
		const newStatus = status ==1 ? 2:1
		const params = status == 1 ? { id,status:newStatus,reason } : { id,status:newStatus }
		updateLeaderCardStatus(params).then(res=>{
			if(res.code == "0000"){
				message.success("成功")
				setStatusVisable(false)
				actionRef.current.reload()
			}
		})

	}
	// 排序
	const onChange = (pagination, filters, sorter)=>{
		let sortObj = {
			"distributionCountMoney":{
				"ascend":"2",
				"descend":"1"
			},
			"distributionNum":{
				"ascend":"4",
				"descend":"3"
			}
		}
		let field = sorter.field
		let type = sorter.order
		setSortType(field && type?sortObj[field][type] : 0 ) 
		actionRef.current.reload()
	}

	const columns = useMemo(
		() => [
				{
					title: '团长ID',
					dataIndex: 'id',
					filters: false,
					renderFormItem: (_item, { value, onChange }) => <Input placeholder="请输入团长ID"/>
				},
				{
					title: '团长名称',
					dataIndex: 'name',
					filters: false,
					hideInSearch: true,
				},
				{
					title: "团长头像",
					dataIndex: 'avatar',
					key:"avatar",
					hideInSearch: true,
					render: (_,row) => [
						<img src={`${row.avatar}`} key="img" style={{width:"100px",height:"100px"}}/>
					]
				},
				{
					title: '本人分销比例',
					dataIndex: 'leaderRate',
					filters: false,
					hideInSearch: true,
				},
				{
					title: '团员分销比例',
					dataIndex: 'memberRate',
					hideInSearch: true
				},
				{
					title: '团长手机号',
					dataIndex: 'phone',
					renderFormItem: (_item, { value, onChange }) => <Input placeholder="请输入团长手机号"/>
				},
				{
					title: '团长位置',
					dataIndex: 'address',
					renderFormItem: (_item, { value, onChange }) => (
						<Cascader
							options={ cityList }
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
					title: '团员数',
					dataIndex: 'memberNum',
					hideInSearch: true,
				},
				{
					title: '完成分销次数',
					dataIndex: 'distributionNum',
					hideInSearch: true,
					sorter:()=>{}
				},
				{
					title: '分销总金额',
					dataIndex: 'distributionCountMoney',
					hideInSearch: true,
					sorter:()=>{}
					
				},
				{
					title: '分销佣金',
					dataIndex: 'distributionMoney',
					hideInSearch: true,
					
				},
				{
					title: '加入时间',
					dataIndex: 'joinTime',
					hideInSearch: true,
				},
				{
					title: '账号状态',
					dataIndex: 'status',
					render:(status,row)=><div>{status==1?"正常":"冻结"}</div>,
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue="" onChange={onChange}>
								<Select.Option value="" key={0}>全部</Select.Option>
								<Select.Option value={1} value={1}>正常</Select.Option>
								<Select.Option value={2} value={2}>冻结</Select.Option>
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
					render: (status,row) => [	
						<a key="active" onClick={()=>{
							setCurrentRow(row)
							setStatusVisable(true)
							setFieldsValue({reason:""})
						}}>{ row.status==1?"冻结":"激活" }账号</a>,
						<a key="pro" onClick={()=>setSca(row)}>分佣比例调整</a>
				   ]
				  },
		],[]
	);
		return (
			<div>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					className={style.material_con}
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={ beforeSearchSubmit }
					pagination={{
						showSizeChanger: true,
					}}
					request={(params)=>queryLeaderPage(params,sortType)}
					columns={columns}
					onChange = { onChange }
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
						<Button type="primary" className={style.add_btn} icon={<PlusOutlined />} onClick={()=>{
							setAddVisible(true)
							setFieldsValue({address:"",area:"",phone:""})
						}}>
						  添加团长
						</Button>,
					  ]}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
				/>

				<Modal width={600} destroyOnClose={true} title="添加团长" visible={addVisible} onOk={submit}
					onCancel={()=>{ setAddVisible(false) }} maskClosable={false}>
						<Form name="basic"  onFinish={ handleAdd } form={form}>	
							<Form.Item name="phone" label="团长手机号" rules={[
								{
									required: true,
									message: '请输入团长手机号',
								},
								{
									pattern:/^1[0-9]{10}$/,
									message: '手机号格式有误',
								}
							]}>
								<Input placeholder="请输入团长手机号"/>
							</Form.Item>
							<Form.Item name="address" label="团长地址" rules={[
								{
									required: true,
									message: ' ',
								}
							]}>
								<Form.Item style={{ display: 'inline-block', width: '100%' }} name="area" rules={[{ required: true, message: '请选择地址',}]}>
									<Cascader options={cityListBasic} showSearch allowClear style={{ width: '100%' }} placeholder="请选择省-市-区"
										fieldNames={{ label: 'name', value: 'id', children:'children'}
									}/>
								</Form.Item>
								<Form.Item style={{ display: 'inline-block', width: '100%' }} name="address" rules={[
									{ required: true, message: '请输入详细地址'},
									{ max: 100, message: '最大可输入100个字'}
									]}>
									<Input placeholder="请输入详细地址"/>
								</Form.Item>
							</Form.Item>
						</Form>
				</Modal>
				<Modal width={600} destroyOnClose={true} title="分佣比例" visible={scaVisible} onOk={submit}
					onCancel={()=>{ setScaVisible(false) }} maskClosable={false}>
						<Form name="basic"  onFinish={ changeSal } form={form}>	
							<Form.Item name="leaderRate" label="团长分佣比例" rules={[
								{ required: true,message: '请输入团长分佣比例' }
							]}>
								<Input placeholder="请输入团长分佣比例"/>
							</Form.Item>
							
							<Form.Item  name="memberRate" label="团员分佣比例" rules={[{ required: true, message: '请输入团员分佣比例'},]}>
								<Input placeholder="请输入团员分佣比例"/>
							</Form.Item>
							
						</Form>
				</Modal>
				<Modal width={currentRow.status == 1?600:300} destroyOnClose={true} title="" visible={ statusVisable } onOk={submit}
						onCancel={()=>{ setStatusVisable(false) }} maskClosable={false}>
							
						<div style={{fontSize:"16px",textAlign:"center",margin:"15px"}}>确定要{currentRow.status == 1?'冻结':"激活"}账号吗？</div> 
						<Form name="basic"  form={form}  onFinish={ changeStatus }>	
						{
							currentRow.status == 1 ? 
								<Form.Item name="reason" label="" rules={[
									{ required: true,message: '请输入冻结原因' }
								]}>
									<TextArea rows={4} placeholder="请输入冻结原因"/>
								</Form.Item>:null
						}
						</Form>	
				</Modal>
			</div>
		);
	})

export default connect(
	({ global, order }) => ({
		cityListBasic: global.cityListBasic,
		cityList: global.cityList,
		orderList: order.orderList,
		serviceTypeContent: global.serviceTypeContent
	}),
	dispatch => ({
		async queryLeaderPage(payload,sortType) {
			return dispatch({
				type: 'retail/queryLeaderPage',
				payload:{
					...payload,
					sortType
				},
			});
		},
		async updateLeaderCardStatus(payload) {
			return dispatch({
				type: 'retail/updateLeaderCardStatus',
				payload,
			});
		},
		async updateLeaderRate(payload) {
			return dispatch({
				type: 'retail/updateLeaderRate',
				payload,
			});
		},
		async addTeamLeader(payload) {
			return dispatch({
				type: 'retail/addTeamLeader',
				payload,
			});
		},
		async deleteOpmaterial(payload) {
			return dispatch({
				type: 'operation/deleteOpmaterial',
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
