import { connect } from 'dva';
import React, { memo,useState, useEffect ,useCallback,useMemo,useForm } from 'react';
import { useToggle } from 'react-use';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card,Form, Button,Select,Row,Col,Radio,Input,InputNumber,message,Upload,Table} from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined, MinusSquareOutlined, PlusOutlined} from '@ant-design/icons';
import { photoIsNoTwoMB,OssUrlPreFix } from '@/utils/utils';
// import ProtableSelect from '@/utils/merchantSelect';
import OSS from 'ali-oss';
import {doPostMerchantUp,doGetMSBIdDetail} from '@/services/washService';
import AddServer from './addServer.js'
const { Option } = Select;
const { Item } = Form;
export default connect(
	({global,washServer}) => ({
		position:global.cityList,
		serverList:washServer.serverList
	}),
	dispatch => ({
		//洗美服务详情
		async getMerchantServiceByIdNew  (payload) {
			return dispatch({
				type: 'washServer/getMerchantServiceByIdNew',
				payload,
			});
		},
		// 获取服务类型列表
		async getSingleByMerchantIdForSearch  (payload) {
			return dispatch({
				type: 'washServer/getSingleByMerchantIdForSearch',
				payload:{
					...payload,
					pageSize:999999,
				},
			});
		},
		// 计算价格
		async getPriceByNumAndPrice  (payload) {
			return dispatch({
				type: 'washServer/getPriceByNumAndPrice',
				payload,
			});
		},
		
		async getStsToken() { // 获取用于oss的token
			return dispatch({
				type: 'global/getStsToken'
			})
		},
		async getMerchantId(payload) {
			const params = { ...payload };
			return dispatch({
				type: 'merchant/getMerchantId',
				payload: {
					...params,
				},
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
		},

	}))
	
	(memo(props => {

		const { 
			getStsToken,
			ossToken,
			getSingleByMerchantIdForSearch,
			serverList,
			getPriceByNumAndPrice,
			getMerchantServiceByIdNew
		}=props;

		const [ooop,setOoop]=useState([])
		const [currentimgUrl, setImgUrl] = useState([]) // 展示图
		const [imgUrlOnly, setImgUrlOnly] = useState(''); // 头图
		const [currentimgUrlInfo, setImgUrlInfo] = useState([]) // 图文详情
		const [singleServiceList,setSingleServiceList] = useState([])

		// row是请求的数据
		const [row,setRow]=useState({})
		const [Cos,setCos]=useState(true)
		const {id}=props.location.query;
	
		const [ossTokencurrent, setossToken] = useState(ossToken);
		const [form]=Form.useForm();
		const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
		// 单项服务添加
		const [modalVisible, toggleModalVisible] = useToggle(false);
		const [serverData,setServerData] = useState({})
		const [writeroffType,setWriteroffType] = useState(0)

		const handleChange = (value, record) => {
			const currentId = record.id;
			singleServiceList.forEach((item,index)=>{
				if(currentId == item.id){
					item.countNum = value
				}
			})
			
			getPriceByNumAndPrice(singleServiceList).then(res=>{
				if(res.code == "0000"){
					const { oriPrice,price } = res.data
					setFieldsValue({
						oriPrice,
						price,
					})
				}
			})
		}
		useEffect(()=>{
			getPriceByNumAndPrice(singleServiceList).then(res=>{
				if(res.code == "0000"){
					const { oriPrice,price } = res.data
					setFieldsValue({
						oriPrice,
						price,
					})
					setFieldsValue({"singleServiceList":singleServiceList})
				}
			})
		},[singleServiceList])

		const columns = useMemo(() => [
			{ title: '服务名称',dataIndex: 'name', ellipsis: true},
			{ title: '服务类型',ellipsis: true,dataIndex: 'serviceCate2Name',hideInSearch: true,
				render:(_, row) => {
					const  serviceCate2Name = row.serviceCate2Name ? row.serviceCate2Name : " "
					const  serviceCateName = row.serviceCateName ? `-${row.serviceCateName}`: " "
					return serviceCate2Name+serviceCateName
				}
			},
			{ title: '原价',dataIndex: 'oriPrice',ellipsis: true,hideInSearch: true},
			{ title: '优惠价',dataIndex: 'price',hideInSearch: true},
			{ title: '添加服务时间',dataIndex: 'createTime',hideInSearch: true,width:200},
			{ title: '数量',dataIndex: 'countNum',hideInSearch: true,
			  render: (text, record) =>  
			  <InputNumber max={10000} min={1} defaultValue={text} precision={0} onBlur={(e) => handleChange( e.target.value, record)} />
			},
			{ title: '操作',dataIndex: 'id',valueType: 'options',hideInSearch: true,width: 200,
                render: (text,record) => {
					return (
                        <div style={{ display: 'flex', justfyContent: 'space-between' }}>
                            <a  key="delete" style={{ marginRight: '10px' }} 
                                    onClick={() => {
    									setSingleServiceList(singleServiceList.filter((item,index)=>item.id != record.id))
                                    }}
                                    >
                                删除
                            </a>
                           
                        </div>
                    );
				}
			}
		],[singleServiceList]);

		const getStsTokenFn = useCallback(async () => {

			const res = await getStsToken();
			if (res) {
				setossToken(res.data)
			}
		}, [ossTokencurrent])

		useEffect(() => {
			if(id){
				// 编辑
				fetchComment();
			}else{
				// x新增
				form.setFieldsValue({singleServiceList:[{name:"",price:0}]})
			}
			getStsTokenFn();
		}, []);
	
		// 编辑获取的数据
		async function fetchComment() {

			form.setFieldsValue({singleServiceList:[{name:"",price:0}]})
			getMerchantServiceByIdNew({id}).then((res)=>{
				if(res.code==="0000"){
					//是否组合(0-否,1-是)
					setCos(res.data.isCombo===0);
					setRow(res.data)
					setWriteroffType(res.data.writeroffType)//核销方式
					const {data}=res;
					if (data.headPic) {

						setImgUrlOnly(data.headPic)
					}
					// 展示图处理
					if (data.pic) {
						if (data.pic.split(",").length > currentimgUrl.length) {

							const urlTemp = [];
							data.pic.split(",").map((item, index) => {
								urlTemp.push({ url: item, uid: index })
								return item
							})
							setImgUrl(urlTemp);
						}
					}
					if (data.info) {
						if (data.info.split(",").length > currentimgUrlInfo.length) {

							const urlTemp = [];
							data.info.split(",").map((item, index) => {
								urlTemp.push({ url: item, uid: index })
								return item
							})
							setImgUrlInfo(urlTemp);
						}
					}
					let singleServiceList=[];
					if(data.isCombo===1){
						singleServiceList = data.singleServiceList;
						setSingleServiceList(singleServiceList)
					}
					form.setFieldsValue(
						{...(res.data),
							serviceCateId:res.data.serviceCateName,
							singleServiceList
						}
					)
				}
			})
		}
		const beforeSubmit = (Obj) => {

			const newTemp = {...Obj }
			newTemp.serviceCateId=row.serviceCateId;
			newTemp.isCombo=row.isCombo;
			newTemp.id=id;
			const  headPicTemp=Obj.headPic||row.headPic
			newTemp.headPic = headPicTemp.replace(OssUrlPreFix, "");
			if (Obj.pic||row.pic) {
				const temp=Obj.pic||row.pic;
				newTemp.pic = temp.replace(new RegExp(OssUrlPreFix, "g"), "");
			}
			if (Obj.info||row.info) {
				const tempx=Obj.info||row.info;
				newTemp.info = tempx.replace(new RegExp(OssUrlPreFix, "g"), "");
			}
			if(row.isCombo===1){
				getPriceByNumAndPrice(singleServiceList).then(res=>{
					if(res.code == "0000"){
						const { oriPrice,price } = res.data
						newTemp.oriPrice = oriPrice;
						newTemp.price = price;
					}
				})
				newTemp.singleListNew=singleServiceList;
				delete newTemp.singleServiceList;
			}
			return newTemp;
		}
		const onFinish=(value)=>{
			
			const res=beforeSubmit({...value,textId:row.textId});
			doPostMerchantUp(res).then(({...result})=>{
				if(result.code==="0000"){
					message.success("修改成功")
					props.history.goBack()
				}else{
					message.warn("修改失败")
				}
			})
			
		}

		const handlePriceList=()=>{
			// const price
			function getSum(total, num) {
				return total + num;
			}
			const priceListTemp=form.getFieldValue("singleServiceList");

			const priceTemp=priceListTemp.map(item=>item.label[2])
			const CountPrice=priceTemp.reduce(getSum);
			
			// 总价
			form.setFieldsValue({oriPrice:CountPrice});
		}

		const formItemLayout = {
			labelCol: { span: 6 },
			// wrapperCol: { span: 24 },
		};

		// eslint-disable-next-line consistent-return
		const getUrl = useCallback(async (file,type) => {
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
						const rl = await client.put(`/ptd/merchantThumb${Date.now()}`, file);
						if(rl){
							return rl.url.replace("http://sk-business.oss-cn-zhangjiakou.aliyuncs.com","http://sk-oss.shangkehy.com")
						}
					} else {
						const rl = await client.put(`/ptd/merchantImgShow${Date.now()}`, file);
						if (rl) {
							return rl.url.replace("http://sk-business.oss-cn-zhangjiakou.aliyuncs.com","http://sk-oss.shangkehy.com")
						}
					}
					// }
				}
				else {
					getStsToken().then(res => {
						if (res.msg === "ok") {
							getUrl(file,type)
						}
					})
				}
			}
		}, [ossTokencurrent, currentimgUrl,currentimgUrlInfo])
		// 上传之前
		const beforeUploadthumb = useCallback(
			async file => {
				// 上传文件之前的钩子
				if (photoIsNoTwoMB(file)) {
					const res = await getUrl(file, 'headPic');
					// return resData

					form.setFieldsValue({ headPic: res });
					setImgUrlOnly(res);
				}
			},
			[ossTokencurrent, imgUrlOnly, form.getFieldValue('headPic')],
		);

		const beforeUpload = useCallback(async file => {  // 上传文件之前的钩子
			if (photoIsNoTwoMB(file)) {		
				const res = await getUrl(file, 'pic')

				const lastcurrentimgUrl = await currentimgUrl.length > 0 ? currentimgUrl[currentimgUrl.length - 1] : {
					uid: '1',
				};
							
				const resData = await { uid: lastcurrentimgUrl.uid + 1, name: file.name, url: res };
				const newcurrentimgUrl = [resData, ...currentimgUrl]
							
				setImgUrl(newcurrentimgUrl);
						
				const onlyUrl = newcurrentimgUrl.map(item => (item.url))


				form.setFieldsValue({ pic: onlyUrl.join(",") })
			}
		}, [ossTokencurrent, currentimgUrl])
		const beforeUploadInfo = useCallback(async file => {  // 上传文件之前的钩子
			if (photoIsNoTwoMB(file)) {	
				const res = await getUrl(file, 'info')
			
				const lastcurrentimgUrl = await currentimgUrlInfo.length > 0 ? currentimgUrlInfo[currentimgUrlInfo.length - 1] : {
					uid: '1',
				};
							
				const resData = await { uid: lastcurrentimgUrl.uid + 1, name: file.name, url: res };
				const newcurrentimgUrl = [resData, ...currentimgUrlInfo]
							
				setImgUrlInfo(newcurrentimgUrl);
				const onlyUrl = newcurrentimgUrl.map(item => (item.url))

				form.setFieldsValue({ info: onlyUrl.join(",") })
			}
		}, [ossTokencurrent, currentimgUrlInfo])
	// protable start

	// protable end
	return (
			<PageHeaderWrapper title={id?"编辑店铺":"新增店铺"}>
				<div>
					<Form onFinish={onFinish} form={form} {...formItemLayout}
						initialValues={row}>
						<Card title="基本信息">
						<Row>
							<Col span={12}>
								<Item label="服务形式" name="isCombo" >
									<Radio.Group >
										<Radio.Button value={0} disabled={row.isCombo!==0} key="0">单项服务</Radio.Button>
										<Radio.Button value={1} disabled={row.isCombo===0} key="1">组合服务</Radio.Button>
									</Radio.Group>
								</Item>
							</Col>
						</Row>
						{
							Cos &&
							<Row>
								<Col span={12}>
									<Item
										label="服务类型"
										name="serviceCateId"
										
										rules={[
											{
												required: true,
												message: '请选择服务类型！',

											},
										]}
									>
									<Input  disabled/>
									</Item>
								</Col>
							</Row>
						}

						<Row>
							<Col span={12}>
								<Item
									label="服务名称"
									name="name"
									rules={[
										{
											required: true,
											message: '请输入服务内容！',
											whitespace: true,
										},
									]}
								>
									<Input placeholder="请输入" maxLength={20}/>
								</Item>
							</Col>
						</Row>
						{
							!Cos?
							<div>
								<Row>
									<Col span={12}>
										<Item
											label="核销方式"
											name="writeroffType"
											rules={[
												{
													required: true,
												},
											]}
										>
											<Select defaultValue={0} onChange={(val)=>{
												setWriteroffType(val)
											}}>
												<Option value={0} key="0">单次核销</Option>
												<Option value={1} key="1">多次核销</Option>
											</Select>
										</Item>
									</Col>
								</Row>
								{
									writeroffType == 1?
									<Row>
										<Col span={12}>
											<Item
												label="服务时效(天)"
												name="invalidDays"
												rules={[
													{
														required: true,
													},
												]}
											>
												<InputNumber max={30} min={1} style={{width:"100%"}}/>
											</Item>
										</Col>
									</Row>:null
								}
								
							</div>:null
						}
						
					</Card>
						<Card title="服务价格设置" >
							{
								Cos ?
									<div>
										<Row>
											<Col span={12}>
												<Item
													label="价格"
													name="oriPrice"
													rules={[
														{
															required: true,
															
														},
													]}
												>
													<InputNumber min={0} />
												</Item>
											</Col>
										</Row>
										<Row>
											<Col span={12}>
												<Item
													label="优惠价格"
													name="price"
													rules={[
														{
															required: true,
															
														},
													]}
												>
													<InputNumber  max={10000000}  min={0}
														onChange={value=>{
															const originalPriceTemp=form.getFieldValue('oriPrice');
															if(value>=originalPriceTemp){
																form.setFieldsValue({price:""})
																message.info(`优惠价需小于原价`);
															}else if(value===0){
																form.setFieldsValue({price:null})
															}
															else{
				
																form.setFieldsValue({price:value})
															}
														}}
													/>
												</Item>
											</Col>
										</Row>
										<Row>
											<Col span={12}>
												<Item
													label="次数"
													name="totalNum"
													rules={[
														{
															required: true,
														},
													]}
												>
													<InputNumber min={1}/>
												</Item>
											</Col>
										</Row>
									</div>:
									<div>
									<Row>
										<Col span={12}>
											<Item name="singleServiceList" label="服务内容" rules={[{
												required:true,
												message:"请选择服务"
											}]}>
											
											{/* <Select mode="multiple" labelInValue onChange={handlePriceList}>
												{ooop.map(
													(item)=>(
														<Option
															value={item.id}
															data-price={item.price}
															key={item.id}>
															{item.name}---价格:{item.price}
														</Option>
													)
												)}
											</Select> */}
										</Item>
										</Col>
									</Row>
									<Row>
										<Col  span={3}></Col>
										<Col span={21}>
											{
												singleServiceList.length>0?
												<Table
													dataSource={ singleServiceList }
													columns={columns}
													key="id"
													rowKey="id"
													scroll={{ x: 'max-content' }}
													pagination={false}
												/>:null
											}
											
										</Col>
									</Row>
									<Row>
										<Col  span={3}></Col>
										<Col span={20}>
											<Button style={{margin:"10px"}} onClick={()=>{
												toggleModalVisible(true)
											}}><PlusOutlined/>添加服务内容</Button>
										</Col>
									</Row>
									<Row>
										<Col span={12}>
											<Item
												label="组合总价"
												name="oriPrice"
												rules={[
													{
														required: true,
													},
												]}
											>
												<InputNumber max={10000000}  min={0} style={{width:"100%"}}/>
											</Item>
										</Col>
									</Row>
								<Row>
									<Col span={12}>
										<Item
											label="组合优惠价格"
											name="price"
											rules={[
												{
													required: true,
												},
											]}
										>
											<InputNumber max={10000000}  min={0} style={{width:"100%"}}
												onChange={value=>{
													const originalPriceTemp=form.getFieldValue('oriPrice');
													if(value>=originalPriceTemp){
														form.setFieldsValue({price:""})
														message.info(`优惠价不能大于等于总价`);
													}else if(value===0){
														form.setFieldsValue({price:null})
													}
													else{
														form.setFieldsValue({price:value})
													}
												}}
											/>
										</Item>
									</Col>
								</Row>
							</div>
							}
								
						</Card>
						<Card title="服务须知" >
							<Row>   
									<Col span={12}>
										<Item
											label="适用车型"
											name="carModelId"
											rules={[
												{
													required: true,
													message: '请填写适用车型！',

												},
											]}
										>
											<Select>
												<Option value={0}>全部车型</Option>
												<Option value={1}>轿车</Option>
												<Option value={2}>SUV</Option>
											</Select>
										</Item>
									</Col>
							</Row>
							<Row>
								<Col span={12}>
										<Item
											label="服务提示"
											name="intro"
											// rules={[
											// 	{
											// 		required: true,
											// 	},
											// ]}
										>
											<Input.TextArea rows={4} />
										</Item>
								</Col>
							</Row>
						</Card>
						<Card title="服务展示图" >
						<Row>
							<Col span={12}>
								<Item
									label="商户头图"
									name="headPic"
									// rules={[{
									// 	required:true
									// }]}
								>
									<div>
										<Upload
											beforeUpload={beforeUploadthumb}
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
									</div>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col span={12}>
								<Item
									label="服务展示图"
									name="pic"
									rules={[
										{
											required: true,
											message: '请上传服务展示图',

										},
									]}
								>
									<div>
										<Upload
											beforeUpload={beforeUpload}
											customRequest={()=>false}
											name="file"
											listType="picture-card"
											showUploadList={{
												showPreviewIcon:false,
											}}
											
											fileList={currentimgUrl}
											onChange={({file,fileList}) => {
												if(file.status==='removed'){
													const onlyUrl = fileList.map(item => (item.url))


													form.setFieldsValue({ pic: onlyUrl.join(",") })
													setImgUrl(fileList)
												}
											}}
										>
											{currentimgUrl.length >= 5 ? null : <PlusOutlined />}
										</Upload>
									</div>
								</Item>
							</Col>
						</Row>
						<Row>
							<Col span={6} style={{textAlign:"center"}}>
								建议上传800*240像素小于2M格式为JPG、PNG的图片
							</Col>
						</Row>
						<Row style={{paddingTop:"30px"}}>
							<Col span={12}>
								<Item
									label="服务详情"
									name="info"
									rules={[
										{
											required: true,
										},
									]}
								>
									<div>

										<Upload
											beforeUpload={beforeUploadInfo}
											customRequest={()=>false}
											name="file"
											listType="picture-card"
											showUploadList={{
												showPreviewIcon:false,
											}}
											
											fileList={currentimgUrlInfo}
											onChange={({file,fileList}) => {
												if(file.status==='removed'){
													const onlyUrl = fileList.map(item => (item.url))


													form.setFieldsValue({ info: onlyUrl.join(",") })
													setImgUrlInfo(fileList)
												}
											}}
										>
											{currentimgUrlInfo.length >= 99 ? null : <PlusOutlined />}
										</Upload>
									</div>
									{/* 
									<RichEditorSk setFieldsValue={form.setFieldsValue}  
									ossTokencurrent={ossTokencurrent}  
									infoData={currentInfo}
									form={form}
									/> */}
								</Item>
							</Col>
						</Row>
					</Card>
						<Card title="首页服务项目位置及状态设置" >
							<Row>
								<Col span={12}>
											<Item
												label="状态"
												name="status"
												rules={[
													{
														required: true,
													},
												]}
											>
												<Select>
													<Option value={1}>上架</Option>
													<Option value={0}>下架</Option>
													
												</Select>
											</Item>
								</Col>
							</Row>
					
				
						</Card>
						<WrapFormDiv>
							<Form.Item wrapperCol={{span:24}}>
								<Button htmlType="submit" type="primary" className="lButton">提交</Button>
								<Button onClick={()=>props.history.goBack()}>取消</Button>
							</Form.Item>
						</WrapFormDiv>
					</Form>
				</div>
				<AddServer
					setServerData = { setServerData }
					setSingleServiceList = { setSingleServiceList }
					setFieldsValue = { setFieldsValue }
					validateFields = { validateFields }
					modalVisible = { modalVisible }
					serverList = { serverList }
					singleServiceList = { singleServiceList }
					onCancle = { ()=>toggleModalVisible(false) }
					onSearch = { (payload)=>getSingleByMerchantIdForSearch(payload) }
				>
				</AddServer>
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

