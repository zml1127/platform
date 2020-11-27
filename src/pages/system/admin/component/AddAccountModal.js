import { Input, Modal, Form, Row, Col, Select, message } from 'antd';
import React, { useCallback, memo, useEffect, useMemo, useState, useRef } from 'react';

const { Item, useForm } = Form;
const { Option } = Select;
const { TextArea } = Input;
const inputFormReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/

export default memo(props => {
	const { modalVisible, onCancel, currentRow, onSubmit, roleList, onFresh,onLoginout} = props;
	const actionRef = useRef();

	const [form] = useForm();
	const { resetFields, submit,getFieldValue,setFieldsValue } = form;
	const [resetPass, setResetPass] = useState(false); //修改密码
	useEffect(() => {
		if (modalVisible) setTimeout(() => resetFields(), 0);
	}, [modalVisible, currentRow]);


	// 状态option
	const statusOption = [
		{
			id: 1,
			name: '开启',
		},
		{
			id: 2,
			name: '停用',
		},
	];
	let rowParams = currentRow
		? {
				...currentRow,
				password: '******',
		  }
		: {
				status: 1,
				password: '',
		  };
    // 表单初始化数据
	const initialValues = useMemo(() => rowParams, [currentRow]);

	// 密码框得到焦点
	const focusPasswordName = () => {
		// 如果是编辑 && 有密码
		if(currentRow && getFieldValue('password') == "******"){
			setFieldsValue({password:null})
		}
		setResetPass(true)
	};

	// 格式化数据
	const setData = (values) => {
		
		if(currentRow){//编辑
			let  reSetData = {}
			if(values.password != "******"){//如果密码修改
				reSetData = {
					...values,
					id:currentRow.id,
					newPassword:values.password
				}
			}else{
				reSetData = {
					...values,
					id:currentRow.id,
					password:currentRow.password,
				}
			}
			return reSetData
			
		}else{
			return values
		}
	};

	const handleFinish = useCallback(values => {

		const getData = setData(values)
		onSubmit(getData).then(res => {
			if (res.code == '0000') {
				// 如果是编辑
				if(currentRow){
					//如果是当前登陆用户 && 编辑重要信息修改
					const { userName,roleId,currentUser } = currentRow
					if( currentUser && (values.userName != userName || values.roleId != roleId || values.status == 2 || getData.newPassword )){
						message.warning('当前账户信息发生变化，请重新登陆！');
						onLoginout()
					}else{
						message.success('账户编辑成功');
						onFresh();
						setResetPass(false)
					}
					 
				}else{
					message.success('账户添加成功');
					onFresh();
					setResetPass(false)
				}
			}
		});
	}, [currentRow]);

	// 输入内容校验
	const handleValidator = (rule, val, callback) => {
        if (val) {
			if(val.length > 20){
				callback("最大长度为20个字符")
			}else{
				if(inputFormReg.test(val)){
					callback()
				}else{
					callback("特殊字符只允许输入下划线")
				}
			}
			
        }else{
			callback()
		}
	}
	const handleValuesChange = useCallback((changeValue, allValues) => {}, []);
	return (
		<Modal
			width={600}
			destroyOnClose
			title={currentRow ? '编辑账号' : '添加账号'}
			visible={modalVisible}
			onCancel={onCancel}
			onOk={submit}
			maskClosable={false}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={initialValues}
				onValuesChange={handleValuesChange}
				onFinish={handleFinish}
			>
				<Row gutter={24}>
					<Col span={12}>
						<Item
							label="账户ID"
							name="userName"
							rules={[
								{
									required: true,
									message: '请输入账户ID！',
									whitespace: true,
								},
								{
									validator: handleValidator
								},
							]}
						>
							<Input placeholder="请输入账户ID" />
						</Item>
					</Col>
					<Col span={12}>
						<Item
							label="责任人"
							name="realName"
							rules={[
								{
									required: true,
									message: '请输入责任人！',
									whitespace: true,
								},{
									validator: handleValidator
								},
							]}
						>
							<Input placeholder="请输入责任人" />
						</Item>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={12}>
						<Item
							label="联系方式"
							name="mobile"
							rules={[
								{
									required: true,
									message: '请输入联系方式！',
									whitespace: true,
								},{
									message:'请输入正确联系方式',
              						pattern: /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
								}
							]}
						>
							<Input placeholder="请输入联系方式" />
						</Item>
					</Col>
					<Col span={12}>
						<Item
							label="角色"
							name="roleId"
							rules={[
								{
									required: true,
									message: '请选择角色！',
								}
							]}
						>
							<Select placeholder="请选择">
								{roleList.map(({ id, roleName }) => (
									<Option key={id} value={id}>
										{ roleName }
									</Option>
								))}
							</Select>
						</Item>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={12}>
						<Item
							label="初始密码"
							name="password"
							rules={[
								{
									required: true,
									message: '请输入初始密码！',
									whitespace: true,
								},
								{
									validator: (_, val, callback) => {
										if(val && resetPass){
											if(val.length > 20){
												callback("最大长度为20个字符")
											}else{
												if(inputFormReg.test(val)){
													callback()
												}else{
													callback("特殊字符只允许输入下划线")
												}
											}
										}else{
											callback()
										}
									},
								}
							]}
						>
							<Input placeholder="请输入密码" onFocus={ focusPasswordName } />
						</Item>
					</Col>
					<Col span={12}>
						<Item
							label="状态"
							name="status"
							rules={[
								{
									required: true,
									message: '请输入状态！',
								},
							]}
						>
							<Select placeholder="请选择">
								{statusOption.map(({ id, name }) => (
									<Option key={id} value={id}>
										{name}
									</Option>
								))}
							</Select>
						</Item>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						<Item label="备注" 
							  name="remark"
							  rules={[
								{
									validator: (_, val, callback) => {
										if(val){
											if(val.length > 200){
												callback("最大长度为200个字符")
											}else{
												if(inputFormReg.test(val)){
													callback()
												}else{
													callback("特殊字符只允许输入下划线")
												}
											}
										}else{
											callback()
										}
									},
								}
							]}
						>
							<TextArea rows={4} />
						</Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
});
