import { Input, Modal, Form, Row, Col, Select, Cascader } from 'antd';
import React, { useCallback, memo, useEffect, useMemo, useState } from 'react';

const { Item, useForm } = Form;
const { Option } = Select;

export default memo(props => {
	const { modalVisible, onSubmit, onCancel, bankList, cityList, currentCard } = props;

	let { name, bankCardNo, sysBanksId, sysAreaPid, sysAreaId, openingBankName, userId, id } = currentCard;
	const [form] = useForm();
	const { resetFields, submit } = form;

	useEffect(() => {
		if (modalVisible) setTimeout(() => resetFields(), 0);
	}, [modalVisible]);


	const handleFinish = useCallback(async values => {
		let type = currentCard.name ? 2 : 1;
		let { area_id } = values;
		const submitFields = { ...values, type, area_id: area_id[1], user_id: userId };
		if ( type === 2 ) {
			submitFields.user_bank_id = id;
		}

		onSubmit(submitFields);
	}, [currentCard]);



	const initialValues = {
		name: name || '',
		bank_id: Number(sysBanksId) || '',
		bank_card_no: bankCardNo || '',
		opening_bank_name: openingBankName || '',
		area_id: sysAreaPid? [sysAreaPid, sysAreaId] : []
	}

	return (
		<Modal
			destroyOnClose
			title={`${currentCard.name?'编辑':'新增'}银行卡`}
			visible={modalVisible}
			onOk={submit}
			onCancel={onCancel}
			maskClosable={false}
			// confirmLoading={confirmLoading}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleFinish}
				initialValues={initialValues}
				>
				<Item
					label="账户持有人"
					name="name"
					rules={[
						{
							required: true,
							message: '请输入姓名',
						},
					]}
				>
					<Input placeholder="请输入姓名" />
				</Item>
				<Item
					label="银行"
					name="bank_id"
					rules={[
						{
							required: true,
							message: '请选择银行',
						},
					]}
				>
					<Select placeholder="请选择银行" >
						{
							bankList.map((item)=>{
								let { id, bankName } = item;
								return <Option value={id} key={id}>{bankName}</Option>
							})
						}
					</Select>
				</Item>
				<Item
					label="银行卡号"
					name="bank_card_no"
					rules={[
						{
							required: true,
							message: '请输入卡号',
						},
						{
							validator: (rules, value, callback) => {
								// const reg = /(^[1-9]\d*$)/;
								const reg = /(^[1-9]\d{15,18}$)/;
								if (!reg.test(value)) {
									callback('仅允许输入16~19位数字');
									return;
								}
								callback();
							},
						},
					]}
				>
					<Input placeholder="请输入卡号" />
				</Item>
				<Item
					label="开户行地区"
					name="area_id"
					rules={[
						{
							required: true,
							message: '请选择地区',
						},
					]}
				>
					<Cascader
						options={cityList}
						allowClear
						style={{ width: '100%' }}
						fieldNames={{ label: 'name', value: 'id', children: 'children' }} // 定义label/value/children对应字段
						// value={value} //指定选中项目
						// onChange={onChange}
					/>
				</Item>
				<Item
					label="开户行"
					name="opening_bank_name"
					rules={[
						{
							required: true,
							message: '请输入开户行',
						},
					]}
				>
					<Input placeholder="请输入开户行" />
				</Item>
				
			</Form>
		</Modal>
	);
});
