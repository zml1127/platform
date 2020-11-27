/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
import { connect } from 'dva';
import React, { memo, useState, useEffect, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Row, Col, Select, Cascader, Tooltip, Upload, message, DatePicker, TimePicker, Radio, InputNumber } from 'antd';

import lodash from 'lodash';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import OSS from 'ali-oss';
import moment from 'moment';
import { mobileReg, photoIsNoTwoMB, OssUrlPreFix } from '@/utils/utils';
import styled from 'styled-components';
import Map from './Map';



const { RangePicker } = DatePicker;


const { Option } = Select;
const { Item } = Form;

// 过滤掉没有映射关系的标签
const filterTag = (data, map) => {
	let _data = []
	if ( data ) {
		let list = data.split(',');
		_data = list.filter((item)=>{
			let temp = map.find((d)=>{
				return d.id == item
			})
			return !!temp
		})
	}
	return _data
}
export default connect(
	({global, merchant}) => ({
		position: global.cityListBasic,
		typeList: merchant.typeList
	}),
	dispatch => ({
		async getStsToken() { // 获取用于oss的token
			return dispatch({
				type: 'global/getStsToken'
			})
		},
		async getMerchantId(id) {
			return dispatch({
				type: 'merchant/getMerchantId',
				id
			});
		},// 编辑
		async postMerchantUpdate(data) {
			return dispatch({
				type: 'merchant/postMerchantUpdate',
				data
			});
		},// 新增
		async postMerchantCreate(data) {
			return dispatch({
				type: 'merchant/postMerchantCreate',
				data
			});
		},
		async areaListBasic() {
			return dispatch({
				type: 'global/getCityList',

			});
		},


	})
)(
	memo(props => {
		const [row, setRow] = useState({})
		// 获取服务标签
		const {
			ossToken,
			getStsToken,
			getMerchantId,
			postMerchantUpdate,
			postMerchantCreate,
			position,
			typeList
		} = props;
		// 设置服务标签
		const serviceTag = JSON.parse(localStorage.getItem("serviceTag"));
		const specialTag = JSON.parse(localStorage.getItem("specialTag"));
		//

		const { id } = props.location.query;
		// row是请求的数据
		const [form] = Form.useForm();
		const { setFieldsValue } = form;
		const [currentArea, setCurrentArea] = useState([]);// 设置区域
		const [currentimgUrl, setImgUrl] = useState([]) // 展示图
		const [imgUrlOnly, setImgUrlOnly] = useState("") // 头图
		const [areaUpData, setareaUpData] = useState({
			provinceId: lodash.get(row, 'provinceId	', null),
			cityId: lodash.get(row, 'cityId', null),
			districtId: lodash.get(row, 'districtId', null),
		});
		useEffect(() => {
			fetchAreaList();
		}, [])
		async function fetchAreaList() {
			if (id) {
				// 编辑
				fetchComment(position);
			} else {
				// x新增
				form.setFieldsValue({ merchantTypeId: 1, status: 1 })
			}
		}



		async function fetchComment(initArea) {
			const Data = await getMerchantId(id);
			if (Data) {
				if (Data.tel) {
					// 有区号的时候 做区分 没有区号直接放置到后面
					if (Data.tel.includes('-')) {
						Data.prefix = Data.tel.split("-")[0];
						Data.serviceTel = Data.tel.split("-")[1];
					} else {
						Data.serviceTel = Data.tel;
					}
				}
				// imgUrlOnly 商户头图
				await setRow({ ...Data });
				// 头图处理
				if (Data.headPic) {
					setImgUrlOnly(Data.headPic)
				}
				// 展示图处理
				if (Data.pic) {
					if (Data.pic.split(",").length > currentimgUrl.length) {

						const urlTemp = [];
						Data.pic.split(",").map((item, index) => {
							urlTemp.push({ url: item, uid: index })
							return item
						})
						setImgUrl(urlTemp);
					}
				}
				const provinceIdData = initArea.find(item => (Number(item.id) === Data.provinceId))
				let currentAreas = [];
				if(provinceIdData){

					const cityIdData = provinceIdData.children && provinceIdData.children.find(item => (Number(item.id) === Data.cityId));
					const districtIdData = cityIdData && cityIdData.children && cityIdData.children.find(item => (Number(item.id) === Data.districtId));
					[provinceIdData, cityIdData, districtIdData].forEach((item)=>{
						item && item.name && currentAreas.push(item.name)
					})
					setCurrentArea([...currentAreas]);
				}
				// 处理提前
				// const area=Data.provinceId ? [Data.provinceId, Data.cityId, Data.districtId] : [];
				form.setFieldsValue({
					...Data,
					area: [...currentAreas],
					serviceTag: filterTag(Data.serviceTag, serviceTag),
					specialTag: filterTag(Data.specialTag, specialTag),
					vaild: [
						Data.validStartTime ? moment(Data.validStartTime, "YYYY/MM/DD") : null,
						Data.validEndTime ? moment(Data.validEndTime, "YYYY/MM/DD") : null],
					openi: [
						Data.openStartTime ? moment(Data.openStartTime, "HH:mm") : null,
						Data.openEndTime ? moment(Data.openEndTime, "HH:mm") : null,
					]
				})
			}
		}





		const [ossTokencurrent, setossToken] = useState(ossToken);
		const getStsTokenFn = useCallback(async () => {
			const res = await getStsToken();
			if (res) {
				setossToken(res.data)
			}
		}, [ossTokencurrent])
		useEffect(() => {
			getStsTokenFn();
		}, []);

		// 首次加载地图  通过经纬度 设置地图
		const [initCity, setinitCity] = useState(false);
		const [currentAreaStr, setcurrentAreaStr] = useState('');


		const onChangeCascader = (value, options) => {
			const address=lodash.get(options, '[0].name', "全部") + lodash.get(options, '[1].name', "全部") + lodash.get(options, '[2].name', "全部")
			setcurrentAreaStr(address);


			setinitCity(true);
			form.setFieldsValue({"address":address})
			setareaUpData({ provinceId: value[0], cityId: value[1], districtId: value[2] });
		};

		const getUrl = useCallback(async (file, type) => {


			if (ossTokencurrent && JSON.stringify(ossTokencurrent) !== "{}") {
				if (ossTokencurrent.expiration > Date.now()) { // 没有过期
					const client = new OSS({
						region: ossTokencurrent.region,
						accessKeyId: ossTokencurrent.accesKeyId,//
						accessKeySecret: ossTokencurrent.accesKeySecret,//
						stsToken: ossTokencurrent.securityToken, //
						bucket: ossTokencurrent.bucket, //
					})


					if (type === 'headPic') {

						const rl = await client.put(`/ptd/Pic${Date.now()+Math.round(Math.random()*10000)}`, file)
						if (rl) {
							return rl.url.replace("http://sk-business.oss-cn-zhangjiakou.aliyuncs.com","http://sk-oss.shangkehy.com")
						}
					} else {
						const rl = await client.put(`/ptd/Img${Date.now()+Math.round(Math.random()*10000)}`, file)
						if (rl) {
							return rl.url.replace("http://sk-business.oss-cn-zhangjiakou.aliyuncs.com","http://sk-oss.shangkehy.com")
						}
					}
					// }
				}
				else {
					getStsToken().then(res => {

						if (res.msg === "ok") {
							getUrl(file, type)
						}
					})
				}
			}
		}, [ossTokencurrent, currentimgUrl,])
		// 上传之前
		const beforeUpload = useCallback(async file => {  // 上传文件之前的钩子
			if (photoIsNoTwoMB(file)) {
				const res = await getUrl(file, 'pic')

				const lastcurrentimgUrl = await currentimgUrl.length > 0 ? currentimgUrl[currentimgUrl.length - 1] : {
					uid: 1,
				};
				//
				const resData = await { uid: Number(lastcurrentimgUrl.uid) - 1, name: file.name, url: res};
				const newcurrentimgUrl = [ ...currentimgUrl,resData]
				// return resData
				setImgUrl(newcurrentimgUrl);
				//
				const onlyUrl = newcurrentimgUrl.map(item => (item.url))


				form.setFieldsValue({ pic: onlyUrl.join(",") })
			}

		}, [ossTokencurrent, currentimgUrl, form.getFieldValue('pic')])


		// 上传之前
		const beforeUploadheadPic = useCallback(async file => {  // 上传文件之前的钩子
			if (photoIsNoTwoMB(file)) {
				const res = await getUrl(file, 'headPic')
				// return resData
				if (res) {

					form.setFieldsValue({ headPic: res })
					setImgUrlOnly(res);
				}
			}
		}, [ossTokencurrent, imgUrlOnly, form.getFieldValue('headPic')])
		const formItemLayout = {
			labelCol: { span: 12 },
			wrapperCol: { span: 14 },
		};


		const [prefixState, setPrefixState] = useState(false);
		const onChangePhone = (e) => {
			const { value } = e.target;
			if (value.length === 11) {
				if (mobileReg.test(value)) {
					setPrefixState(true)
					form.setFieldsValue({ prefix: "86" })
				} else {
					message.error("手机号格式有误")
				}

			} else if (value.length !== 11 && form.getFieldValue("prefix") === "86") {

				setPrefixState(false)
				form.setFieldsValue({ prefix: "" })
			}
		}

		// const value={start:null,end:null}
		const beforeSubmit = (Obj) => {
			const newTemp = { ...row, ...Obj, ...areaUpData }
			console.log('Obj', newTemp, Obj)
			delete newTemp.area;
			if ( Obj.specialTag ) {
				newTemp.specialTag = Obj.specialTag.join(",");
			}
			if ( Obj.serviceTag ) {
				newTemp.serviceTag = Obj.serviceTag.join(",");
			}
			newTemp.tel = `${Obj.prefix}-${Obj.serviceTel}`;
			const  headPicTemp=Obj.headPic||row.headPic
			newTemp.headPic = headPicTemp.replace(OssUrlPreFix, "");
			if (Obj.pic||row.pic) {
				const temp=Obj.pic||row.pic;
				newTemp.pic = temp.replace(new RegExp(OssUrlPreFix, "g"), "");
			}
			delete newTemp.prefix;
			delete newTemp.serviceTel;
			if(Obj.vaild){

				newTemp.validStartTime = Obj.vaild[0] ? moment(Obj.vaild[0]).format("YYYY-MM-DD") : row.validStartTime;
				newTemp.validEndTime = Obj.vaild[1] ? moment(Obj.vaild[1]).format("YYYY-MM-DD") : row.validEndTime;
			}
			newTemp.openStartTime = Obj.openi ? moment(Obj.openi[0]).format("HH:mm") : row.openStartTime;
			newTemp.openEndTime = Obj.openi ? moment(Obj.openi[1]).format("HH:mm") : row.openEndTime;
			delete newTemp.vaild
			delete newTemp.openi
			console.log('newTemp', newTemp)
			return newTemp;
		}
		const onFinish = (value) => {
			const tempValue = beforeSubmit(value);
			if (row.id) {
				postMerchantUpdate({ ...tempValue, id: row.id }).then((res) => {
					if (res) {
						props.history.goBack()
						message.success("编辑成功")
					}
				})
			} else {
				postMerchantCreate({ ...tempValue }).then((res) => {
					if (res) {
						props.history.goBack()
						message.success("新增成功")
					}
				})
			}
		}

		const dateFormat = 'YYYY/MM/DD';
		const [passArea, setPassArea] = useState({ area: [], address: '' });
		const handleValuesChange = useCallback((changeValue, allValues) => {
			if (changeValue.area || changeValue.address) {
				setPassArea({
					area: allValues.area,
					address: allValues.address,
				});
				setinitCity(true);
			}
		}, []);
		return (
			<PageHeaderWrapper title={id ? "编辑店铺" : "新增店铺"}>
				<div>
					<Form
						onFinish={onFinish}
						form={form}
						onValuesChange={handleValuesChange}
					>
						<Card title="基本信息">
							<Row style={{ height: 400 }}>
								<Col span="7">
									<Item/>
									<Item
										labelCol={{ span: 8 }}
										label="店铺名称"
										name="name"
										rules={[
											{
												required: true,
												message: '请输入店铺名称',

											},
											{
												max: 15,
												message: '最多可输入15个字符',

											}


										]}
									>
										<Input placeholder="请输入" />
									</Item>
									<Item
										labelCol={{ span: 8 }}
										label="店铺类型"
										name="merchantTypeId"
										rules={[
											{
												required: true,

												message: "请选择"
											},

										]}
									>
										<Select
										  disabled={!!id}
										>
											{
												typeList.map((item)=>{
													return (
														<Option value={item.id} key={item.id}>{item.name}</Option>
													)
												})
											}
										</Select>
									</Item>
									<Item
										label="省市区地址"
										name="area"
										labelCol={{ span: 8 }}
										rules={[
											{
												required: true,
												message: '请选择省市区地址！',
											},
										]}
									>
										<Cascader
											options={position}
											showSearch
											placeholder="请选择"
											style={{ width: '100%' }}
											value={currentArea}
											onChange={onChangeCascader}
											fieldNames={{ label: 'name', value: 'id', children: 'children' }}
										/>
									</Item>
									<Item
										labelCol={{ span: 8 }}
										label="详细地址"
										name="address"
										rules={[
											{
												required: true,
												message: '请输入详细地址！',

											},

										]}
									>
										<Input placeholder="请输入省市区地址后面的详细地址" />
									</Item>

								</Col>
								<Col span="15" offset="1">
									<Row>

										<Col span={8}>
											<Item
												label={
													<Tooltip title="请在选择「省市区」及「详细地址」之后，通过点击下方地图中的位置坐标来获取">
														<span>经度</span>&nbsp;
														<ExclamationCircleOutlined />
													</Tooltip>
												}
												name="lng"
												rules={[
													{
														required: true,
														message: '请输入经度坐标！',
													},
												]}
											>
												<Input placeholder="请输入" />
											</Item>
										</Col>
										<Col span={8} offset={2}>
											<Item
												label={
													<Tooltip title="请在选择「省市区」及「详细地址」之后，通过点击下方地图中的位置坐标来获取">
														<span>纬度</span>&nbsp;
									<ExclamationCircleOutlined />
													</Tooltip>
												}
												name="lat"
												rules={[
													{
														required: true,
														message: '请输入纬度坐标！',
													},
												]}
											>
												<Input placeholder="请输入" />
											</Item>
										</Col>
									</Row>
									<Map
										setFieldsValue={setFieldsValue}
										city={currentAreaStr || ''}
										position={position}
										setareaUpData={setareaUpData}
										initCity={initCity}
										// lnglatInit={row.lng ? [row.lng, row.lat] : null}
										data={passArea}
										row={row}
										height={300}
										id={id}
									/>
								</Col>
							</Row>
						</Card>
						<Card title="账户信息" >
							<Row >
								<Col span={7} >
									<Item
										label="店铺账号"
										name="username"
										labelCol={{ span: 8 }}
										rules={[
											{
												required:true,
												message:"请输入店铺账号"
											},
											{
												pattern: /^[0-9a-zA-z]{0,15}$/,
												message: '请输入正确的店铺账号！',
											},

										]}
									>
										<Input placeholder="请输入"/>
									</Item> 
								</Col>
								<Col span={7} offset={1} >
									<Item
										label="登录密码"
										name="userpwd"
										rules={[
											{
												required:!id,
												message: '请输入登录密码',
												whitespace: true,
											},
											{
												pattern: /^[0-9a-zA-z]{0,15}$/,
												message: '请输入正确的密码格式！',
											},
										]}
									>
										<Input.Password placeholder="请输入" />
									</Item> 
								</Col>
							</Row>
							<Row>
								<Col span="7">
									<Item
										name="vaild" label="店铺有效期"
										labelCol={{ span: 8 }}
									>

										<RangePicker
											format={dateFormat}
										/>
									</Item>
								</Col>
							</Row>
							<Row>
								<Col span={7} >
									<Item
										label="负责人"
										name="principal"
										labelCol={{ span: 8 }}
										rules={[
											{
												required: true,
												message: '请输入负责人',
												// whitespace: true,
											},
											{
												pattern: /^[\u4e00-\u9fa5]{0,15}$/,
												message: '请输入正确的负责人',
											},
										]}
									>
										<Input placeholder="请输入" />
									</Item>
								</Col>
								<Col span={7} offset={1}>
									<Item
										label="负责人联系方式"
										name="principalMobile"
										rules={[
											{
												required: true,
												message: '请输入负责人联系方式',

											},
											{
												pattern:/^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/,
												message:"请输入正确的联系方式"
											}

										]}
									>
										<Input placeholder="请输入" />
									</Item>
								</Col>
							</Row>
							<Row>
								<Col span={7} >
									<Item
										label="店铺状态"
										name="status"
										labelCol={{ span: 8 }}
										rules={[
											{
												required: true,
												message: "请选择"
											}
										]}
									>
										<Select>
											<Option value={1}>上线</Option>
											<Option value={0}>下线</Option>
										</Select>
									</Item>
								</Col>
								<Col span={7} offset={1}>
									<Item
										label="特约商户号"
										name="wxMchId"
										rules={[
											{

												message: '请输入特约商户号',
												whitespace: true,
											},

										]}
									>
										<Input placeholder="请输入" />
									</Item>
								</Col>
							</Row>
							<Row>
								<Col span={7} >
									<Item
										label="门店类型"
										name="isSeed"
										labelCol={{ span: 8 }}
										rules={[
											{
												required: true,
												message: "请选择门店类型"
											}
										]}
									>
										<Radio.Group>
											<Radio value={1} key="1">尚客车享</Radio>
											<Radio value={2} key="2">尚客权益</Radio>
											<Radio value={0} key="0">普通门店</Radio>
										</Radio.Group>
									</Item>
								</Col>
							</Row>
							<Row>
								<Col span={7} >
									<Item
										label="分账比例"
										labelCol={{ span: 8 }}
										// rules={[
										// 	{
										// 		required: true,
										// 		message: "请输入分账比例"
										// 	}
										// ]}
									>
										<Item
											noStyle
											name="disProportionPaySxf"
										>
											<InputNumber
										      min={0}
										      max={30}
										      step={1}
										      precision={0}
										      style={{marginRight: 5}}
										    />
									    </Item>
									    %
									    <p style={{color: '#999', fontSize: 14, marginTop: 5}}> 最大可设置比例为30% </p>
									</Item>
								</Col>
							</Row>
						</Card>
						<Card title="服务信息" >
							<Row>
								<Col span={7}>
								<Item
									labelCol={{ span: 12 }}
									label="服务标签选择"
									name="serviceTag"
								>
									<Select
										mode="multiple"
									>

										{serviceTag.map((item) => {
											return <Option key={item.id} value={String(item.id)}>{item.name}</Option>
										})}
									</Select>

								</Item>
							</Col>
							</Row>
						</Card>
						<Card title="特色标签" >
							<Row>
								<Col span={7}>
									<Item
										labelCol={{ span: 12 }}
										label="特色标签选择"
										name="specialTag"
									>
										<Select
											mode="multiple"
										>
											{specialTag.map((item) => {
												return <Option key={item.id} value={String(item.id)}>{item.name}</Option>
											})}
										</Select>
									</Item>
								</Col>
							</Row>
						</Card>
						<Card title="" >
							<Row>
								<Col span={7}>
									<Item
										label="商户头图"
										name="headPic"
										labelCol={{span:8}}
										rules={[
											{
												required: true,
												message: '请上传商户头图！',

											},
										]}
									>
										<div>
											<Upload
												beforeUpload={beforeUploadheadPic}
												name="file"
												showUploadList={false}
												customRequest={() => false}

											>
												{imgUrlOnly ? (
													<img
														src={imgUrlOnly}
														alt="avatar"
														style={{ width: '150px', height: '150px' }}
													/>
												) : (
														<div
															style={{
																width: '150px',
																height: '150px',
																border: '1px dashed rgba(0, 0, 0, 0.1)',
																textAlign: 'center',
																lineHeight: '150px',
																background:'rgb(250,250,250)'
															}}
														>
															<PlusOutlined style={{ fontSize: '36px' }} />
															{/* <div className="ant-upload-text">点击上传</div> */}
														</div>
													)}

											</Upload>
											<div style={{paddingTop:"20px"}}>144*144 像素  2M 图片大小以下</div>
										</div>
									</Item>

								</Col>
								<Col span={12} >
									<Item

										label="商户展示图"
										name="pic"
										rules={[
											{
												required: true,
												message: '请上传商户展示图！',

											},
										]}
									>
										<div>

											<Upload
												customRequest={() => false}
												name="file"
												listType="picture-card"
												showUploadList={{
													showPreviewIcon: false,
												}}
												beforeUpload={beforeUpload}
												fileList={currentimgUrl}
												onChange={({ file, fileList }) => {
													if (file.status === 'removed') {
														setImgUrl(fileList)
													}
												}}
											>
												{currentimgUrl.length >= 9 ? null : <PlusOutlined />}
											</Upload>
											750*340 像素  2M 图片大小以下·
										</div>
									</Item>
						
								</Col>
							</Row>
						</Card>
						<Card title="店铺详情">
							<Col>
								<Item
									name="openi"
									label="营业时间"
									rules={[
										{
											required: true,
											message: "请输入营业时间"
										}
									]}>
									<TimePicker.RangePicker format="HH:mm"/>
								</Item>
							</Col>
							<Row>
								<Col span={3}>
									<Item
										label="客服电话"
										name="prefix"
										rules={[
											{
												required: true,
												message: '请输入客服电话！',
											},
											{
												pattern: /^[0-9]{0,11}$/,
												message: "输入不合法"
											}
										]}
									>

										<Input disabled={prefixState} />
									</Item>
								</Col>
								<Col style={{lineHeight:"28px", margin: '0px 4px'}}>-</Col>
								<Col span={5}>
									<Item name="serviceTel"
										rules={[
											{
												required: true,
												message: '请输入客服电话！',
											},
											{
												pattern: /^[0-9]{0,11}$/,
												message: "输入不合法"
											}
										]}
									>
										<Input onChange={onChangePhone} />
									</Item>

								</Col>
							</Row>
							<Col span={10}>
								<Item
									label="商户介绍"
									name="intro"
									rules={[
										{
											max: 300,
											message: '最多输入300字！',
										}
									]}
								>
									<Input.TextArea />
								</Item>
							</Col>
						</Card>
						<WrapFormDiv>

							<Form.Item wrapperCol={{span:24}}>
								<Button htmlType="submit" type="primary" className="lButton">确定</Button>
								<Button onClick={()=>{
									props.history.goBack()
								}}>取消</Button>
							</Form.Item>
						</WrapFormDiv>
					</Form>
				</div>
			</PageHeaderWrapper>
		);
	}),
);


const WrapFormDiv=styled.div`
	padding-top: 24px;
	padding-bottom: 1px;
	background:white;
	.ant-form-item-control-input-content{
		display:flex;
		justify-content:center;
	}
	.lButton{
		margin-right:20px;
	}
`;
