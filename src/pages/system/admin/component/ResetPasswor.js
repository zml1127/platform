import { Input, Modal, Form, Row, Col, Select, message } from 'antd';
import React, { useCallback, memo, useEffect, useRef } from 'react';

const { Item, useForm } = Form;
const inputFormReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/

export default memo(props => {
	const { modalVisible, onCancel, currentRow, onSubmit, onFresh,onLoginout } = props;
	const actionRef = useRef();

	const [form] = useForm();
	const { resetFields, submit } = form;

	useEffect(() => {
		if (modalVisible) setTimeout(() => resetFields(), 0);
	}, [modalVisible, currentRow]);

    // 表单初始化数据
	const handleFinish = useCallback(values => {
		const { currentUser } = currentRow
		onSubmit({
			id:currentRow.id,
			newPassword:values.password,
			type:2,
		}).then(res => {
			if (res.code == '0000') {
				if(currentUser){
					onLoginout() 
					message.warning('密码已重置，请重新登陆');
				}else{
					message.success('成功');
				    onFresh();
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
	return (
		<Modal
			width={600}
			destroyOnClose
			title={`重置密码`}
			visible={modalVisible}
			onCancel={onCancel}
			onOk={submit}
			maskClosable={false}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleFinish}
			>
				<Row gutter={24}>
					<Col span={8}>
						<Item
							label="账户ID"
							name="userName"
						>
							<span> { currentRow?currentRow.userName:"" } </span>
						</Item>
					</Col>
					<Col span={8}>
						<Item
							label="责任人"
							name="realName"
							>
							<span>{ currentRow?currentRow.realName:"" }</span>
						</Item>
					</Col>
					<Col span={8}>
						<Item
							label="联系方式"
							name="mobile"
						>
							<span>{ currentRow?currentRow.mobile:"" }</span>
						</Item>
					</Col>
				</Row>
				<Row gutter={24}>
					<Col span={24}>
						<Item
							label="重置密码"
							name="password"
							rules={[
								{
									required: true,
									message: '请输入密码！',
									whitespace: true,
								},
								{
									validator: handleValidator
								},
							]}
						>
							<Input placeholder="请输入" />
						</Item>
					</Col>
				</Row>
				
			</Form>
		</Modal>
	);
});
