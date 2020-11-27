import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo, useEffect,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { history } from 'umi';
import style from './index.less';
import {
	Row,
	Col,
	Button,
	Form,
	Input, message 
} from 'antd';

const { useForm } = Form;
const userInfoDetail = memo(props => {
	const {
		location,
		getWithdrawRule,
		setWithdrawRule
	} = props;

	const [form] = useForm();
	const [list,setList] = useState([])
	const [isEdit,setIsEdit] = useState(false)
	const [subDisabled,setSubDisabled] = useState(false)
	const {setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
	useEffect(()=>{
		getWithdrawRule().then(res=>{
			if(res.code =="0000"){
				setList(res.data)
			}
		})
	},[isEdit])

	const showEdit = ()=>{
		const { matchMoney,cycle } = list
		setFieldsValue({
			matchMoney,
			cycle
		})
		setIsEdit(true)
	}
	const handleFinish = (value)=>{
		const { matchMoney,cycle } = value
		setWithdrawRule({
			matchMoney,
			cycle
		}).then(res=>{
			if(res.code == "0000"){
				message.success('设置成功')
				setIsEdit(false)
			}
		})
	}
	return (
		<PageHeaderWrapper title="提现设置" style={{height:"calc(100%-400px)"}} >
			<div className={style.setting}>
				{
					!isEdit ?
						<div className={style.title_info}>
							<Row className={style.line}>
								<span className={style.title}>提现金额门槛：</span>
								<span>满{list.matchMoney}元</span>
							</Row>
							<Row className={style.line}>
								<span>提现周期：</span>
								<span>已到账金额满{list.cycle}天可提现</span>
							</Row>
							<div className={style.tip}>已到账金额至少满多少天可提现</div>
							<Button onClick={()=>showEdit()}  type="primary" className={style.update_style}>更改</Button>
						</div>:
						<div className={style.form_info}>
							<Form name="basic"  onFinish={ handleFinish } form={form} labelCol={ {span:3} }>
							
								<Form.Item name="matchMoney" label="提现金额门槛（元）" rules={[
											{
												required: true,
												message: '提现金额门槛',
											},
											{
												pattern:/^[+]{0,1}(\d+)$/,
												message: '请输入正整数',
											},
											{
												validator: (_, val) => {
													if(val>10000){
														return Promise.reject("金额门槛最大不能超过10000！")
													}else{
														return Promise.resolve();
													}
												}
											},
										]}>
									<Input placeholder="请输入提现金额门槛" style={{margin:"0px 10px",width:"200px"}}/>
								</Form.Item>
								<Form.Item name="cycle" label="提现周期（天）" rules={[
									{
										required: true,
										message: '提现周期',
									},
									{
										pattern:/^[+]{0,1}(\d+)$/,
										message: '请输入正整数',
									},
									{
										validator: (_, val) => {
											if(val>1000){
												return Promise.reject("提现周期不能超过1000天！")
											}else{
												return Promise.resolve();
											}
										}
									},
								]}>
									<Input placeholder="请输入提现周期" style={{margin:"0px 10px",width:"200px"}}/>
								</Form.Item>
								<Form.Item>
									<div className={style.submit_con}>
										<Button type="primary" htmlType="submit" className={style.submit} >提交</Button>
										<Button onClick={()=>{ setIsEdit(false) }}>返回</Button>
									</div>
								</Form.Item>
							</Form>
						</div>
				}				
			</div>
		</PageHeaderWrapper>
	);
})
export default connect(
	({  global,operation }) => ({
		selectMaterial:operation.selectMaterial
	}),
	dispatch => ({
		async getWithdrawRule(payload) {
			return dispatch({
				type: 'retail/getWithdrawRule',
				payload,
			});
		},
		async setWithdrawRule(payload) {
			return dispatch({
				type: 'retail/setWithdrawRule',
				payload,
			});
		},
		
	}),
)(userInfoDetail);
