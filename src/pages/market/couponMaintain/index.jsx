import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	message,
	Popconfirm,
	Typography,
	Modal,
	Form,
	Input 
} from 'antd';
const { Text } = Typography;
const { Item, useForm } = Form;
import ProTable from '@ant-design/pro-table';
import { useState } from 'react';

const UserInfo = memo(props => {
	const {
		getExtendcouponTypePage,
		deleteExtendcouponType,
		createExtendcouponType,
		updataExtendcouponType,
	} = props;
	const actionRef = useRef();
	const [currentRow,setCurrentRow] = useState({})
	const [addCodeVisible,setAddCodeVisible] = useState(false)
	const [form] = useForm();
	const { submit } = form;
	const { setFieldsValue } = form;

    useEffect(()=>{
		
	},[])

	const handleFinish =(values)=>{
		const sendRequest = currentRow ? updataExtendcouponType : createExtendcouponType
		sendRequest({
			id:currentRow?currentRow.id:null,
			name:values.name
		}).then(res=>{
			if(res.code == "0000"){
				setAddCodeVisible(false)
				message.success("创建成功")
				actionRef.current.reload()
			}
		})
	}
	const showAddtypeModel =(row)=>{
		setCurrentRow(row)
		setFieldsValue({name:row?row.name:""})
		setAddCodeVisible(true)
	}
	const columns = useMemo(
		() => [
				{
					title: '序号',
					dataIndex: 'index',
					valueType: 'index',
					hideInSearch: true,

				},
				{
					title: '类型',
					dataIndex: 'name',
					key:"name",
					hideInSearch: true
				},
				{
					title: '添加时间',
					dataIndex: 'createTime',
					key:"createTime",
					hideInSearch: true
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
									deleteExtendcouponType({id:row.id}).then(res=>{
										if(res.code == "0000"){
											message.success('删除成功')
											actionRef.current.reload()
										}
									})
								}}
						>
								<a key="delete">
									<Text type="danger">删除</Text>
								</a>
						</Popconfirm>,
						<a key="edit" onClick={ ()=>showAddtypeModel(row) }>编辑</a>
				   ]
				},
		],[],
	);

		return (
			<PageHeaderWrapper>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					request={getExtendcouponTypePage}
					columns={columns}
					toolBarRender={() => [
						<Button type="primary" onClick={ ()=>{ showAddtypeModel()} }>
							< PlusOutlined />添加券类型
						</Button>,
					]}
					search={false}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
				/>
				<Modal width={800} destroyOnClose={true} title="类型" visible={addCodeVisible} width="30%" onOk={submit}
					onCancel={()=>{ setAddCodeVisible(false) }} maskClosable={false}>
						<Form name="basic"  onFinish={ handleFinish } form={form}>	
							<Form.Item name="name" rules={[
								{
									required: true,
									message: '请输入类型名称',
								}
							]}>
								<Input placeholder="请输入类型名称"/>
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
		
		async getExtendcouponTypePage  (payload) {
			return dispatch({
				type: 'couponMaintain/getExtendcouponTypePage',
				payload,
			});
		},
		async createExtendcouponType  (payload) {
			return dispatch({
				type: 'couponMaintain/createExtendcouponType',
				payload,
			});
		},
		async updataExtendcouponType  (payload) {
			return dispatch({
				type: 'couponMaintain/updataExtendcouponType',
				payload,
			});
		},
		
		async deleteExtendcouponType  (payload) {
			return dispatch({
				type: 'couponMaintain/deleteExtendcouponType',
				payload,
			});
		}
	}),
)(UserInfo);
