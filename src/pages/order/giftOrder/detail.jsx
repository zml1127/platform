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
import style from './detail.less';
const { Text } = Typography;
const { Item, useForm } = Form;

const UserInfo = memo(props => {
	const {
		getStsToken,
		getExtEndcouponorderList,
		getExtendcouponGetById,
		ossToken,
		location,

	} = props;

	const [detailData,setDetailData] = useState({})
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
		],[detailData]
	);
		return (
			<PageHeaderWrapper>
				<Row style={{backgroundColor:"#fff",padding:"20px 20px 0px 20px"}}>
					{/* <Col span={3}>
						<img src={ detailData.headPic?detailData.headPic:""} className={style.box} style={{width:"120px",height:"120px"}}/>
					</Col> */}
					{/* <Col className={style.box} span={18}>
						<Row>
							<Col className={style.line} span={6}>三方名称：{sourceObj[detailData.source]}</Col>
							<Col className={style.line} span={6}>券库存：{detailData.totalNum}</Col>
						</Row>
						<Row>
							<Col className={style.line} span={6}>礼包原价：{sourceObj[detailData.source]}</Col>
							<Col className={style.line} span={6}>礼包优惠价：{detailData.totalNum}</Col>
						</Row>
					</Col> */}
				</Row>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					request={(paload)=>getExtEndcouponorderList(paload,id)}
					columns={columns}
					search={ false }
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
				/>
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
