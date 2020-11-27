import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useEffect,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import {
	Select,
	Row,
	Col,
	Button,
	Modal,
	Form,
} from 'antd';
import { history } from 'umi';
import style from './editAddSee.less';

const userInfoDetail = memo(props => {
	const {
		location,
		getetProductDetail
	} = props;
	const [list,setList] = useState([])
	const {type,id,productId,infoId} = location.query
	useEffect(()=>{
		getetProductDetail({productId,infoId,id,type}).then(res=>{
			if(res.code =="0000"){
				setList(res.data)
			}
		})
	},[])

	return (
		<PageHeaderWrapper 
				footer={
					<div style={{textAlign:"left"}}>
						<Button onClick={()=>{
							history.push({
								pathname: `/market/around/edit/add`,
								query: {
									type,
								},
							})
						}}>返回</Button>
					</div>
				}>
					<div className={style.feedback_detail}>
						<div className={style.title_info}>
							<Row className={style.line}>
								<Col span={4}>头图：</Col>
								<Col span={12}>
									<img src={list.headPic} width="100" height="100"/>
								</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>轮播图：</Col>
								<Col span={12}>{
									list.pic?list.pic.split(",").map((item,index)=><img src={item} key={index} width="100" height="100" style={{margin:"10px 10px 10px 0px"}}/>):""
								}
								</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>券名称：</Col>
								<Col span={16}>{list.name}</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>原价：</Col>
								<Col span={16}>{list.thirdPrice?'￥':null}{list.thirdPrice}</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>优惠价：</Col>
								<Col span={16}>{list.price?'￥':null}{list.price}</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>返佣价：</Col>
								<Col span={16}>{list.commissionAmount?'￥':null}{list.commissionAmount}</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>使用时间：</Col>
								<Col span={16}>{list.useStartTime?list.useStartTime.split(" ")[0] : null}{list.useEndTime?`~${list.useEndTime.split(" ")[0]}`:""}</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>所属商户：</Col>
								<Col span={16}>{list.thirdMerchantName}</Col>
							</Row>
							{
								list.showAddress?
								<div>
									<Row className={style.line}>
										<Col span={4}>商家地址：</Col>
										<Col span={16}>{list.showAddress}</Col>
									</Row>
									<Row className={style.line}>
										<Col span={4}></Col>
										<Col span={16}>{list.address}</Col>
									</Row>
								</div>:
								<Row className={style.line}>
									<Col span={4}>商家地址：</Col>
									<Col span={16}>{list.address}</Col>
								</Row>
							}
							<Row className={style.line}>
								<Col span={4}>商家电话：</Col>
								<Col span={16}>{list.thirdMerchantPhone}</Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>服务详情：</Col>
								<Col span={16} dangerouslySetInnerHTML={{__html:list.info}}></Col>
							</Row>
							<Row className={style.line}>
								<Col span={4}>富文本访问地址：</Col>
								<Col span={16}>
									< a href={list.infoUrl}  target="_blank" >{list.infoUrl}</a>
								</Col>
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
		async getetProductDetail(payload) {
			return dispatch({
				type: 'around/getetProductDetail',
				payload,
			});
		},
	}),
)(userInfoDetail);
