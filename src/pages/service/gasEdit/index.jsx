import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Input,
	message,
	Switch,
	Cascader,
	DatePicker,
	Tooltip,
	Select,
	Typography, //复制、编辑、标题文本
	Popconfirm,
	Statistic,
	Modal, // 弹框
	Form,
	Row, Menu, Dropdown,Checkbox,
	Col, Breadcrumb,
} from 'antd';
import React, { useRef, useCallback, useMemo, memo, useState, useEffect, } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styled from "styled-components";
import { connect } from 'dva';


const gasService = memo(props => {
	const { getOilGun, getById, updateMerchantOil, } = props
	const { Item, useForm } = Form;
	const [form] = useForm();
	const { submit, setFieldsValue, resetFields } = form;
	const [oilGunList, setOilGunList] = useState([]) //油枪号列表
	const [discountSign, setDiscountSign] = useState(false) // 定额优惠标志
	const [percentSign, setPercentSign] = useState(false) //优惠百分比标志

	const [row, setRow] = useState({}) //回显信息

	useEffect(()=>{
		getById({ id: props.location.query.id }).then(res=>{
			console.log('回显信息res==', res)
			setRow(res)
			form.setFieldsValue({
				oilId: res.oilName ? res.oilName : '', // 油品号
				gunNo: res.gunNo ? res.gunNo.split(',') : [] , //油枪号
				guidePrice: res.guidePrice ? res.guidePrice : '', // 官方指导价
				price: res.price ? res.price : '', // 站内价格
				enableDiscountFixed: res.enableDiscountFixed==1 ? true : false, //定额优惠标志
				discountFixed: res.discountFixed ? res.discountFixed : '' , // 定额优惠
				enableDiscountPercent: res.enableDiscountPercent==1 ? true : false, //优惠百分比标志
				discountPercent: res.discountPercent ? res.discountPercent : null, // 优惠百分比
				status:  res.status == 0 ? 0 : 1, // 状态
			})
		})
	},[])

	useEffect(()=>{
		if(row.enableDiscountFixed==1){
			setDiscountSign(true)
		}else{
			setDiscountSign(false)
		}
		if(row.enableDiscountPercent==1){
			setPercentSign(true)
		}else{
			setPercentSign(false)
		}
	},[ row, ])

	const handleFinish = useCallback(val => {
		console.log('表单结果val==', val)
		let params = {
			oilId: localStorage.getItem('oilId'),
			id: props.location.query.id,
			merchantId: props.location.query.merchantId, //店铺id
			gunNo: val.gunNo.toString(), //油枪号
			guidePrice: val.guidePrice, //官方指导价
			price: val.price, //站内价格
			enableDiscountFixed: val.enableDiscountFixed ? 1 : 0,
			enableDiscountPercent: val.enableDiscountPercent ? 1 : 0,
			status: val.status,
		}
		if(val.enableDiscountFixed){
			params.discountFixed = val.discountFixed
		}
		if(val.enableDiscountPercent){
			params.discountPercent = val.discountPercent
		}
		// console.log('参数Params==', params)
		updateMerchantOil(params).then(res=>{
			if(res){
				message.success('提交成功')
				props.history.go(-1)
			}
		})
	}, [])

	useEffect(()=>{
		getOilGun({ id: props.location.query.merchantId }).then(res=>{
			setOilGunList(res)
		})
	},[])
	
	return (
		<PageHeaderWrapper title={props.location.query.merchantName}>
			<Form
				// {...layout}
				// {...formItemLayout}
				labelCol={ {span:6} }
				style={{ background: "#fff", padding: '10px' }}
				form={form}
				layout="horizontal" // 表单布局
				// initialValues={initialValues} // 表单默认值
				// onValuesChange={handleValuesChange} // 字段值更新时触发回调事件
				onFinish={handleFinish} // 提交表单且数据验证成功后回调事件
			>
				<Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>基本信息</Typography.Title>
				<Row gutter={8}>
					<Col span={12}>
						<Item
							name="oilId"
							label="油品号"
						>
							<Select disabled>
								<Select.Option value={1}>92#</Select.Option>
								<Select.Option value={2}>95#</Select.Option>
								<Select.Option value={3}>98#</Select.Option>
								<Select.Option value={4}>100#</Select.Option>
								<Select.Option value={5}>101#</Select.Option>
							</Select>
						</Item>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={12}>
						<Item
							label="油枪号"
							name="gunNo"
							rules={[{
								required: true,
								message: '请选择油枪号',
							}]}
						>
							<Select
								mode="multiple"
								placeholder="请选择"
								// defaultValue={
								// 	row
								// 		? row.fuelNozzleNum
								// 			? row.fuelNozzleNum.length !== 0
								// 				? row.fuelNozzleNum.split(',')
								// 				: []
								// 			: []
								// 		: []
								// }
								// onChange={gunArr => {
								// 	setChoooseOilGun(gunArr.toString());
								// }}
							>
								{oilGunList.map((v, i) => (
									<Select.Option key={v}>{v}</Select.Option>
								))}
							</Select>
						</Item>
						</Col>
				</Row>
				<Row gutter={8}>
					<Col span={12}>
						<Form.Item
							label="官方指导价"
							name="guidePrice"
							rules={[
								{
									required: true,
									message: '请输入官方指导价',
									// whitespace: true,
								},
								{ 
									pattern: /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
									message: '仅允许输入数字，小数点后最多两位小数',
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<span style={{lineHeight:'32px'}}>元/升</span>
					</Col>
				</Row>
				<Row gutter={8}>
					<Col span={12}>
						<Form.Item
							label="站内价格"
							name="price"
							rules={[
								{
									required: true,
									message: '请输入站内价格',
									// whitespace: true,
								},
								{ 
									pattern: /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
									message: '仅允许输入数字，小数点后最多两位小数',
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<span style={{lineHeight:'32px'}}>元/升</span>
					</Col>
				</Row>
				{/* *********优惠设置******* */}
				<Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>优惠设置</Typography.Title>
				<Row gutter={8}>
					<Col span={3}></Col>
					<Col>
						<Form.Item 
							style={{ display: 'inline-block' }} 
							name="enableDiscountFixed" 
							valuePropName={'checked'}
						>
							<Checkbox
								onChange={e=>{
									setDiscountSign(e.target.checked)
								}}
							/>
						</Form.Item>
						<span style={{lineHeight:'32px'}}>&nbsp;&nbsp;定额优惠：</span>
					</Col>
					<Col span={8}>
						<Form.Item 
							name="discountFixed" 
							style={{ display: 'inline-block',  }}
							rules={[
								{ 
									pattern: /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
									message: '定额优惠仅允许输入数字，小数点后最多输入两位小数',
								},
								{
									validator: (rules, value, callback) => {
										if(form.getFieldValue('enableDiscountFixed')){
											if(!value){
												callback('请输入定额优惠');
												return;
											}
										}
										callback();
									},
								},
							]}
						>
							<Input
								placeholder="0.00"
								disabled={!discountSign}
							/>
						</Form.Item>{' '}
						<span style={{lineHeight:'32px'}}>元/升</span>
					</Col>{' '}
				</Row>
				<Row gutter={8}>
					<Col span={3}></Col>
					<Col>
						<Form.Item
							name="enableDiscountPercent"
							valuePropName={'checked'}
							style={{ display: 'inline-block' }}
						>
							<Checkbox 
								onChange={e=>{
									setPercentSign(e.target.checked)
								}}
							/>
						</Form.Item>
						<span style={{lineHeight:'32px'}}>&nbsp;&nbsp;优惠百分比：</span>
					</Col>
					<Col>
						<Form.Item 
							name="discountPercent" 
							style={{ display: 'inline-block', }}
							rules={[
								{
									validator: (rules, value, callback) => {
										if(form.getFieldValue('enableDiscountPercent')){
											if(!value){
												callback('请输入优惠百分比');
												return;
											}
										}
										if(percentSign){ //勾选了优惠百分比
											let num = form.getFieldValue('discountPercent')
											if(num >=100 || num <= 0 || String(num*100).includes('.')){
												callback('优惠百分比仅允许输入1-99的数，小数点后保留两位');
												return;
											}
										}
										callback();
									},
								},
							]}
						>
							<Input disabled={!percentSign}/>
						</Form.Item>{' '}
						%
					</Col>
				</Row>
				{/* *********首页服务项目位置及状态设置******* */}
				<Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>状态设置</Typography.Title>
				<Row gutter={8}>
					<Col span={12}>
						<Item
							name="status"
							label="状态"
							rules={[
								{
									required: true,
									message: '请选择状态',

								},
							]}
						>
							<Select allowClear>
								<Select.Option value={1}>上架</Select.Option>
								<Select.Option value={0}>下架</Select.Option>
							</Select>
						</Item>
					</Col>
				</Row>

				<div style={{display:'flex',justifyContent:'center'}}>
					<Button type="primary" htmlType="submit" size="large" style={{width:'200px',margin:'0 20px'}}>
						提交
					</Button>
					<Button type="primary" size="large" style={{width:'200px',margin:'0 20px'}} onClick={()=>{
						props.history.go(-1)
					}}>
						取消
					</Button>
				</div>
			</Form>

			
		</PageHeaderWrapper>
	);
});

const ItemCom = styled(Form.Item)`
	.ant-form-vertical .ant-form-item{
		flex-direction: row !important;
	}
`

export default connect(
	({ gasService, global, }) => ({

	}),
	dispatch => ({
		// async getCityList(payload) {
		// 	return dispatch({
		// 		type: 'global/getCityList',
		// 		payload,
		// 	});
		// },
		// 获取油枪号，传入商户Id
		async getOilGun(payload) {
			return dispatch({
				type: 'gasService/getOilGun',
				payload,
			});
		},
		// 获取回显信息 
		async getById(payload) {
			return dispatch({
				type: 'gasService/getById',
				payload,
			});
		},
		// 提交表单 商户油品服务更新 
		async updateMerchantOil(payload) {
			return dispatch({
				type: 'gasService/updateMerchantOil',
				payload,
			});
		},
	}),
)(gasService);
