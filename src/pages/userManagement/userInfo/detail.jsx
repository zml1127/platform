import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useEffect,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Table,
	Select,
	Radio
} from 'antd';
const {Option} = Select
import style from './detailStyle.less';

const userInfoDetail = memo(props => {
	const {
		getCount,
		getOrderList,
		getTrainList,
		location,
	} = props;

	const [dataSource, setDataSource] = useState([]);
	const [infoType, setInfoType] = useState("orderInfo");
	const [orderType, setOrderType] = useState("oil");
	const [current,setCurrent] =useState(1)
	const [pageSize,setPageSize] =useState (20)
	const [total,setTotal] = useState(0)
	const {id} = location.query
	const orderTypeObj={"oil":"1","server":"2","duihuan":"3","insure":"4",}
	const orderMap = {'0': '全部','1': '待支付','2': '待核销','3': '已完成','4': '拼团中','-1': '已取消'}
	const [countInfo,setCountInfo] = useState({})
	const [loading,setLoading] = useState(false)

	useEffect(()=>{
		// 获取统计信息
		getCount({id}).then(res=>{
			if(res.code =="0000"){
				setCountInfo(res.data)
			}
		})
	},[])

	useEffect(()=>{
		let getAllList = infoType == "orderInfo"?
			getOrderList({orderTypeIdx:orderTypeObj[orderType],id,current,pageSize}):
			getTrainList({id,pageSize,current})
		setLoading(true)
		getAllList.then(res=>{
			const {data,total} = res
			setDataSource(data)
			setTotal(total)
			setLoading(false)
		})
	},[current,pageSize,infoType,orderType,getOrderList,getTrainList])

	// 切换信息类型选项
	const selectInfoType = ((val)=>{
		setInfoType(val)
		setCurrent(1)
		// getTypeList(val)
	})
   // 切换订单类型
	const onChangeRadio = (e)=>{
		const type = e.target.value
		setOrderType(type)
		setCurrent(1)
	}
	// 分页切换
	const changeTable=(value)=>{
		const {pageSize,current} = value
		setPageSize(pageSize)
		setCurrent(current)
	}
	
	const normalCol_1 =[
		{ title: '订单编号',dataIndex: 'orderNum'},
		{ title: '订单状态',dataIndex: 'orderStatus',
		render:(_, row) => row.userStatus ? orderMap[row.orderStatus]:orderMap[row.orderStatus]}
	]
	const normalCol_2 =[
		{ title: '订单编号',dataIndex: 'orderNum'},
		{ title: '订单状态',dataIndex: 'status',
		render:(_, row) => String(row.status) ? orderMap[String(row.status)]:"--"}
	]
	const oliCol = [
		{ title: "油品号",dataIndex: 'oilNum'},
		{ title: '油枪号',dataIndex: 'gunNo'}
	]
	const serverCol = [
		{ title: "服务类型",dataIndex: 'serviceType'},
		{ title: '服务名称',dataIndex: 'serviceName'}
	]
	const order_total=[
		{ title: '应付(元)',dataIndex: 'originalAmount'},
		{ title: '优惠(元)',dataIndex: 'totalDiscountAmount'},
		{ title: '实付(元)',dataIndex: 'onlineAmount'},
		{ title: '商户区域',dataIndex: 'area'},
		{ title: '商品名称',dataIndex: 'name'},
		{ title: '归属连锁商户',dataIndex: 'merchantChainName'},
		{ title: '订单生成时间',dataIndex: 'createTime'},
		{ title: '订单支付时间',dataIndex: 'payTime'}
	]
	const duihuanCol=[
		{ title: '商户名称',dataIndex: 'name'},
		{ title: '商户类型',dataIndex: 'merchantType',render:(_, row) => row.merchantType==1 ? "加油":"洗美"},
		{ title: '商户区域',dataIndex: 'area',},
		{ title: '归属连锁商户',dataIndex: 'merchantChainName'},
		{ title: '兑换商品',dataIndex: 'couponName'},
		{ title: '商品数量',dataIndex: 'goodsNum'},
		{ title: '订单生成时间',dataIndex: 'createTime'},
		{ title: '订单核销时间',dataIndex: 'writeoffTime'}
	]
	const insureCol = [
		{ title: '订单编号',dataIndex: 'orderNum'},
		{ title: '订单生成时间',dataIndex: 'createTime'},
		{ title: '订单支付时间',dataIndex: 'payTime'},
		{ title: '所属渠道',dataIndex: 'channelName'},
		{ title: '手机号',dataIndex: 'phone'},
		{ title: '车牌号',dataIndex: 'licenseNo'},
		{ title: '车主',dataIndex: 'ownerName'},
		{ title: '地区',dataIndex: 'area'},
		{ title: '保险公司',dataIndex: 'icName'},
		{ title: '购买险别',dataIndex: 'risksList'},
		{ title: '总订单金额',dataIndex: 'payAmount'},
		{ title: '交强+车船金额',dataIndex: 'tax'},
		{ title: '交强险积分（比例）',dataIndex: 'forceRate'},
		{ title: '商业险金额',dataIndex: 'bizTotal'},
		{ title: '商业险佣金（比例)',dataIndex: 'bizRate'},
		{ title: '商业投保单号',dataIndex: 'bizPolicy'},
		{ title: '交强险投保单号',dataIndex: 'forceProp'},
		{ title: '订单状态',dataIndex: 'orderStatus',render:(_, row) => row.userStatus ? orderMap[row.orderStatus]:orderMap[row.orderStatus]},
		{ title: '交强险保单号',dataIndex: 'forcePolicy'},
		{ title: '商业险保单号',dataIndex: 'bizPolicy'}
	]
	const orderObj={
		"oil":normalCol_1.concat(oliCol).concat(order_total),
		"server":normalCol_1.concat(serverCol).concat(order_total),
		"duihuan":normalCol_2.concat(duihuanCol),
		"insure": insureCol
	}
	const columnsOrder = orderObj[orderType]
	const trainColumn = [
		{ title: '车辆类型',dataIndex: 'vehicleClass'},
		{ title: '座位数',dataIndex: 'vehicleSeat'},
		{ title: '品牌型号',dataIndex: 'vehicleName'},
		{ title: '车辆识别代码',dataIndex: 'modelCode'},
		{ title: '发动机号',dataIndex: 'engineNo'},
		{ title: '适用油品',dataIndex: 'applyRefuelNumName'},
		{ title: '行驶里程',dataIndex: 'mileage'},
		{ title: '添加时间',dataIndex: 'createTime'}
	]
	const columns = useMemo(
		() =>{return infoType == "orderInfo"?columnsOrder:trainColumn}
		,[dataSource,infoType,columnsOrder,trainColumn]);
	return (
			<PageHeaderWrapper>
				<div className={style.data_con}>
					<div className={style.box}>
						<h2>基本用户信息</h2>
						<div className="row_style">用户UID: {countInfo.unionId}</div>
						<div className="row_style">用户昵称: {countInfo.nickName}</div>
						<div className="row_style">手机号: <span> {countInfo.mobile}</span></div>
					</div>
					<div className={style.box}>
					<h2>订单信息</h2>
						<div className="row_style">加油订单数: <span>{countInfo.oilOrderCount}</span></div>
						<div className="row_style">洗美订单数: <span>{countInfo.washOrderCount}</span></div>
						<div className="row_style">商品兑换订单数: <span>{countInfo.goodsOrderCount}</span></div>
						<div className="row_style">保险订单数: <span>{countInfo.insuranceOrderCount}</span></div>
					</div>
					<div className={style.box}>
					<h2>用户行为信息</h2>
						<div className="row_style">总交易金额: <span>{countInfo.allOrderAmount}{String(countInfo.allOrderAmount)?'元':""}</span></div>
						<div className="row_style">合计订单数: <span>{countInfo.allOrderCount}</span></div>
						<div className="row_style">平均PV: <span>{countInfo.pv}</span>{String(countInfo.pv)?'次/周':""}</div>
						<div className="row_style">平均UV: <span>{countInfo.uv}</span>{String(countInfo.uv)?'次/周':""}</div>
						<div className="row_style">平均交易笔数: <span>{countInfo.weekNum}{String(countInfo.weekNum)?'次/周':""}</span></div>
					</div>
				</div>
				<div className={style.table_con}>
					<Select defaultValue={ infoType } style={{width: 200,margin:"20px 0px",}} onChange={selectInfoType} >
						<Option value="orderInfo">订单信息</Option>
						<Option value="trainInfo">车辆信息</Option>
					</Select>
					<div style={{ marginBottom: 16 }}>
						{ infoType == "orderInfo"?
							<Radio.Group defaultValue={orderType} onChange={onChangeRadio}>
								<Radio.Button value="oil">加油订单</Radio.Button>
								<Radio.Button value="server">服务订单</Radio.Button>
								<Radio.Button value="duihuan">兑换记录</Radio.Button>
								<Radio.Button value="insure">保险订单</Radio.Button>
							</Radio.Group>:"车辆信息"
						}
					</div>
					<Table dataSource={dataSource} columns={columns} scroll={{ x: 'max-content' }} rowKey="id" key="id" 
						pagination={
						{pageSize,total,current,pageSizeOptions:['1','20','30','40','50'], 
						showSizeChanger:true,
						showTotal: (count = total) => { return '共' + total + '条数据'}}} onChange={changeTable} loading={loading}/>
				</div>
			</PageHeaderWrapper>
		);
	})
export default connect(
	({  order }) => ({
		orderList: order.orderList,
		serviceTypeContent: global.serviceTypeContent
	}),
	dispatch => ({
		async getCount  (payload) {
			return dispatch({
				type: 'userManagement/getCount',
				payload,
			});
		},
		async getOrderList  (payload) {
			return dispatch({
				type: 'userManagement/getOrderList',
				payload,
			});
		},
		async getTrainList  (payload) {
			return dispatch({
				type: 'userManagement/getTrainList',
				payload,
			});
		},
	}),
)(userInfoDetail);
