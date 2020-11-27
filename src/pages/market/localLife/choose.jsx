import { connect } from 'dva';
import React, { useRef, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Cascader,
	Switch,
	Select,
	Modal,
	Typography,
	message,
	Form,
	Input
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
const { Text } = Typography;
const { useForm } = Form;
const UserInfo = memo(props => {
	const {
		queryLeaderPage,
		createExtendsCouponIdAndMerchantIds,
		getExtendcouponTypeList,
		getCityList,
		cityList,
		location,
		sendMessage
	} = props;
	const [form] = useForm();
	const { submit } = form;
	const [selectedRowKeys,setSelectedRowKeys] = useState([])
	const [addDisabled,setAddDisabled] = useState(false)
	const [activeVisable,setActiveVisable] = useState(false)
	const [typeMap,setTypeMap] = useState([])
	
	const actionRef = useRef();
	const {extendCouponIds,id} = location.query

	const onSelectChange = selectedRowKeys=>{
		setSelectedRowKeys(selectedRowKeys)
	}
  	const rowSelection = {
		selectedRowKeys,
		onChange:onSelectChange,
	}

	// 推送
	const sendActive = (value=>{
		const { activityName  } = value
		sendMessage({
			userIds:selectedRowKeys.join(','),
			extendCouponIds,
			activityName,
		}).then(res=>{
			if(res.code == "0000"){
				message.success("推送成功")
				props.history.push('/market/localLife/record')
			}
		})
	})
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
				title: '团长ID',
				dataIndex: 'id',
				filters: false,
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
			},
			{
				title: '分销总金额',
				dataIndex: 'distributionCountMoney',
				hideInSearch: true,
				
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
				hideInSearch:true,
				render:(status,row)=><div>{status==1?"正常":"冻结"}</div>,
				renderFormItem: (_item, { value, onChange }) => {
					return (
						<Select defaultValue={0} onChange={onChange}>
							<Select.Option value={0} key={0}>全部</Select.Option>
							<Select.Option value={1} value={1}>正常</Select.Option>
							<Select.Option value={2} value={2}>冻结</Select.Option>
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
							pathname: '/market/localLife',
						})
					}}>返回</Button>
				}>
				<ProTable
					scroll={{ x: 'max-content'}}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					request={(payload)=>queryLeaderPage(payload)}
					columns={columns}
					toolBarRender={() => [
						<Button  key="add" type="primary" disabled={selectedRowKeys.length ==0 || addDisabled} onClick={()=>{
							setActiveVisable(true)
						}}>发送</Button>,
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
				<Modal width={300} destroyOnClose={true} title="活动名称" visible={ activeVisable } onOk={submit}
						onCancel={()=>{ setActiveVisable(false) }} maskClosable={false}>
						<Form name="basic"  form={form}  onFinish={ sendActive }>	
							<Form.Item name="activityName" label="" rules={[
								{ required: true,message: '活动名称'}
							]}>
								<Input rows={4} placeholder="请输入活动名称"/>
							</Form.Item>
						
						</Form>	
				</Modal>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global }) => ({
		cityList: global.cityList, // 省市区数据
	}),
	dispatch => ({
		async queryLeaderPage(payload) {
			return dispatch({
				type: 'retail/queryLeaderPage',
				payload:{
					...payload,
					status:1,
				},
			});
		},
		// 消息推送
		async sendMessage(payload) {
			return dispatch({
				type: 'localLife/sendMessage',
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
