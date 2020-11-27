import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useEffect,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import {
	Select,
	Form,
	Input,
	Row,
	Col,
	Tag,
	Button
} from 'antd';
const { TextArea } = Input;
const { useForm } = Form;
const baseUrl = "http://sk-business.oss-cn-zhangjiakou.aliyuncs.com"

import { PlusOutlined, FileExcelFilled } from '@ant-design/icons';
import style from './detail.less';
const { Option } = Select

const userInfoDetail = memo(props => {
	const {
		location,
		getFeedBackDetail,
		getFeedBackUserStatus
	} = props;

	const userId = location.query.userId
	// 获取跳转值
	const selectMaterial = JSON.parse(localStorage.getItem('appletsItem'))
	const [form] = useForm();
	const [returnData,setReturnData] = useState({})
	useEffect(()=>{
		getFeedBackUserStatus({userId}).then(res=>{
			if(res.code =="0000"){
				getFeedBackDetail({userId}).then(res=>{
					if(res.code =="0000"){
						setReturnData(res.data)
					}
				})
			}
		})

	},[])

	return (
			<PageHeaderWrapper title="反馈详情" style={{height:"calc(100%-400px)"}}>
				<div className={style.feedback_detail}>
					<div className={style.title}>反馈详情</div>
					<div className={style.title_info}>
						<Row className={style.line}>
							<span className={style.line_col}><span className={style.info_title}>用户名：</span><span>{returnData.userName}</span></span>
							<span className={style.line_col}><span className={style.info_title}>用户ID：</span><span>{returnData.userId}</span></span>
						</Row>
						<Row className={style.line}>
							<span className={style.line_col}><span className={style.info_title}>手机号：</span><span>{returnData.phoneNumber}</span></span>
							<span className={style.line_col}><span className={style.info_title}>服务使用总次数：</span><span>{returnData.totalServiceUsage}</span></span>
							
						</Row>
						<Row className={style.line}>
							<span className={style.line_col}><span className={style.info_title}>注册时间：</span><span>{returnData.registrationTime}</span></span>
							<span className={style.line_col}><span className={style.info_title}>反馈次数：</span><span>{returnData.feedbackTimes}</span></span>
						</Row>
					</div>
					<div className={style.info_con}>{
						returnData.userFeedbackInfoInfoList && returnData.userFeedbackInfoInfoList.map((item,index)=>{
							return (
								<div key={index}>
									<div className={style.line_style}>{item.createTime}<Tag color="processing" className={style.info_con_tag}>{item.isRead==1?"已读":"未读"}</Tag></div>
									<div className={style.line_style}>{item.content}</div>
									<div className={style.line_style}>{
										item.picUrl[0] && item.picUrl.split(',').map((ite,inx)=>{
											return (<img src={`${baseUrl}/${ite}`} alt="" key={inx}/>)
										})
									}
									</div>
								</div>
							)
						})
					}
					</div>
					<Button onClick={()=>{history.go(-1)}}  style={{position:"fixed",right:"60px",bottom:"40px"}} type="primary">返回</Button>
				</div>
			</PageHeaderWrapper>
		);
	})
export default connect(
	({  global,operation }) => ({
		selectMaterial:operation.selectMaterial
	}),
	dispatch => ({
		async getFeedBackDetail(payload) {
			return dispatch({
				type: 'operation/getFeedBackDetail',
				payload,
			});
		},
		async getFeedBackUserStatus(payload) {
			return dispatch({
				type: 'operation/getFeedBackUserStatus',
				payload,
			});
		},
	}),
)(userInfoDetail);
