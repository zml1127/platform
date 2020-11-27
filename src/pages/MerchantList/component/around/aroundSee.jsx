import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useEffect,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { history } from 'umi';
import {
	Select,
	Row,
	Col,
	Button
} from 'antd';
const baseUrl = "http://sk-business.oss-cn-zhangjiakou.aliyuncs.com"

import style from './aroundSee.less';
const { Option } = Select

const userInfoDetail = memo(props => {
	const {
		location,
		getExtendcouponGetById
	} = props;

	const {id,fromPath} = location.query
	const [list,setList] = useState([])
	useEffect(()=>{
		getExtendcouponGetById({id}).then(res=>{
			if(res.code =="0000"){
				setList(res.data)
			}
		})
	},[])

	return (
		<PageHeaderWrapper title="周边券查看" style={{height:"calc(100%-400px)"}} footer={
			<Button onClick={()=>{
				fromPath ?
					props.history.go(-1):
					history.push({ pathname: '/merchantManage/merchant/details',query: { type: 4},})
			}} type="primary">返回</Button>
		}>
			<div className={style.feedback_detail}>
				<div className={style.title_info}>
					<Row className={style.line}>
						<Col span={2}>头图：</Col>
						<Col span={6}>
							<img src={list.headPic} width="100" height="100"/>
						</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>轮播图：</Col>
						<Col span={6}>{
							list.pic?list.pic.split(",").map((item,index)=><img key={index} src={item} width="100" height="100" style={{margin:"10px 10px 10px 0px"}}/>):""
						}
						</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>券名称：</Col>
						<Col span={6}>{list.name}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>券类型：</Col>
						<Col span={6}>{list.typeStr}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>原价：</Col>
						<Col span={6}>{list.thirdPrice}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>优惠价：</Col>
						<Col span={6}>{list.price}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>返佣价：</Col>
						<Col span={6}>{list.commissionAmount}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>购买时间：</Col>
						<Col span={6}>{list.buyStartTime?list.buyStartTime.split(" ")[0] : null} ~ {list.buyEndTime?list.buyEndTime.split(" ")[0]:""}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>使用时间：</Col>
						<Col span={6}>{list.useStartTime?list.useStartTime.split(" ")[0] : null} ~ {list.useEndTime?list.useEndTime.split(" ")[0]:""}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>所属商户：</Col>
						<Col span={6}>{list.thirdMerchantName}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>商家地址：</Col>
						<Col span={6}>{list.showAddress}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}></Col>
						<Col span={6}>{list.address}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>商家电话：</Col>
						<Col span={6}>{list.thirdMerchantPhone}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>营业时间</Col>
						<Col span={6}>{list.openStartTime}{list.openEndTime?`~${list.openEndTime}` :""}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>库存</Col>
						<Col span={6}>{list.totalNum}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>状态</Col>
						<Col span={6}>{list.statusForPlatForm?"开启":"关闭"}</Col>
					</Row>
					<Row className={style.line}>
						<Col span={2}>服务详情</Col>
						<Col span={6} dangerouslySetInnerHTML={{__html:list.info}}></Col>
					</Row>
				</div>
			</div>
		</PageHeaderWrapper>
	);
})
export default connect(
	({  global,operation }) => ({
		selectMaterial:operation.selectMaterial
	}),
	dispatch => ({
		async getExtendcouponGetById(payload) {
			return dispatch({
				type: 'around/getExtendcouponGetById',
				payload,
			});
		},
	}),
)(userInfoDetail);
