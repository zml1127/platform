import { connect } from 'dva';
import React, { memo, useEffect,useState,useRef,useMemo  } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Select,
	Form,
	Input,
	Upload,
	Button,
	message,
	DatePicker,
	Cascader,
	Switch,
	Tabs,
	Col,
	Row,
	TimePicker,
	InputNumber,
	Modal 
} from 'antd';
const { TabPane } = Tabs;
const { useForm } = Form;
const { RangePicker } = DatePicker
const RangeTimePicker  = TimePicker.RangePicker;
import { history } from 'umi';
import {  photoIsNoTwoMB} from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import style from './edit.less';
import OSS from 'ali-oss';
import moment from 'moment';
import RichEditorSk from '@/utils/RichEditorSk';
const { Option } = Select

const userInfoDetail = memo(props => {
	const {
		getStsToken,
		location,
		ossToken,
		cityList,
		getExtendcouponCreate,
		getExtendcouponGetById,
		getExtendcouponUpdate,
		getExtendcouponTypeList,
		getetProductDetail,
		getMerchantList
	} = props;
	
	const {id,type,from} = location.query
	const [bannerType, setBannerType] = useState(location.query.bannerType?Number(location.query.bannerType):1)
	const exCouponId = localStorage.getItem("exCouponId")
	const [selectedRowKeys,setSelectedRowKeys] = useState([])
	const [addCodeVisible, setAddCodeVisible]  =  useState(false)
	const [form] = useForm();
	const actionRef = useRef();
	const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
	// 图片相关
	const [headPic, setHeadPic] = useState("")
	const [info,setInfo] = useState("")
	const [fileList, setFileList] = useState([])
	const baseUrl = "http://sk-business.oss-cn-zhangjiakou.aliyuncs.com"

	const [typeMap,setTypeMap] = useState([])
	const [subDisabled,setSubDisabled] = useState(false)
	const [list,setList] = useState({})
	const [merchantList,setMerchantList] = useState([])
	const tabArr =[{ key:1,value:"联联周边游"},{key:2,value:"平台"},{key:3,value:"侠侣亲子游"}]

	useEffect(()=>{
		// 编辑
		if(type=="seeE"){
			getExtendcouponGetById({id,type:bannerType}).then(res=>{
				if(res.code == "0000"){
					let data = res.data
					let {provinceId,cityId,districtId,buyStartTime,buyEndTime,useStartTime,useEndTime,showAddress} = data
					setHeadPic(`${data.headPic}`)
					setList(data)
					setFileList(data.pic.split(",").map( (item,index)=>{return {uid:Number(index)+1,url:item} }))
					setFieldsValue(data)
					setFieldsValue({
						type:data.typeId,
						area:[provinceId,cityId,districtId],
						buyDate:[buyStartTime?momentDate(buyStartTime,"date"):"",buyEndTime?momentDate(buyEndTime,"date"):null],
						useDate:[momentDate(useStartTime,"date"),momentDate(useEndTime,"date")],
					})
				}
				
			})
		}
		// 新增
		if(type=="add"||from=="add"){
			setFieldsValue({statusForPlatForm:false})
		}
		//新增编辑
		if(from=="add"){
			getetProductDetail({id:id,type:bannerType,}).then(res=>{
				if(res.code == "0000"){
					let data = res.data
					if(data){
						let {provinceId,cityId,districtId,buyStartTime,buyEndTime,useStartTime,useEndTime} = data
						setHeadPic(`${data.headPic}`)
						setList(data)
						setFileList(data.pic.split(",").map( (item,index)=>{return {uid:Number(index)+1,url:item} }))
						setFieldsValue(data)
						setFieldsValue({
							// buyDate:[buyStartTime?momentDate(buyStartTime,"date"):"",buyEndTime?momentDate(buyEndTime,"date"):""],
							useDate:[useStartTime?momentDate(useStartTime,"date"):"",useEndTime?momentDate(useEndTime,"date"):""],
						})
					}
				}
				
			})
		}
		
		getStsToken()
		getExtendcouponTypeList().then(res=>{
			if(res.code === "0000"){
				setTypeMap(res.data)
			}
		})
		// 商户列表
		getMerchantList({current:1,pageSize:99999}).then(res=>{
			// if(res.code == "0000"){
				setMerchantList(res.data)
			// }
		})
	},[])
	// 格式化日期转化为字符串
	const formatDate = ((value,type)=>{
		return moment(value).format(type == "date"?'YYYY-MM-DD':"hh:mm:ss")
	})
	// 字符串转化为日期格式
	const momentDate = ((value,type)=>{
		return moment(value,type == "date"?'YYYY-MM-DD':"hh:mm:ss")
	})
	const getUrl = (file, type) => {
		if (ossToken.expiration > Date.now()) {
			// 没有过期
			const client = new OSS({
				region: ossToken.region,
				accessKeyId: ossToken.accesKeyId,
				accessKeySecret: ossToken.accesKeySecret,
				stsToken: ossToken.securityToken,
				bucket: ossToken.bucket,
			});
			client.put(`/around${Date.now()}`, file)
				.then(function(rl) {
					const ImgUrl = rl.url
					if(type=="header"){
						setHeadPic(ImgUrl);
						setFieldsValue({headPic:ImgUrl})
					}else{
						if (photoIsNoTwoMB(file)) {
							const lastcurrentimgUrl =  fileList.length > 0 ? fileList[fileList.length - 1] : {
								uid: 0,
							};
							const resData = {uid: Number(lastcurrentimgUrl.uid) + 1,name:file.name,url:ImgUrl};
							const newFileList = [...fileList,resData]
							setFileList([...fileList,resData])
							const pic = newFileList.map(item => item.url)
							setFieldsValue({ pic: pic.join(",") })
						}
					}
				}).catch(err => {});
		} else {
			getStsToken().then(res => {
				if (res.code === '0000') {
					getUrl(file, type);
				}
			});
		}
	}
	const beforeUpload = (file, type) => {
			if (!['image/png','image/jpeg'].includes(file.type)) {
				message.error("请选择JPEG、JPG、PNG格式图片");
			}else{
				getUrl(file, type);
			}
		}
	const handleFinish =((value)=>{
		setSubDisabled(true)
		const { area,buyDate,headPic,useDate,thirdMerchantName  } = value
		let provinceId = area&&area[0]?area[0]:null
		let cityId = area&&area[1]?area[1]:null
		let districtId =area&&area[2]?area[2]:null
		let buyStartTime = buyDate[0]?formatDate(buyDate[0],"date")+" 00:00:00":""
		let buyEndTime = buyDate[1]?formatDate(buyDate[1],"date")+" 23:59:59":""
		let useStartTime = useDate[0]?formatDate(useDate[0],"date")+" 00:00:00":""
		let useEndTime = useDate[1]?formatDate(useDate[1],"date")+" 23:59:59":""
		let params={
			...value,
			source:bannerType,
			// headPic:`/around${headPic.split('/around')[1]}`,
			// pic:fileList.map(item=>`/around${item.url.split("/around")[1]}`).join(","),
			pic:fileList.map(item=>item.url).join(","),
			thirdMerchantName:thirdMerchantName.indexOf(',') != -1?thirdMerchantName.split(',')[0]:thirdMerchantName,
			ownerMerchantId:thirdMerchantName.indexOf(',') != -1?thirdMerchantName.split(',')[1]:"",
			provinceId,
			cityId,
			districtId,
			buyStartTime,
			buyEndTime,
			useStartTime,
			useEndTime,
			infoId:list.infoId,
			productId:list.productId,
		}
		delete params.area
		delete params.buyDate
		delete params.useDate
		if(type=="add" || from=="add"){
			delete params.id
			getExtendcouponCreate(params).then(res=>{
				setTimeout(()=>setSubDisabled(false),1000)
				if(res.code == "0000"){
					message.success('创建成功')
					history.push({
						pathname: '/market/around',
					})
				}
			})
		}
		if(type=="seeE"){
			getExtendcouponUpdate({
				id,
				...params
			}).then(res=>{
				setTimeout(()=>setSubDisabled(false),1000)
				if(res.code == "0000"){
					message.success('更新成功')
					history.go(-1)
				}
			})
		}
	})
	// const handleReset = ()=>{
	// 	resetFields()
	// 	setHeadPic("")
	// }
	
	return (
			<PageHeaderWrapper title={`${type=='add'?"新增":"查看详情"}`} >
				<div className={style.base_info}>
					<Tabs defaultActiveKey={String(bannerType)} size="large" style={{width:"100%"}} className={style.tab_style} onChange={val=>{
						setBannerType(val)
						
					}}>
						{
							tabArr.map((item)=>{
								return (<TabPane tab={item.value} key={item.key}  disabled={ bannerType != item.value && (type && type!="add") }></TabPane>)
							})
						}
					</Tabs>
					<div style={{float:"right"}}>{
						type=="add" || !type? <Button type="primary" onClick={()=>props.history.push(`/market/around/edit/add?type=${bannerType}`)}>调取券数据</Button>:null
					}
					</div>
					<Form name="basic" className={style.form_con} labelCol={ {span:7} }
						onFinish={handleFinish}
						form={form}
						>
						<Form.Item label="添加头图" name="headPic" className={style.bannerPic}
						rules={[{ required: true, message: '请选择图片' }]}
						>
							<Upload beforeUpload={file => beforeUpload(file, 'header')} name="file" showUploadList={false} listType="picture-card">
								<div style={{ width: 100, height: 100}} className={style.img_con}>
									<PlusOutlined className={style.plus} />
									{headPic ? <img src={headPic} style={{ width: 100, height: 100,}} /> : null}
								</div>
							</Upload>
							<div style={{color:"red",fontSize:"12px"}}>注：请选择JPEG、JPG、PNG格式图片</div>
						</Form.Item>
						
						<Form.Item label="添加轮播图：" name="pic" rules={[{ required: true, message: '请选择图片' }]}>
							<Upload customRequest={() => false} name="file" listType="picture-card"
									showUploadList={{showPreviewIcon: false,}}
									beforeUpload={file => beforeUpload(file, 'banner')}
									fileList={fileList}
									onChange={({ file, fileList }) => {
											if (file.status === 'removed') {
												setFileList(fileList)
											}
									}}>
										{
											fileList.length <= 9 ? 
												<div style={{ width: 100, height: 100}} className={style.img_con}>
															<PlusOutlined />
												</div>:null
										}
							</Upload>
							<div style={{color:"red",fontSize:"12px"}}>注：请选择JPEG、JPG、PNG格式图片</div>
						</Form.Item>
							
						<Form.Item label="券名称" name="name"
							rules={[
								{ required: true, message: '请输入券名称',},
								{ max: 200, message: '最大可输入200个字',}
							]}
						>
							<Input/>
						</Form.Item>
						<Form.Item label="券类型" name="type"
							rules={[{required: true, message: '请选择券类型',}
							]}
						  >
							<Select>{
								typeMap.map((item)=>{
									return <Option value={item.idStr} key={item.id}>{item.name}</Option>
								})
							}
							</Select>
						</Form.Item>
						<Row>
							<Col span={23}>
								<Form.Item label="原价" name="thirdPrice" rules={[
									{required: true, message: '请输入原价'},
									{ 
										pattern: /^([1-9]\d{0,8}(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
										message: '仅允许输入数字，小数点前最多九位，小数点后最多两位小数',
									},
									]}>
									<Input placeholder="请输入原价" style={{  }} />
								</Form.Item>
							</Col>
							<Col><div style={{textAlign:"right",width:"20px",lineHeight:"30px",height:"30px"}}>元</div></Col>
						</Row>
						<Row>
							<Col span={23}>
								<Form.Item label="优惠价" name="price" rules={[
									{required: true, message: '请输入优惠价'},
									{ 
										pattern: /^([1-9]\d{0,8}(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
										message: '仅允许输入数字，小数点前最多九位，小数点后最多两位小数',
									},
									]}>
									<Input placeholder="请输入优惠价" style={{  }} />
								</Form.Item>
							</Col>
							<Col><div style={{textAlign:"right",width:"20px",lineHeight:"30px",height:"30px"}}>元</div></Col>
						</Row>	
						<Row>
							<Col span={23}>
								<Form.Item label={bannerType==1?"返佣价":"进货价"} name={bannerType==1?"commissionAmount":"sourcePrice"} rules={[
									{required: true, message: bannerType==1?"返佣价":"进货价"},
									{ 
										pattern: /^([0-9]\d{0,8}(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,
										message: '仅允许输入数字，小数点前最多九位，小数点后最多两位小数',
									},
									]}>
									<Input placeholder={`请输入${bannerType==1?"返佣价":"进货价"}`} />
								</Form.Item>
							</Col>
							<Col><div style={{textAlign:"right",width:"20px",lineHeight:"30px",height:"30px"}}>元</div></Col>
						</Row>
						{
							bannerType !=1?
							<Row>
								<Col span={23}>
									<Form.Item label="团长团员返佣比例：" name="commissionRate" rules={[
										{required: true, message: "请输入返佣比例"},
										]}>
										<InputNumber  max={30} min={1} style={{width:"100%"}}/>
									</Form.Item>
								</Col>
								<Col><div style={{textAlign:"right",width:"20px",lineHeight:"30px",height:"30px"}}>%</div></Col>
							</Row>:null
						}
						
						<Form.Item label="购买日期" name="buyDate" rules={[
								{
									required: true,
									message: '请选择购买日期',
								}
							]}>
								<RangePicker style={{width:"100%",textAlign:"center"}}/>
						</Form.Item>
						<Form.Item label="使用日期" name="useDate" rules={[
								{
									required: true,
									message: '请选择使用日期',
								}
							]}>
								<RangePicker style={{width:"100%",textAlign:"center"}}/>
						</Form.Item>
						{
							
								<Form.Item label="所属商户" name="thirdMerchantName"
									rules={[
										{ required: true, message: '请输入商户名称'},
										{ max: 200, message: '最大可输入200个字',}
									]}
								>
									{
										bannerType == 2 ?
										<Select showSearch filterOption={(input, option) =>
											option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
										  }>{
											merchantList?
												merchantList.map((item)=>{
													return <Option value={`${item.name},${item.id}`} key={ item.id }>{ item.name+'('+item.id+')' }</Option>
												}):null
										}
										</Select>:
										<Input/>
									}
									
								</Form.Item>
								
						}
						<Form.Item label="商家地址" name="address" rules={[
							{
								required: true,
								message: ' ',
							}]}>
							<Form.Item style={{ display: 'inline-block', width: '100%' }} name="area" rules={[{ required: true, message: '请选择地址',}]}>
									<Cascader options={cityList} showSearch allowClear style={{ width: '100%' }} placeholder="请选择省-市-区"
										fieldNames={{ label: 'name', value: 'id', children:'children'}
									}/>
							</Form.Item>
							<Form.Item style={{ display: 'inline-block', width: '100%' }} name="address" rules={[
								{ required: true, message: '请输入地址'},
								{ max: 300, message: '最大可输入300个字'}
								]}>
								<Input placeholder="请输入详细地址"/>
							</Form.Item>
						</Form.Item>
						<Form.Item label="商家电话" name="thirdMerchantPhone"
							rules={[
								{ required: true, message: '请输入商户电话'},
								// { pattern: /^[0-9]{0,11}$/,message: "输入不合法"}
							]}
						>
							<Input/>
						</Form.Item>
						<Form.Item label="营业时间"  name="openStartTime" rules={
							[
								{ required: true, message: '请输入营业时间'}
							]}>
								<Input/>
							{/* <Form.Item
								name="openStartTime"
								rules={
									[
										{ required: true, message: '请输入开始时间'}
									]}
								style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
							>
								<Input/>
							</Form.Item>
							<span style={{ display: 'inline-block', width: '24px', lineHeight: '32px', textAlign: 'center' }}>
								-
							</span>
							<Form.Item name="openEndTime" style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
								<Input/>
							</Form.Item> */}
						</Form.Item>
						<Form.Item  name="totalNum" label="库存" rules={
							[
								{ required: true, message: '请输入库存'},
								{
									pattern: /^[0-9]{0,9}$/,
									message: "输入格式错误，最多输入9位"
								}
							]}>
								<Input/>
						</Form.Item>
						<Form.Item name="statusForPlatForm" label="状态" valuePropName="checked">
								<Switch />
						</Form.Item>
						<Form.Item  name="info" label="服务详情" rules={[{ required: true, message: '请输入服务详情'}]}>
							<RichEditorSk
								setFieldsValue={setFieldsValue}
								infoData={list.info}
								ossTokencurrent={ossToken}  
							/> 
						</Form.Item>
						{
							from && <Form.Item  label="富文本访问地址">
								<a href={list.infoUrl} target="_blank" >{list.infoUrl}</a>
							</Form.Item>
						}
						<Form.Item>
							<div style={{textAlign:'center'}}>
								<Button type="primary" htmlType="submit" className={style.submit} disabled={subDisabled}>提交</Button>
								<Button onClick={()=>{props.history.goBack()}}>返回</Button>
								{/* <Button onClick={ handleReset } >重置</Button> */}
							</div>
						</Form.Item>
					</Form>
					
				</div>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({  global,operation }) => ({
		cityList: global.cityListBasic, // 省市区数据
		ossToken: global.ossToken,
		selectMaterial:operation.selectMaterial
	}),
	dispatch => ({

		async getExtendcouponGetById(payload) {
			return dispatch({
				type: 'around/getExtendcouponGetById',
				payload,
			});
		},
		// 连连周边券详情
		async getetProductDetail(payload) {
			return dispatch({
				type: 'around/getetProductDetail',
				payload,
			});
		},

		async getExtendcouponUpdate(payload) {
			return dispatch({
				type: 'around/getExtendcouponUpdate',
				payload,
			});
		},
		async getExtendcouponCreate(payload) {
			return dispatch({
				type: 'around/getExtendcouponCreate',
				payload,
			});
		},
		
		async getStsToken (){
			return dispatch({
				type: 'global/getStsToken',
			});
		},
		
		async getExtendcouponTypeList  (payload) {
			return dispatch({
				type: 'couponMaintain/getExtendcouponTypeList',
				payload,
			});
		},
		async getMerchantList(payload) {
            const params = { ...payload };
            return dispatch({
                type: 'merchant/getMerchantList',
                payload: {
                    ...params,
                },
            });
        }
	}),
)(userInfoDetail);
