import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Select,
	Popconfirm,
	Typography,
	message,
	Row,
	Col,
	Modal,
	Upload, 
	Input,
	Form,
	Tooltip
} from 'antd';
import { history } from 'umi';
import OSS from 'ali-oss';
import ProTable from '@ant-design/pro-table';
import style from './style.less';
const { Text } = Typography;
const { Item, useForm } = Form;

const UserInfo = memo(props => {
	const {
		getStsToken,
		getExtEndcouponorderList,
		getExtendcouponGetById,
		ossToken,
		location,
		getExtendcouponorderRefund,
		getExtendcouponorderCancelOrder,
		getExtendcouponorderAddCheckCode
	} = props;

	const [imgUrl, setImgUrl] = useState("")
	const [form] = useForm();
	const { submit } = form;
	const baseUrl = "http://sk-business.oss-cn-zhangjiakou.aliyuncs.com"
	const [addCodeVisible,setAddCodeVisible] = useState(false)
	const [seeCodeVisible,setSeeCodeVisible] = useState(false)
	const [currentRow,setCurrentRow] = useState({})
	const [detailData,setDetailData] = useState([])
	const { setFieldsValue } = form;
	const { id } = location.query
	const sourceObj ={ 1:"联联周边游",2:"平台",3:"侠侣" }
    const payTypeObj = { 1:"微信支付",2:"储蓄卡支付",3:"微信-储蓄卡混合支付", 4:"会员卡支付"}
    useEffect(()=>{
		getExtendcouponGetById({id}).then(res=>{
			if(res.code == "0000"){
				setDetailData(res.data)
			}
		})
		getStsToken()
	},[])
	const actionRef = useRef();

	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { showAddress } = search;
		let params = {
			...search,
		}
		return params;
	};
	const showAddcodeModel = (row)=>{
		const {checkQrcode,checkQrcodeNo} = row
		setCurrentRow(row)
		setAddCodeVisible(true)
		setImgUrl(row.checkQrcode)
		setFieldsValue({
			checkQrcode:checkQrcode?checkQrcode.split('/serverCoupon')[1]:"",
			checkQrcodeNo,
		})
	}
	const showSeecodeModel = (row)=>{
		const {checkQrcode,checkQrcodeNo} = row
		console.log("1",row)
		setCurrentRow(row)
		setImgUrl(row.checkQrcode)
		setFieldsValue({
			checkQrcode:checkQrcode?checkQrcode.split('/serverCoupon')[1]:"",
			checkQrcodeNo,
		})
		setSeeCodeVisible(true)
	}
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
					client.put(`/serverCoupon${Date.now()}`, file)
						.then(function(rl) {
							setImgUrl(rl.url);
							setFieldsValue({imgUrl:`/serverCoupon${rl.url.split('/serverCoupon')[1]}`})
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
	const handleFinish =(values)=>{
		const { imgUrl,checkQrcodeNo } = values
		getExtendcouponorderAddCheckCode({
			id:currentRow.id,
			checkQrcode:imgUrl,
			checkQrcodeNo,
		}).then(res=>{
			if(res.code == "0000"){
				setAddCodeVisible(false)
				message.success("添加成功")
				actionRef.current.reload()
			}
		})
	}

	const columns = useMemo(
		() => [
				{
					title: '订单编号',
					dataIndex: 'orderNum',
				},
				{
					title: '姓名',
					dataIndex: 'userName',
					key:"userName",
				},
				{
					title: '手机号',
					dataIndex: 'mobile',
					key:"mobile",
				},
				{
					title: '下单时间',
					dataIndex: 'createTime',
					hideInSearch: true,
				},
				{
					title: '支付金额',
					dataIndex: 'price',
					hideInSearch: true
				},
				{
					title: '分佣金额',
					dataIndex: 'commissionAmount',
					hideInSearch: true
				},
				{
					title: '支付方式',
					dataIndex: 'payType',
					hideInSearch: true,
					renderText:(value,row)=>payTypeObj[value]
				},
				{
					title: '订单状态',
					dataIndex: 'orderStatusStr',
					hideInSearch: true
				},
				{
					title: '是否添加核销码',
					dataIndex: 'isAddCheckQrcode',
					// renderText:(_, row) => row.isAddCheckQrcode == 1 ? "是":"否",
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue="" onChange={onChange}>
								<Select.Option value="">全部</Select.Option>
								<Select.Option value={1}>是</Select.Option>
								<Select.Option value={0}>否</Select.Option>
							</Select>
						);
					}
				},
				{
					title: '操作',
					key: 'option',
					valueType: 'option',
					fixed:"right",
					render: (_,row) => [
						[2,3].includes(row.orderStatus) ?
							<a key="delete" onClick={() => {
								Modal.confirm({
									title: '提示',
									icon: <ExclamationCircleOutlined />,
									content: `确定要退款吗`,
									okText: '确认',
									cancelText: '取消',
									onOk:()=>{
										getExtendcouponorderRefund({orderId:row.id}).then(res=>{
											if(res.code == "0000"){
												actionRef.current.reload()
											}
										})
									} 
								});
							}}>
								<Text type="danger">退款</Text>
							</a>:null,
						[2,3].includes(row.orderStatus) && detailData.source == 1 ?
							<a key="add" onClick={ ()=>{ showAddcodeModel(row)} }>{ row.isAddCheckQrcode =="是" ? "编辑":"添加"}核销码</a>:null,
						(row.orderStatus == 3 && row.isAddCheckQrcode == "是") ?
							<a key="see" onClick={ ()=>{ showSeecodeModel(row)} }>查看核销码</a>:null,
						row.orderStatus == 1 && detailData.source == 1 ? 
							<a onClick={() => {
									Modal.confirm({
										title: '提示',
										icon: <ExclamationCircleOutlined />,
										content: `确定要取消订单吗`,
										okText: '确认',
										cancelText: '取消',
										onOk:()=>{
											getExtendcouponorderCancelOrder({id:row.id}).then(res=>{
												if(res.code == "0000"){
													actionRef.current.reload()
												}
											})
										} 
									});
								}}>取消订单</a>:null
						
				   ]
				},
		],[detailData]
	);
		return (
			<PageHeaderWrapper>
				<Row style={{backgroundColor:"#fff",padding:"20px 20px 0px 20px"}}>
					<Col span={3}>
						<img src={detailData.headPic} className={style.box} style={{width:"120px",height:"120px"}}/>
					</Col>
					<Col className={style.box} span={18}>
						<Row>
							<Col className={style.line} span={6}>三方名称：{sourceObj[detailData.source]}</Col>
							<Col className={style.line} span={6}>券库存：{detailData.totalNum}</Col>
							<Col className={style.line} span={6}>所属商户：{detailData.thirdMerchantName}</Col>
							<Col className={style.line} span={6}>状态：{detailData.status == 0?"禁用":"开启"}</Col>
						</Row>
						<Row>
							<Col  className={style.line} span={6} style={{display:"flex"}}>
								券名称：
								<Tooltip placement="topLeft" title={detailData.name}>
									<span className={style.overStyle}>{detailData.name}</span>
								</Tooltip>
							</Col>
							<Col  className={style.line} span={6}>已购买：{detailData.receiveNum}</Col>
							<Col  className={style.line} span={7}>购买日期：{ `${detailData.buyStartTime?detailData.buyStartTime.split(' ')[0]:""} ~ ${detailData.buyEndTime?detailData.buyEndTime.split(' ')[0]:""}`}</Col>
							
						</Row>
						<Row>
							<Col  className={style.line} span={6}>券类型： {detailData.typeStr}</Col>
							<Col  className={style.line} span={12}  style={{display:"flex"}}>
								<span>所在区域：</span>
								<div>
									<div style={{height:"20px"}}>{detailData.showAddress}</div>
									<div style={{height:"20px"}}>{detailData.address}</div>
								</div>
							
							</Col>
							
						</Row>
					</Col>
					<Col span={3} className={style.box}>
						<div className={style.right}>
							<div className={`${style.right_line} ${style.red_num}`}>{detailData.waitAddCheckCodeNums}</div>
							<div className={style.right_line}>未添加核销数</div>
						</div>
					</Col>
				</Row>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					request={(paload)=>getExtEndcouponorderList(paload,id)}
					columns={columns}
					search={{
						collapsed: false,
						optionRender: ({ searchText, resetText }, { form }) => (
							<>
								<Button type="primary"
									onClick={() => {
										form.submit();
									}}
									htmlType="submit"
								>
									{searchText}
								</Button>{' '}
								<Button
									onClick={() => {
										form.resetFields();
										form.submit();
									}}
								>
									{resetText}
								</Button>{''}
							</>
						),
					}}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
				/>
				<Modal width={800} destroyOnClose={true} title="核销码" visible={addCodeVisible} width="30%" onOk={submit}
					onCancel={()=>{ setAddCodeVisible(false) }} maskClosable={false}>
					<div className={style.modelCon}>
						<Form name="basic" className={style.form_con} onFinish={handleFinish} form={form}>	
							<Form.Item name="imgUrl">
								<Upload beforeUpload={file => beforeUpload(file, 'banner')} name="file" showUploadList={false} listType="picture-card" style={{width:"auto"}}>		
									<div style={{ border: 'dashed 2px #eee', width: 100, height: 100}} className={style.img_con}>
										<div className={style.upStyle}>
											<PlusOutlined  className={style.plus}/>
											<div className={style.up_font}>添加核销码</div>
										</div>
										{imgUrl ? <img src={imgUrl} style={{ width: 100, height: 100,}} /> : null}
									</div>
								</Upload>
								<div style={{color:"red",fontSize:"12px"}}>注：请选择JPEG、JPG、PNG格式图片</div>
							</Form.Item>
							<Form.Item name="checkQrcodeNo" rules={[
								{
									required: true,
									message: '请输入核销编号',
								}
							]}>
								<Input placeholder="请输入核销码编号"/>
							</Form.Item>
						</Form>
					</div>
				</Modal>
				<Modal width={400} destroyOnClose={true} title="核销码" visible={seeCodeVisible} maskClosable={true} footer={false} onCancel={()=>{ setSeeCodeVisible(false) }}>
						<div style={{textAlign:"center"}}>
							<img src={ imgUrl } style={{width:"100px",height:"100px"}}/>
							<div>{currentRow.checkQrcodeNo}</div>
						</div>
				</Modal>
			</PageHeaderWrapper>
		);
	})
export default connect(
	({ global }) => ({
		cityList: global.cityList, // 省市区数据
		ossToken: global.ossToken,
	}),
	dispatch => ({
		async getExtendcouponGetById(payload) {
			return dispatch({
				type: 'around/getExtendcouponGetById',
				payload,
			});
		},
		async getExtEndcouponorderList (payload,id) {
			return dispatch({
				type: 'around/getExtEndcouponorderList',
				payload:{
					...payload,
					extendCouponId:id
				},
			});
		},
		async getExtendcouponorderRefund (payload) {
			return dispatch({
				type: 'around/getExtendcouponorderRefund',
				payload,
			});
		},
		async getExtendcouponorderCancelOrder (payload) {
			return dispatch({
				type: 'around/getExtendcouponorderCancelOrder',
				payload,
			});
		},
		async getExtendcouponorderAddCheckCode (payload,id) {
			return dispatch({
				type: 'around/getExtendcouponorderAddCheckCode',
				payload:{
					...payload,
					extendCouponId:id
				},
			});
		},
		
		async getStsToken (){
			return dispatch({
				type: 'global/getStsToken',
			});
		}
		
	}),
)(UserInfo);
