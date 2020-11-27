import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useEffect,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import {
	Select,
	Radio,
	Form,
	Input,
	Button,
	DatePicker,
	TimePicker,
	Row,
	Col,
} from 'antd';
const { TextArea } = Input;
const { useForm } = Form;

import { PlusOutlined, FileExcelFilled } from '@ant-design/icons';
import style from './detail.less';
const { Option } = Select

const userInfoDetail = memo(props => {
	const {
		location,
	} = props;

	const type = location.query.type
	// 获取跳转值
	const selectMaterial = JSON.parse(localStorage.getItem('appletsItem'))

	const [form] = useForm();
	const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
	const [weekType,setWeekType] = useState(type=="edit"?selectMaterial.weekStart?1:2:"")


	useEffect(()=>{

	},[])
	// 格式化日期转化为字符串
	const formatDate = ((value)=>{
		return moment(value).format('YYYY-MM-DD')
	})
	// 字符串转化为日期格式
	const momentDate = ((value)=>{
		return moment(value,"YYYY-MM-DD")
	})
	// 格式化日期转化为字符串
	const formatTime = ((value)=>{
		return moment(value).format('HH:mm:ss')
	})
	// 字符串转化为日期格式
	const momentTime = ((value)=>{
		return moment(value,"HH:mm:ss")
	})
	// 表单初始化数据
	const initialValues =
	 {
		infoType:type=="edit"?selectMaterial.infoType:"",
		temName:type=="edit"?selectMaterial.temName:"",
		templateCon:type=="edit"?selectMaterial.templateCon:"",
		// weekType:type=="edit"?selectMaterial.weekStart?1:2:"",
		// days:type=="edit"?selectMaterial.days:"",
		// times:type=="edit"?selectMaterial.timeList.length:"",
		// weekStart:type=="edit"?momentDate(selectMaterial.weekStart):"",
		// weekEnd:type=="edit"?momentDate(selectMaterial.weekEnd):"",
		// timeList:type=="edit"?selectMaterial.timeList.map(item=>({time:momentTime(item.time)})):[],
	}
	// setFieldsValue({imgBanner:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595931790705&di=9fbcf948fb4d834b14acfe0dbac849f0&imgtype=0&src=http%3A%2F%2Fbbsfiles.vivo.com.cn%2Fvivobbs%2Fattachment%2Fforum%2F201610%2F10%2F223520gj6otfv9t51t9oi9.jpg"})
	// setImgBanner("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1595931790705&di=9fbcf948fb4d834b14acfe0dbac849f0&imgtype=0&src=http%3A%2F%2Fbbsfiles.vivo.com.cn%2Fvivobbs%2Fattachment%2Fforum%2F201610%2F10%2F223520gj6otfv9t51t9oi9.jpg")
	const infoTypeMap = [
		{ value:'1',label:"优惠券促销"},
		{ value:'2',label:"活动推广"}
	]
	const timesMap = [
		{ value:1,label:1,title:"一"},
		{ value:2,label:2,title:"二"},
		{ value:3,label:3,title:"三"},
		{ value:4,label:4,title:"四"},
		{ value:5,label:5,title:"五"},
		{ value:6,label:6,title:"六"},
	]
	// 规则选择
	const onChangeType = ((val)=>{

	})
	// 次数选择
	// const onChangeTimes = ((val)=>{
	// 	let timeList = getFieldValue("timeList")
	// 	let Item = {time:""}
	// 	if(val>timeList.length){
	// 		for(let i=0;i=val-timeList.length;i++){
	// 			timeList.push(Item)
	// 		}
	// 		setFieldsValue({"timeList":timeList})
	// 	}else{
	// 		setFieldsValue({"timeList":timeList.slice(0,val)})
	// 	}
	// })

	const handleFinish =((value)=>{
		// value.timeList.map((item=>({time:formatTime(item.time)} )))
		// validateFields()
	})
	const changeTime = (()=>{
	// 	console.log(validateFields())
	})
	return (
			<PageHeaderWrapper title={`${type=='add'?"新增":"编辑"}模板消息`} >
				<div className={style.base_info}>
					<div className={style.title}>基本信息</div>
					<Form
						name="basic"
						className={style.form_con}
						labelCol={ {span:6} }
						wrapperCol={{span:16}}
						initialValues={initialValues}
						onFinish={handleFinish}
						form={form}
						>
						<Form.Item
							label="模版消息名称"
							name="temName"
							rules={[
								{
									required: true,
									message: '请输入模版消息名称',
								},{
									max:15,
									message: '最大长度为15',
								}
							]}
						>
							<Input placeholder="最多可输入15个字"/>
						</Form.Item>
						<Form.Item
							label="消息类型"
							name="infoType"
							rules={[
								{
									required: true,
									message: '请选择消息类型',
								}
							]}
						  >
							<Select onChange={onChangeType}>{
								infoTypeMap.map((item)=>{
								return <Option value={item.value} key={item.value}>{item.label}</Option>
								})
							}
						  	</Select>
						</Form.Item>
						{/* <Form.Item label="推送周期" name="weekType" rules={[
								{
									required: true,
									message: '请选择推送周期',
								}
							]}>
							<Radio.Group onChange={(val)=>{setWeekType(val.target.value)}}>
								<Radio value={1}>
									<Form.Item
										name="weekStart"
										style={{ display: 'inline-block', width: 'calc(50% - 12px)'}}
										rules={[
											{
												required: weekType==1,
												message: '请选择开始时间',
											},
											{
												validator: (_, val) => {
													if(val && formatDate(getFieldValue('weekEnd')) && formatDate(val)>formatDate(getFieldValue('weekEnd'))){
														return Promise.reject("开始时间不得大于结束时间")
													}else{
														return Promise.resolve();
												}
												},
											}
										]}
									>
										<DatePicker/>
									</Form.Item>
									<span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>-</span>
									<Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }} name="weekEnd"
										rules={[
												{
													required: true,
													message: '请选择结束时间',
												},
												{
													validator: (_, val) => {
														if(val && getFieldValue('weekStart') && formatDate(val)<formatDate(getFieldValue('weekStart'))){
															return Promise.reject("结束时间不得小于开始时间")
														}else{
															return Promise.resolve();
														}
													},
												}
											]}>
										<DatePicker />
									</Form.Item>
								</Radio>
								<Radio value={2}>不限</Radio>
							</Radio.Group>
						</Form.Item> */}
						{/* <Form.Item label="推送频率" name="days">
							<Row>
							    <Col span={1}><span style={{height:"32px",lineHeight:"32px"}}>每</span></Col>
								<Col span={8}>
									<Form.Item
										name="days"
										rules={[
											{
												required: true,
												message: '天数不能为空',
											}
										]}><Input style={{width:"70px",height:"32px",margin:"0 0 0 12px"}}/>
									</Form.Item>
								</Col>
								<Col span={4}><span style={{height:"32px",lineHeight:"32px",margin:"0 6px 0 0"}}>天推送</span></Col>
								<Col span={8}>
									<Form.Item
										name="times"
										rules={[
											{
												required: true,
												message: '请选择次数',
											}
										]}
									>
										<Select style={{width:"70px",marginRight:"5px"}} onChange={onChangeTimes}>{
											timesMap.map((item,index)=>{
												return <Option value={item.value} key={index}>{item.label}</Option>
											})
										}
										</Select>
									</Form.Item>
								</Col>
								<Col span={1} style={{lineHeight:"32px",height:"32px",margin:"0 0 0 12px"}}>次</Col>
							</Row>
						</Form.Item> */}

						{/* <Form.List name="timeList">
							{(fields, { add, remove }) =>
								(<div>
									{fields.map((field,index) => (
											<Form.Item
												name={[field.name, "time"]}
												label={`第${Number(index)+1}次推送时间`}
												fieldKey={[field.fieldKey, "time"]}
												key={index}
												style={{marginLeft:"160px"}}
												rules={[
													{
														required: true,
													},
													{
														validator: (_, val) => {
															if(val){
																let now = formatTime(val)
																let timeList = getFieldValue('timeList')
																
																let preArr = index>0?timeList.filter((item,ins)=>index>ins && item.time).map((item)=>formatTime(item.time)):[]
																let nextArr = timeList.length-1>index?timeList.filter((item,ins)=>index<ins && item.time).map((item)=>formatTime(item.time)):[]

																if( (preArr.every(item=>((item&&item<now) )))
																	&& ( nextArr.every(item=>((item&&item>now) )) )  ){

																	return Promise.resolve()
																}else{
																	return Promise.reject("请输入正确时间")
																}

															}else{
																return Promise.resolve()
															}
														},
													}
												]}
											>
												<TimePicker onChange={changeTime}/>
											</Form.Item>
									))}
								</div>)
                          }
						</Form.List> */}
						<Form.Item
							label="模版消息内容编辑 "
							name="templateCon"
							rules={[
								{
									required: true,
									message: '请输入模版消息内容',
								}
							]}
						  >
							<TextArea style={{  }} rows="8" cols="50"/>
						</Form.Item>
						<div style={{textAlign:'center'}} >
							<Button type="primary" htmlType="submit" className={style.submit}>提交</Button>
							<Button onClick={ ()=>{ resetFields()} }>重置</Button>
						</div>
					</Form>
				</div>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({  global,operation }) => ({
		ossToken: global.ossToken,
		selectMaterial:operation.selectMaterial
	}),
	dispatch => ({
		async getUserInfoList(payload) {
			return dispatch({
				type: 'userManagement/getUserInfoList',
				payload,
			});
		},

	}),
)(userInfoDetail);
