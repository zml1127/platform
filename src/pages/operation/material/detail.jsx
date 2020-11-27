import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useEffect,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Table,
	Select,
	Radio,
	Form,
	Input,
	Upload,
	Button,
	message,
	Row,
	Col
} from 'antd';
const { TextArea } = Input;
const { useForm } = Form;
import { history } from 'umi';
import { PlusOutlined, FileExcelFilled } from '@ant-design/icons';
import style from './detail.less';
import styled from 'styled-components';
import OSS from 'ali-oss';
const { Option } = Select
const userInfoDetail = memo(props => {
	const {
		getStsToken,
		location,
		ossToken,
		getOpmaterialId,
		createOpmaterial,
		updateOpmaterial
	} = props;

	const {id,type} = location.query
	const [bannerType, setBannerType] = useState(Number(location.query.bannerType))
	const [form] = useForm();
	const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
	// 图片相关
	const [imgUrl, setImgUrl] = useState("")
	const baseUrl = "http://sk-business.oss-cn-zhangjiakou.aliyuncs.com"
	const radioArr=[
		{ value:1,label:"Banner" },
		{ value:2,label:"胶囊图" },
		{ value:3,label:"Icon" },
	]
	const speces = {
		1:[ { value:'750*320',label:"平台Banner 750*320"}],
		2:[ { value:'750*320',label:"首页胶囊 750*320"},
			{ value:'690*220',label:"商家胶囊  690*220"},
			{ value:'690*176',label:"我的’胶囊 690*176"},
		],
		3:[ { value:'104*104',label:"福利中心 104*104"}]
	}

	useEffect(()=>{
		if(type=="edit"){
			getOpmaterialId({id}).then(res=>{
				if(res.code == "0000"){
					let data = res.data
					setImgUrl(`${data.imgUrl}`)
					setBannerType(data.type)
					setFieldsValue({
						type:data.type,
						spec:data.spec,
						imgUrl:`${data.imgUr}`,
						name:data.name,
						mark:data.mark,
					})
				}	
			})
		}else{
			setFieldsValue({type:bannerType,spec:speces[1][0]["value"]})
		}
		getStsToken()
	},[])
	 
	
	// 规则选择
	const onChangeSpecs = (()=>{

	})
	const getUrl = useCallback(
		(file, type) => {
				if (ossToken.expiration > Date.now()) {
					// 没有过期
					const client = new OSS({
						region: ossToken.region,
						accessKeyId: ossToken.accesKeyId, 
						accessKeySecret: ossToken.accesKeySecret, 
						stsToken: ossToken.securityToken, 
						bucket: ossToken.bucket, 
					});
					client.put(`/material${Date.now()}`, file)
						.then(function(rl) {
							setImgUrl(rl.url);
							setFieldsValue({imgUrl:rl.url})
						})
						.catch(err => {});
				} else {
					getStsToken().then(res => {
						if (res.code === '0000') {
							getUrl(file, type);
						}
					});
				}
		},[ossToken]
	);
	const beforeUpload = useCallback(
		(file, type) => {
			if (!['image/png','image/jpeg'].includes(file.type)) {
				message.error("请选择JPEG、JPG、PNG格式图片");
			}else{
				getUrl(file, type);
			}
		},
		[ossToken],
	);

	const handleFinish =((value)=>{
		let params={
			...value,
			imgUrl:`/material${imgUrl.split('/material')[1]}`,
		}
		if(type=="add"){
			createOpmaterial(params).then(res=>{
				if(res.code == "0000"){
					message.success('创建成功')
					history.push({
						pathname: '/operation/material',
						query: {
							detailType:getFieldValue("type"),
						},
					})
				}
			})
		}
		if(type=="edit"){
			updateOpmaterial({
				id,
				...params
			}).then(res=>{
				if(res.code == "0000"){
					message.success('更新成功')
					history.push({
						pathname: '/operation/material',
						query: {
							detailType:getFieldValue("type"),
						},
					})
				}
			})
		}
		
	})

	const handleReset = ()=>{
		resetFields()
		setImgUrl("")
	}
	return (
			<PageHeaderWrapper title={`${type=='add'?"新增":"编辑"}素材`} >
				<div className={style.base_info}>
					<div className={style.title}>基本信息</div>
					<Form
						name="basic"
						className={style.form_con}
						labelCol={ {span:4} }
						onFinish={handleFinish}
						form={form}
						>
						<Form.Item
							label="素材类型"
							name="type"
							rules={[
							{
								required: true,
								message: '请选择素材类型',
							},
							]}
						>
							<Radio.Group buttonStyle="solid" onChange={(e)=>{
								setBannerType(e.target.value)
								setFieldsValue({"spec":speces[e.target.value][0]['value'],type:e.target.value})
							}}>{
								radioArr.map((item)=>{
									return <Radio.Button value={item.value} key={item.value} 
												style={{marginRight:"20px",borderRadius:"40px",width:"100px",textAlign:"center"}}>
													{item.label}
											</Radio.Button>
								})
							}
							</Radio.Group>
						</Form.Item>
						
						<Form.Item label="图片" name="imgUrl" className={style.bannerPic}
						rules={[{ required: true, message: '请选择图片' }]}
						>
							<Upload beforeUpload={file => beforeUpload(file, 'banner')} 
									name="file" 
									showUploadList={false} 
									listType="picture-card"
									fileList={[imgUrl]}
									onChange={({ file, fileList }) => {
										if (file.status === 'removed') {
											setImgUrl([])
										}
									}}>
								
								<div style={{ border: 'dashed 2px #eee', width: 150, height: 150}} className={style.img_con}>
									<PlusOutlined className={style.plus} />
									{imgUrl ? <img src={imgUrl} style={{ width: 150, height: 150,}} /> : null}
								</div>
							</Upload>
							<div style={{color:"red",fontSize:"12px"}}>注：请选择JPEG、JPG、PNG格式图片</div>
						</Form.Item>
						
						<Form.Item
							label="素材名称"
							name="name"
							rules={[
								{
									required: true,
									message: '请输入素材名称',
								},
								{
									max: 15,
									message: '最大可输入15个字',
								}
							]}
						>
							<Input/>
						</Form.Item>
						{/* {console.log(getFieldValue('type'))} */}
						<Form.Item
							label="素材规格"
							name="spec"
							rules={[
								{
									required: true,
									message: '请选择素材规格',
								}
							]}
						  >
							<Select onChange={onChangeSpecs}>{
								speces[bannerType]?speces[bannerType].map((item)=>{
									return <Option value={item.value} key={item.value}>{item.label}</Option>
								}):null
							}
						  	</Select>
						</Form.Item>
						<Form.Item
							label="备注"
							name="mark"
						  >
							<TextArea placeholder="请输入" style={{  }} rows="8"/>
						</Form.Item>
						<Form.Item>
							<div style={{textAlign:'center'}}>
								<Button type="primary" htmlType="submit" className={style.submit}>提交</Button>
								<Button onClick={ handleReset } >重置</Button>
							</div>
						</Form.Item>
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
		async getOpmaterialId(payload) {
			return dispatch({
				type: 'operation/getOpmaterialId',
				payload,
			});
		},
		async createOpmaterial(payload) {
			return dispatch({
				type: 'operation/createOpmaterial',
				payload,
			});
		},
		async updateOpmaterial(payload) {
			return dispatch({
				type: 'operation/updateOpmaterial',
				payload,
			});
		},
		async getStsToken (){
			return dispatch({
				type: 'global/getStsToken',
			});
		}
	}),
)(userInfoDetail);
