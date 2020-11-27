import {
	Button,
	Input,
	message,
	DatePicker,
	Select,
	Typography, //复制、编辑、标题文本
	Form,
	Row,Checkbox,Radio,
	Col,
} from 'antd';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'dva';
import ExChangeModal from '../components/exChangeModal'
const { RangePicker } = DatePicker

const createEditCoupon = memo(props => {
    const { getAssoiatList, updateMerchantCouponExtend, getMerchantExtendById, } = props
    const { Item, useForm } = Form;
	const [form] = useForm();
    const { submit, setFieldsValue, resetFields } = form;
    const radioStyle = {display: 'block',height: '30px',lineHeight: '30px'};
    const [exChangeVisible, setExChangeVisible] = useState(false)

    const [couponType, setCouponType] = useState(1) //优惠券类型 1:满减券 2:折扣券 3:商品兑换券
    const [totalNumFlag, setTotalNumFlag] = useState(false) //发券数量不限标识
    const [associatedServiceType, setAssociatedServiceType] = useState(1) //折扣券下的关联服务 1加油 20洗美装
    const [assoiatList1, setAssoiatList1] = useState([]) //关联服务项下方列表
    const [assoiatList20, setAssoiatList20] = useState([]) //关联服务项下方列表
    const [goodsId, setGoodsId] = useState('') //兑换品id
    const [useDoorType, setUseDoorType] = useState(0) //使用门槛 0无门槛 
    const [startTimeSign, setStartTimeSign] = useState(false) //开始时间标志
    const [endTimeSign, setEndTimeSign] = useState(false) //结束时间标志
    const [useCouponDate, setUseCouponDate] = useState([]) //用券时间日期区间
  
    const [oilChecked, setOilChecked] = useState([]) //加油关联服务项选中的
    const [washChecked, setWashChecked] = useState([]) //洗美关联服务选中的
    const [serviceName, setServiceName] = useState('') //关联服务项名字
    const [goodsName, setGoodsName] = useState('') //选中的兑换品的名字
    const [goodsNum, setGoodsNum] = useState(1) //选中的兑换品的数量

    useEffect(()=>{
        getAssoiatList({ pid: associatedServiceType }).then(res=>{
            if(res){
                if(associatedServiceType==1){
                    setAssoiatList1(res)
                }else{
                    setAssoiatList20(res)
                }
            }
        })
    },[associatedServiceType,])

    const treeChange = useCallback((value,node)=>{
        if(associatedServiceType==1){
            setOilChecked(value)
        }else{
            setWashChecked(value)
        }
    },[ associatedServiceType, ])

    useEffect(()=>{ //回显
        getMerchantExtendById({ id: props.location.query.id  }).then(res=>{
            console.log('获取回显res=', res)
            if(res){
                setCouponType(res.couponType) //优惠券类型
                setGoodsId(res.goodsId ? res.goodsId : '') //兑换品id
                setGoodsName(res.goodsName ? res.goodsName : '') //兑换品名字
                setGoodsNum(res.goodsNum ? res.goodsNum : '') //兑换品数量
                setServiceName(res.serviceName ? res.serviceName : '')
                if(res.totalNum == -1){ //发券数量标识 -1不限制
                    setTotalNumFlag(true)
                }
                if(res.serviceType==20){ //洗美装关联服务
                    setAssociatedServiceType(20)
                }
                if(res.startLimitFlag==0){
                    setStartTimeSign(true)
                }
                if(res.endLimitFlag==0){
                    setEndTimeSign(true)
                }
                setUseDoorType(res.useCondition ? res.useCondition : 0) //使用门槛
                setUseCouponDate([res.useStartTime?moment(res.useStartTime, 'YYYY-MM-DD HH:mm:ss'):null, res.useEndTime?moment(res.useEndTime, 'YYYY-MM-DD HH:mm:ss'):null]) //用券时间
                form.setFieldsValue({
                    serviceType: res.serviceType ? res.serviceType : 1, //关联服务项
                    name: res.name ? res.name : '', //优惠券名称
                    faceValue: (res.faceValue||res.faceValue==0) ? res.faceValue : '', //优惠券面额
                    totalNum: res.totalNum&&res.totalNum!==-1 ? res.totalNum : '', //发券数量
                    useCondition: res.useCondition ? res.useCondition : 0, //使用门槛 0无门槛 有门槛
                    matchAmount: res.matchAmount ? res.matchAmount : '', //满足面额使用条件
                    startLimitFlag: res.startLimitFlag==0?true : false, //活动开始时间限制标识1限制，0不限制
                    startTime: res.startTime ? moment(res.startTime, 'YYYY-MM-DD HH:mm:ss') : '',
                    endLimitFlag: res.endLimitFlag==0?true:false, 
                    endTime: res.endTime ? moment(res.endTime, 'YYYY-MM-DD HH:mm:ss') : '',
                    effectFlag: res.effectFlag==1?1:0, //生效标识 1立即生效   0:要选时间
                })
            }
        })
    },[])
    
    // 提交表单
    const handleFinish = useCallback(val=>{
        console.log('val==', val)
        let params = {
            id: props.location.query.id || 1, 
            couponType,  // ok
            name: val.name, //优惠券名称   ok  
            // totalNum: val.totalNum, //发券数量 ok
            effectFlag: val.effectFlag, //生效标识
        }
        params.serviceType = val.serviceType //关联服务项 1加油 20洗美装
        params.faceValue = val.faceValue //优惠券面额
        if(totalNumFlag){
            params.totalNum = -1 //发券数量
        }else{
            params.totalNum = val.totalNum
        }
        params.useCondition = val.useCondition //使用门槛 0 标识无门槛,1-有门槛
        if(val.useCondition==1){
            if(val.matchAmount){
                params.matchAmount = val.matchAmount //满足面额使用条件
            }else{
                message.error('请填写订单满足条件')
                return
            }
        }
      
        if(couponType==3){
            params.goodsId = goodsId //兑换品id
            params.goodsNum = goodsNum //兑换品数量
        }
        if(couponType!==1){
            if((!val.startLimitFlag && !val.startTime) || (!val.endLimitFlag && !val.endTime)){
                message.error('请选择有效期')
                return false
            }
            if(val.startLimitFlag){  //开始时间
                params.startLimitFlag = 0 //调上不限制
            }else{
                params.startLimitFlag = 1 //开始时间限制
                if(val.startTime){
                    params.startTime =  moment(val.startTime._d).format('YYYY-MM-DD HH:mm:ss')
                }else{
                    message.error('请选择开始时间')
                    return
                }
            }
            if(val.endLimitFlag){ //结束时间
                params.endLimitFlag = 0 //调上不限制
            }else{
                params.endLimitFlag = 1 //结束时间限制
                if(val.endTime){
                    params.endTime = moment(val.endTime._d).format('YYYY-MM-DD HH:mm:ss')
                }else{
                    message.error('请选择结束时间')
                    return
                }
            }
        }
        if(val.effectFlag!==1){ //没有立即生效，需要选时间区域
            if(JSON.stringify(useCouponDate)!=='[]'&&useCouponDate[0]){
                params.useStartTime = moment(useCouponDate[0]._d).format('YYYY-MM-DD HH:mm:ss')
                params.useEndTime = moment(useCouponDate[1]._d).format('YYYY-MM-DD HH:mm:ss')
            }else{
                message.error('请选择用券时间')
                return
            }
        }
        if(params.useStartTime&&params.startTime){ 
            if(new Date(moment(params.useStartTime).format('YYYY-MM-DD HH:mm:ss')).getTime() < new Date(moment(params.startTime).format('YYYY-MM-DD HH:mm:ss')).getTime()){
                message.error('用券开始时间应在有效期内')
                return
            }
        }
        if(params.useEndTime&&params.endTime){
            if(new Date(moment(params.useEndTime).format('YYYY-MM-DD HH:mm:ss')).getTime() > new Date(moment(params.endTime).format('YYYY-MM-DD HH:mm:ss')).getTime()){
                message.error('用券结束时间应在有效期内')
                return
            }
        }
        console.log('参数params==', params)
        updateMerchantCouponExtend(params).then(res=>{ //需要重新写调用接口
            console.log('优惠券详情页编辑res==', res)
            if(res){
                props.history.go(-1)
            }
        })
    },[ couponType, totalNumFlag, goodsId, goodsNum, useCouponDate, oilChecked, washChecked, ])
    
    return (
      	<PageHeaderWrapper title='编辑'>
			<Form
                labelCol={ {span:6} }
                style={{ background: "#fff", padding: '10px' }}
                form={form}
                layout="horizontal" // 表单布局
                onFinish={handleFinish} // 提交表单且数据验证成功后回调事件
            >
                {/* ****基本信息***** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>基本信息</Typography.Title>
                    {/* 优惠券类型 */}
                <Row gutter={8}>
					<Col>
						优惠券类型:
                        <Radio.Group 
                            value={couponType} 
                            onChange={e=>{ setCouponType(e.target.value) }} 
                            style={{ marginBottom: 16 }}
                        >
                            <Radio.Button style={{margin:'10px'}} value={1}>满减券</Radio.Button>
                            <Radio.Button style={{margin:'10px'}} value={2}>折扣券</Radio.Button>
                            <Radio.Button style={{margin:'10px'}} value={3}>商品兑换券</Radio.Button>
                        </Radio.Group>
					</Col>
                </Row>
                    {/* 优惠券名称 */}
                <Row gutter={8}>
					<Col span={12} >
						<Item
							name="name"
							label="优惠券名称"
							rules={[
								{
									required: true,
									message: '请填写优惠券名称',
								},
							]}
						>
							<Input />
						</Item>
					</Col>
				</Row>
                    {/* 优惠券面额 */}
                {
                    couponType!==3?
                    <Row gutter={8}>
                        <Col span={12}>
                            <Item
                                name="faceValue"
                                label="优惠券面额"
                                rules={[
                                    {
                                        required: true,
                                        message: '请填写优惠券面额',
                                    },
                                    {
                                        validator: (rules, value, callback) => {
                                            if(couponType == 1){
                                                const reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/;
                                                if (!reg.test(value)) {
                                                    callback('仅允许输入正数，小数点后最多保留两位');
                                                    return;
                                                }
                                            }
                                            if(couponType == 2){
                                                const reg = /^([1-9]\d?|100)$/;
                                                if (!reg.test(value)) {
                                                    callback('仅允许输入1-100的正整数');
                                                    return;
                                                }
                                            }
                                            callback();
                                        },
                                    },
                                ]}
                            >
                                <Input/>
                            </Item>
                        </Col>
                        <Col span={12}>{couponType==1?'元':'折'}</Col>
                    </Row> : ''
                }
                    {/* 发券数量 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item
                            name="totalNum"
                            label="发券数量"
                            rules={[
                                {
                                    required: totalNumFlag?false:true,
                                    message: '请填写发券数量',
                                },
                                {
                                    validator: (rules, value, callback) => {
                                        if(!totalNumFlag){
                                            const reg = /(^[1-9]\d{0,8}$)/
                                            if (!reg.test(value)) {
                                                callback('券数量仅允许输入9位以内的正整数');
                                                return;
                                            }
                                        }
                                        callback();
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="请输入正整数" disabled={totalNumFlag?true:false}/>
                        </Item>
                    </Col>
                    <Col span={12}>张
                        <div style={{ "lineHeight": "32px", marginLeft:'10px', display:'inline-block' }}>
                            <Checkbox 
                                checked={totalNumFlag}
                                onChange={e=>{
                                    setTotalNumFlag(e.target.checked)
                                }}
                            >不限</Checkbox>
                        </div>
                    </Col>
                </Row>
                    {/* 兑换物品 */}
                {
                    couponType == 3 ? 
                    <Row gutter={8}>
                        <Col span={12}>
                            <Item label={<span><span style={{color:'red'}}>*</span>兑换物品</span>}>
                                <a onClick={()=>{ setExChangeVisible(true) }}>请选择兑换的物品</a>
                            </Item>
                        </Col>
                        {
                            goodsName?<div>已选择：<b>{`${goodsName}x${goodsNum}`}</b></div>:''
                        }
                    </Row>
                    : ''
                }
                <ExChangeModal 
                    visible={exChangeVisible}
                    setVisible={setExChangeVisible}
                    onOk={value=>{
                        setGoodsId(value.choosedId)
                        setGoodsName(value.choosedList.name)
                        setGoodsNum(value.goodsNum)
                    }}
                    goodsId={goodsId}
                />
                    {/* 关联服务项 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            name="serviceType"
                            label="关联服务项"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择关联服务项',
                                },
                            ]}
                            >
                            <Select 
                                disabled 
                                onChange={val=>{
                                    setAssociatedServiceType(val)
                                }}>
                                <Select.Option value={1}>加油</Select.Option>
                                <Select.Option value={20}>洗美装</Select.Option>
                            </Select>
                        </Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={3}></Col>
                    <Col span={9}>
                        <Input.TextArea value={serviceName} disabled style={{marginBottom:'16px',width:'100%'}}/>
                    </Col>
                </Row>
                    {/* 使用门槛 */}
                {/* {
                    couponType !== 3 ?  */}
                    <Row>
                        <Col span={12}>
                            <Item 
                                // style={{width:'200px'}}
                                name="useCondition"
                                label={<div>使用门槛</div>}
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择使用门槛',
                                    },
                                ]}
                            >
                                <Radio.Group 
                                    onChange={e=>{ 
                                        setUseDoorType(e.target.value)
                                    }} 
                                >
                                    <Radio style={radioStyle} value={0}>无门槛</Radio>
                                    <Radio style={radioStyle} value={1}>
                                        <span>订单满</span>
                                        <Item 
                                            name="matchAmount" 
                                            style={{marginLeft:'6px',display:'inline-block'}}
                                            rules={[
                                                { 
                                                    pattern: /(^[1-9]\d{0,8}$)/,
                                                    message: '订单满足金额仅允许输入9位以内的正整数',
                                                },
                                            ]}
                                        >
                                            <Input disabled={useDoorType==0?true:false}/>
                                        </Item>
                                        <span style={{margin:'0 6px'}}>元</span>
                                    </Radio>
                                </Radio.Group>
                            </Item>
                        </Col>
                    </Row> 
                    {/* : '' */}
                {/* }    */}
                    {/* 有效期 */}
                {
                    couponType!==1 ? 
                    <>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Item 
                                    label={
                                    <div>
                                        <span style={{color:'#ff4d4f',marginRight:'6px'}}>*</span>
                                        <span>有效期</span>
                                    </div>
                                }></Item>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{marginTop:'-16px'}}>
                            <Col span={2}></Col>
                            <Col span={8} >
                                <Item labelCol={{ offset: 3 }} wrapperCol={{ span: 24 }} label="开始时间">
                                    <Item name="startTime">
                                        <DatePicker showTime style={{width:'100%'}} disabled={startTimeSign?true:false}/>
                                    </Item>
                                </Item>
                            </Col>
                            <div style={{ "lineHeight": "32px", marginLeft:'10px' }}>
                                <Item name="startLimitFlag" wrapperCol={{ span: 24 }} valuePropName="checked">
                                    <Checkbox onChange={e=>{
                                        setStartTimeSign(e.target.checked)
                                    }}>不限</Checkbox>
                                </Item>
                            </div>
                        </Row>
                        <Row gutter={8}>
                            <Col span={2}></Col>
                            <Col span={8} >
                                <Item name="endTime" labelCol={{  offset: 3 }} wrapperCol={{ span: 24 }} label="结束时间">
                                    <DatePicker showTime style={{width:'100%'}} disabled={endTimeSign?true:false}/>
                                </Item>
                            </Col>
                            <div style={{ "lineHeight": "32px", marginLeft:'10px' }} >
                                <Item name="endLimitFlag" wrapperCol={{ span: 24 }} valuePropName="checked">
                                    <Checkbox onChange={e=>{
                                        setEndTimeSign(e.target.checked)
                                    }}>不限</Checkbox>
                                </Item>
                            </div>
                        </Row>
                    </> : ''
                }
                
                {/* 用券时间 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            label="用券时间"
                            name="effectFlag" 
                            // style={{ display: 'inline-block',marginRight:'20px' }}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择用券时间',
                                },
                            ]}
                        >
                            <Radio.Group 
                                onChange={e=>{ 
                                    // setReceiveLimit(e.target.value)
                                }} 
                                // value={radioValue}
                            >
                                <Radio style={radioStyle} value={0}>
                                    {/* <Item> */}
                                    <RangePicker
                                        allowClear
                                        showTime
                                        // format="YYYY-MM-DD HH:mm:ss"
                                        // defaultValue={[moment('2000-01-01 00:01:01', 'YYYY-MM-DD HH:mm:ss'), moment('2020-12-12 12:12:12', 'YYYY-MM-DD HH:mm:ss')]}
                                        value={useCouponDate}
                                        onChange={c=>{
                                            console.log(11)
                                            if(c&&c[0]&&c[1]){
                                                setUseCouponDate([ c[0], c[1] ])
                                            }else{
                                                setUseCouponDate([])
                                            }
                                        }}
                                    />
                                    {/* </Item> */}
                                </Radio>
                                <Radio style={radioStyle} value={1}>领券后立即可用,无有效期</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                </Row>
              
                
                <div style={{display:'flex',justifyContent:'center'}}>
					<Button type="primary" htmlType="submit" size="large" style={{width:'200px',margin:'0 20px'}}>
						提交
					</Button>
                    <Button type="primary" size="large" style={{width:'200px',margin:'0 20px'}} onClick={()=>{
                        props.history.go(-1)
                    }}>
						取消
					</Button>
				</div>
            </Form>
      	</PageHeaderWrapper>
    );
});

export default connect(
	({ makeGroup, coupon, }) => ({
		
	}),
	dispatch => ({
        // 获取关联服务项列表
        async getAssoiatList(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
			return dispatch({
				type: 'coupon/getAssoiatList',
				payload
			});
        },
        // 优惠券详情页编辑 
        async updateMerchantCouponExtend(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
			return dispatch({
				type: 'coupon/updateMerchantCouponExtend',
				payload
			});
        },
        // 优惠券详情页回显 
        async getMerchantExtendById(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
			return dispatch({
				type: 'coupon/getMerchantExtendById',
				payload
			});
        },
	}),
)(createEditCoupon);
