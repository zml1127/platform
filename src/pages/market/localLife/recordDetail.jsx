import { connect } from 'dva';
import React, { useMemo, memo, useEffect,useState,useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {
	Table,
	Button,
	Tabs
} from 'antd';
const userInfoDetail = memo(props => {
	const {
		selectPushDetails,
		location,
	} = props;
	const { TabPane } = Tabs;
	const actionRef = useRef();
	const [type,SetType] = useState(1)
	const { id } = location.query
	const tabArr =[
		{
			key:1,
			value:"券列表"
		},
		{
			key:2,
			value:"团长列表"
		}
	]
	const sourceMap = {1:"联联周边游",2:"平台",3:"侠侣"}
	useEffect(()=>{
	},[])


	// 表格搜索函数
	const beforeSearchSubmit = search => {	
		return search;
	};
	
	const couponCol=[
		{ title: '三方名称',dataIndex: 'source',render:(_, row) => <div>{sourceMap[row.source]}</div>},
		{ title: '券名称',dataIndex: 'couponName',render:(_, row) => row.merchantType==1 ? "加油":"洗美"},
		{ title: '券头图',dataIndex: 'headPic',render: (_,row) => [<img src={`${row.headPic}`} key="img" style={{width:"120px",height:"120px"}}/>]},
		{ title: '券类型',dataIndex: 'couponType'},
		{ title: '所属商户',dataIndex: 'thirdMerchantName'},
		{ title: '所在区域',dataIndex: 'address',
		render: (_,row) => [<div>{row.showAddress}</div>,<div>{row.address}</div>]},
	]
	const teamLeaderCol = [
		{ title: '团长ID',dataIndex: 'leaderId'},
		{ title: '团长名称',dataIndex: 'realName'},
		{ title: '团长头像',dataIndex: 'avatar',render: (_,row) => [<img src={`${row.avatar}`} key="img" style={{width:"120px",height:"120px"}}/>]},
		{ title: '团长手机号',dataIndex: 'mobile'},
		{ title: '团长位置',dataIndex: 'showAddress',render: (_,row) => [<div>{row.showAddress}</div>,<div>{row.address}</div>]},
		{ title: '团员数',dataIndex: 'memberNum'},
		{ title: '完成分销次数',dataIndex: 'finishFxNum'},
		{ title: '分销总金额',dataIndex: 'totalDistributionAmount'},
		{ title: '分销佣金',dataIndex: 'distributionAmount'},
		{ title: '加入时间',dataIndex: 'createTime'},
	]
	return (
			<PageHeaderWrapper footer={
					<Button onClick={()=>{
						props.history.go(-1)
					}}>返回</Button>
			}>
				<div>
					<Tabs defaultActiveKey={String(type)} size="large" style={{width:"100%"}}  onChange={val=>{
						SetType(val)
						actionRef.current.reload()
					}}>
						{
							tabArr.map((item)=>{
								return (<TabPane tab={item.value} key={item.key}></TabPane>)
							})
						}
					</Tabs>
					<ProTable
						scroll={{ x: 'max-content' }}
						actionRef={actionRef}
						rowKey="id"
						beforeSearchSubmit={beforeSearchSubmit}
						pagination={{
							showSizeChanger: true,
							pageSizeOptions:['1','5','10','20','30','40','50']
						}}
						request={(params)=>selectPushDetails({...params,id,type})}
						columns={type==1?couponCol:teamLeaderCol}
						search={false}
					/>
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
		async selectPushDetails  (payload) {
			return dispatch({
				type: 'localLife/selectPushDetails',
				payload,
			});
		},
	}),
)(userInfoDetail);
