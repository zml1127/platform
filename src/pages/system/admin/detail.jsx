import { Input, Form, Row, Col, Select, message, Card, Button } from 'antd';
import React, { useCallback, memo, useEffect, useMemo, useState, useRef } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';

const { Item, useForm } = Form;
const { Option } = Select;
const { TextArea } = Input;
const inputFormReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/


const layout = {
	labelCol: { span: 8 },
  	wrapperCol: { span: 16 },
};
const tailLayout = {
  	wrapperCol: { offset: 4, span: 16 },
};
const formItemLayout = {
  	labelCol: {
	    xs: { span: 24 },
	    sm: { span: 8 },
  	},
  	wrapperCol: {
	    xs: { span: 24 },
	    sm: { span: 12 },
  	},
};

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
const Detail = props => {
	const {
		roleList,
		current,
		createUser,
		updateUser,
		location
	} = props;

	const { type, id } = location.query
	const actionRef = useRef();

	const [form] = useForm();
	const {
		resetFields,
		submit,
		getFieldValue,
		setFieldsValue
	} = form;
	const [resetPass, setResetPass] = useState(false); //修改密码

	useEffect(() => {
		let password = type === 'edit' ? '******' : '';
		setFieldsValue({...current, password})
	}, [current]);

    // 表单初始化数据
	// const initialValues = useMemo(() => rowParams, [current]);

	// 密码框得到焦点
	const focusPasswordName = () => {
		// 如果是编辑 && 有密码
		if(type == 'edit' && getFieldValue('password') == "******"){
			setFieldsValue({password:null})
		}
		setResetPass(true)
	};

	// 请求
	const saveUser = (values) => {
		if(type==='edit'){
			let reSetData = {}
			if(values.password != "******"){//如果密码修改
				reSetData = {
					...values,
					id,
					newPassword:values.password
				}
			}else{
				reSetData = {
					...values,
					id,
					password:current.password,
				}
			}
			return updateUser(reSetData)
		} else{
			return createUser(values)
		}
	};

	// 回调
	const submitUserForm = async fieldsValue => {
		const res = await saveUser(fieldsValue);
		if (res) {
			message.success(
				`${type==='edit'?'编辑':'新建'}成功`,
				2,
				()=>{history.push('/system/admin')}
			);
		}
	};

	// 输入内容校验
	const handleValidator = (rule, val, callback) => {
        if (val) {
			if(val.length > 20){
				callback("最大长度为20个字符")
			}
			
        }else{
			callback()
		}
	}
	return (
		<PageHeaderWrapper
			title={`${type==='edit'?'编辑':'添加'}账号`}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={current}
				onFinish={submitUserForm}
				{...formItemLayout}
			>
				<Card 
					title='基本信息'
				>
					<Item
						label="账户ID"
						name="username"
						rules={[
							{
								required: true,
								message: '请输入账户ID！',
								whitespace: true,
							},
						]}
					>
						<Input placeholder="请输入账户ID" />
					</Item>
					<Item
						label="权限选择"
						name="roleId"
						rules={[
							{
								required: true,
								message: '请选择角色！',
							}
						]}
					>
						<Select placeholder="请选择">
							{roleList.map(({ id, roleName, status }) => (
								<Option key={id} value={id} disabled={status===0}>
									{ roleName }
								</Option>
							))}
						</Select>
					</Item>
					<Item
						label="密码设置"
						name="password"
						rules={[
							{
								required: true,
								message: '请输入密码！',
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
					<Item
						label="责任人"
						name="realName"
						rules={[
							{
								required: true,
								message: '请输入责任人！',
								whitespace: true,
							}
						]}
					>
						<Input placeholder="请输入责任人" />
					</Item>
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
					{/*<Item
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
					</Item>*/}
					<Item 
						label="备注" 
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

					<Item {...tailLayout}>
			            <Button htmlType="submit" type="primary">
			              提交
			            </Button>
				
			            <Button htmlType="button" style={{ margin: '0 30px' }} onClick={()=>{history.push('/system/admin')}}>
			              取消
			            </Button>
			        </Item>
				</Card>
			</Form>
		</PageHeaderWrapper>
	);
};


export default connect(
	({ role, admin }) => ({
		roleList: role.roleList,
		current: admin.current
	}),
	dispatch => ({

		async createUser(payload) {
			return dispatch({
				type: 'admin/createUser',
				payload,
			});
		},
		async updateUser(payload) {
			return dispatch({
				type: 'admin/updateUser',
				payload,
			});
		},
	}),
)( Detail
);

