import { connect } from 'dva';

import React, { useRef, useCallback, useMemo, memo, useState,useEffect } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Input,
	message,
	Cascader,
	DatePicker,
	Select,
	Typography,
	Modal,
	Upload,
	Form
} from 'antd';
import { Link } from 'umi';
import { PlusOutlined,ExclamationCircleOutlined  } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import OrderTemplate from '../component/template';
import OSS from 'ali-oss';
import style from './style.less';
const { Item, useForm } = Form;
const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const sourceMap = {
	'': '全部',
	'1': '联联',
	'2': '平台',
	'3': '侠侣',
	'4': '商品券',
};
const surceData = [
	{label:"全部",value:""},
	{label:"联联",value:"1"},
	{label:"平台",value:"2"},
	{label:"侠侣",value:"3"},
	{label:"商品券",value:"4"},
]

const Order = memo(props => {
	const {
		getList,
		list,
		cityList,
		serviceList,
		getExtendcouponorderRefund,
		getExtendcouponorderAddCheckCode,
		ossToken,
		getStsToken,
	} = props;
	const [form] = useForm();
	const actionRef = useRef();
	const { submit } = form;
	const { setFieldsValue } = form;
	const [imgUrl, setImgUrl] = useState("")
	const [currentRow,setCurrentRow] = useState({})
	const [addCodeVisible,setAddCodeVisible] = useState(false)
	const serviceMap = useMemo(()=>{
		let map = {};
		serviceList.forEach((item)=>{
			let { id, name } = item
			map[id] = name
		})
		return map
	}, [serviceList])
	useEffect(()=>{
		getStsToken()
	},[])

	const showAddcodeModel = (row)=>{
		const {checkQrcode,checkQrcodeNo} = row
		setCurrentRow(row)
		setImgUrl(row.checkQrcode)
		setAddCodeVisible(true)
		setFieldsValue({
			checkQrcode:checkQrcode?checkQrcode.split('/distribution')[1]:"",
			checkQrcodeNo,
		})
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
					client.put(`/distribution${Date.now()}`, file)
						.then(function(rl) {
							setImgUrl(rl.url);
							setFieldsValue({imgUrl:`/distribution${rl.url.split('/distribution')[1]}`})
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
			id:currentRow.orderId,
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
				title: '订单生成时间',
				dataIndex: 'createTime',
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
			},
			{
				title: '订单支付时间',
				dataIndex: 'payTime',
				renderFormItem: (_item, { value, onChange }) => (
					<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
				),
				renderText: _ => _ || '--',
			},
			{
				title: '来源',
				dataIndex: 'source',
				filters: false,
				renderText:(_,row) => sourceMap[row.source],
				renderFormItem: (_item, { value, onChange }) => {
					return (
						<Select defaultValue="" onChange={onChange}>{
							surceData.map((item,index)=><Select.Option value={item.value}  key={index}>{item.label}</Select.Option>)
						}
						</Select>
					);
				},
			},
			{
				title: '商户名称',
				dataIndex: 'thirdMerchantName',
				hideInSearch: true
			},
			{
				title: '区域',
				dataIndex: 'area',
				ellipsis: true,
				renderFormItem: (_item, { value, onChange }) => (
					<Cascader
						options={cityList}
						showSearch
						allowClear
						style={{ width: '100%' }}
						fieldNames={{ label: 'name', value: 'id', children:'children'}} // 定义label/value/children对应字段
						value={value} // 指定选中项目
						onChange={onChange}
					/>
				),
			},
			{
				title: '券头图',
				dataIndex: 'headPic',
				hideInSearch: true,
				render: (_,row) => [
					<img src={`${row.headPic}`} key="img" style={{width:"120px",height:"120px"}}/>
				]
			},
			{
				title: '券名称',
				dataIndex: 'couponName',
				hideInSearch: true,
			},
			{
				title: '原价（元）',
				dataIndex: 'thirdPrice',
				hideInSearch: true,
			},
			{
				title: '优惠价（元）',
				dataIndex: 'price',
				hideInSearch: true,
			},
			{
				title: '总分佣',
				dataIndex: 'totalCommission',
				hideInTable: true
			},
			{
				title: '平台分佣',
				dataIndex: 'platFormCommission',
				hideInSearch: true
			},
			{
				title: '团长分佣',
				dataIndex: 'leaderCommission',
				hideInSearch: true
			},
			{
				title: '团长昵称',
				dataIndex: 'leaderNickName',
			},
			{
				title: '团长手机号',
				dataIndex: 'leaderMobile',
			},
			{
				title: '团员分佣',
				dataIndex: 'memberCommission',
				hideInSearch: true
			},
			{
				title: '支付状态',
				dataIndex: 'orderStatusStr',
				hideInSearch: true,
			},
			{
				title: '支付方式',
				dataIndex: 'payTypeStr',
				hideInSearch: true,
			},
			{
				title: '付款人姓名',
				dataIndex: 'payName',
				hideInSearch: true
			},
			{
				title: '付款人手机号',
				dataIndex: 'payMobile',
				hideInSearch: true,
			},
			{
				title: '是否添加核销码',
				dataIndex: 'isAddCheckQrcode',
				renderFormItem: (_item, { value, onChange }) => {
					return (
						<Select defaultValue="" onChange={onChange}>
							<Select.Option value="" key="0">全部</Select.Option>
							<Select.Option value={1} key="1">是</Select.Option>
							<Select.Option value={0} key="2">否</Select.Option>
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
					[2,3,4].includes(row.orderStatus) ?
						<a key="delete" onClick={() => {
							Modal.confirm({
								title: '提示',
								icon: <ExclamationCircleOutlined />,
								content: `确定要退款吗`,
								okText: '确认',
								cancelText: '取消',
								onOk:()=>{
									getExtendcouponorderRefund({orderId:row.orderId}).then(res=>{
										if(res.code == "0000"){
											actionRef.current.reload()
										}
									})
								} 
							});
						}}>
							<Text type="danger" style={{cursor:'pointer'}}>退款</Text>
						</a>:null,
						// [2,3,4].includes(row.orderStatus) && row.source == 1 ?
						// <a key="add" onClick={ ()=>{ showAddcodeModel(row)} }>{ row.isAddCheckQrcode =="是" ? "编辑":"添加"}核销码</a>
						// :null,
			   ]
			}
		],
		[cityList],
	);
	return (
		<div>
			<OrderTemplate
				getOrderList = { getList }
				cityList={ cityList }
				columns={columns}
				actionRef = { actionRef }
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
		</div>
	)
})

export default connect(
	({ global, order }) => ({
		cityList: global.cityList, // 省市区数据
		list: order.distribution,
		serviceList: order.serviceList,
		ossToken: global.ossToken,
	}),
	dispatch => ({
		async getList(payload) {
			return dispatch({
				type: 'order/getLocalLifePagelistForPlatForm',
				payload,
			});
		},
		async getExtendcouponorderRefund (payload) {
			return dispatch({
				type: 'around/getExtendcouponorderRefund',
				payload,
			});
		},
		async getExtendcouponorderAddCheckCode (payload) {
			return dispatch({
				type: 'around/getExtendcouponorderAddCheckCode',
				payload:{
					...payload
				},
			});
		},
		async getStsToken (){
			return dispatch({
				type: 'global/getStsToken',
			});
		}
	}),
)(Order);
