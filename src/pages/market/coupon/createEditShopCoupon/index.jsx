import {
	Button,
	Input,
	message,
	DatePicker,
	Select,
	Typography, //复制、编辑、标题文本
	Form,
	Row, Checkbox,Radio,
	Col,
} from 'antd';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'dva';
import ProtableSelect from '@/utils/merchantSelect';

const createEditCoupon = memo(props => {
    const { createOrUpdateShop, getServiceCategoryList, getShopCouponInfo, } = props
    const { Item, useForm } = Form;
	const [form] = useForm();
    const { submit, setFieldsValue, resetFields } = form;
    const radioStyle = {display: 'block',height: '30px',lineHeight: '30px'};

    const [couponType, setCouponType] = useState(1) //优惠券类型 1:满减券 2:折扣券 3:商品兑换券
    const [serviceCateList, setServiceCateList] = useState([]) //服务类型列表
     
    const [startTimeSign, setStartTimeSign] = useState(false) //开始时间标志
    const [endTimeSign, setEndTimeSign] = useState(false) //结束时间标志
    const [receiveLimit, setReceiveLimit] = useState(0) //领取规则标识1限制，0不限制
    const [limitFlag, setLimitFlag] = useState(0) //领取规则表示，默认不限制不展示下方  1限制，0不限制

    const [selectKey,setSelectKey]=useState([]) //指定参加店铺列表
    const [limitNumFlag, setLimitNumFlag] = useState(false) //限制规则领取次数标志
    const [timeFlag, setTimeFlag] = useState(false) //限制规则领取时间标志
    const [partShopFlag, setPartShopFlag] = useState(false) //指定参加店铺下方弹框

    useEffect(()=>{
        if(props.location.query.type == 'add'){
            form.setFieldsValue({
                receiveLimit: 0, //默认领取人不限制
                userType: 1, //领取人类型 默认0沉默用户
                limitFlag: 0, //领取规则标识1限制，默认0不限制
            })
            setLimitFlag(0) //领取规则表示，默认不限制不展示下方  1限制，0不限制
        }else{
            getShopCouponInfo({ id: props.location.query.id||222 }).then(res=>{
                console.log('店铺编辑回显res哦哦哦==', res)
                if(res){
                    setCouponType(res.couponType) //优惠券类型
                    if(res.startLimitFlag==0){
                        setStartTimeSign(true)
                    }
                    if(res.endLimitFlag==0){
                        setEndTimeSign(true)
                    }
                    if(res.userType!==0){ //用户类型0 不限制，1新用户，2普通用户，3活跃用户，4沉默用户
                        setReceiveLimit(1)
                    }
                    if(res.limitFlag==1){ //领取规则标识1限制，0不限制
                        setLimitFlag(1)
                    }
                    if(res.ruleList&&res.ruleList.length!==0&&res.ruleList[0].limitNum&&res.ruleList[0].limitNum!==-1){ // 领取规则领取次数
                        setLimitNumFlag(true)
                    }
                    if(res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].day||res.ruleList[0].day==0)&&res.ruleList[0].delayedMinute!==-1){
                        setTimeFlag(true)
                    }
                    if(res.specifiedMerchantFlag==1){ //指定参加店铺参与标识1开启，0未开启
                        setPartShopFlag(true)
                    }
                    if(res.merchantListId&&JSON.stringify(res.merchantListId)!=='[]'){
                        setSelectKey(res.merchantListId) //选择的店铺组件回显
                    }
                    form.setFieldsValue({
                        name: res.name, //模板名称 
                        serviceCateId: res.serviceCateId, //服务类型id
                        startLimitFlag: res.startLimitFlag==0?true : false, //活动开始时间限制标识1限制，0不限制
                        startTime: res.startTime ? moment(res.startTime, 'YYYY-MM-DD HH:mm:ss') : '',
                        endLimitFlag: res.endLimitFlag==0?true:false, 
                        endTime: res.endTime ? moment(res.endTime, 'YYYY-MM-DD HH:mm:ss') : '',
                        receiveLimit: res.userType==0?0:1, //默认领取人不限制
                        userType: res.userType!==0?res.userType:1, //领取人类型 默认0沉默用户
                        // effectFlag: res.effectFlag==1?1:0, //生效标识 1立即生效   0:要选时间
                        limitFlag: res.limitFlag ? res.limitFlag : 0, //领取规则标识1限制，默认0不限制
                        limitNum: res.ruleList&&res.ruleList.length!==0&&res.ruleList[0].limitNum&&res.ruleList[0].limitNum!==-1 ? res.ruleList[0].limitNum : '',//限购人次-1表示不限制，正整数表示限购
                        day: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].day||res.ruleList[0].day==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].day : '',
                        hour: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].hour||res.ruleList[0].hour==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].hour : '',
                        minute: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].minute||res.ruleList[0].minute==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].minute : '',
                        freeState: res.freeState==1?true:false, //店铺自由参与
                        specifiedMerchantFlag: res.specifiedMerchantFlag==1?true:false,//指定参加店铺
                    })
                }
            })
        }
    },[])

    useEffect(()=>{
        getServiceCategoryList().then(res=>{ //获取服务类型列表
            if(res){
                setServiceCateList(res)
            }
        })
    },[])
    
    // 提交表单
    const handleFinish = useCallback(val=>{
        console.log('val==', val)
        let params = {
            name: val.name, //模板名称
            couponType,
            serviceCateId: val.serviceCateId, //服务类型id
            limitFlag: val.limitFlag, //领取规则标识1限制，0不限制
        }
        if(props.location.query.type=="edit"){
            params.id = props.location.query.id
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
        if(!val.startLimitFlag){
            if(new Date(moment(val.startTime._d).format('YYYY-MM-DD HH:mm:ss')).getTime() < Date.now()){
                message.error('开始时间需大于等于当前时间')
                return
            }
        }
        if(!val.startLimitFlag && !val.endLimitFlag){ //开始时间和结束时间都有
            if(new Date(moment(val.startTime._d).format('YYYY-MM-DD HH:mm:ss')).getTime() > new Date(moment(val.endTime._d).format('YYYY-MM-DD HH:mm:ss')).getTime()){ //开始时间大于结束时间
                message.error('开始时间需小于结束时间')
                return 
            }
        }
        if(val.receiveLimit==1){ //用户类型0 不限制，1新用户，2普通用户，3活跃用户，4沉默用户
            params.userType = val.userType
        }else{
            params.userType = 0  //不限制
        }
        if(val.limitFlag==1){ //领取规则选了限制
            let limitObj = {}
            if(!(limitNumFlag || timeFlag)){
                message.error('请填写限制规则')
                return
            }else{
                if(limitNumFlag&&timeFlag){
                    if(val.limitNum<2){
                        message.error('领取次数需大于等于2')
                        return
                    }
                }
                if(limitNumFlag){ //勾选了领取次数
                    if(val.limitNum){
                        limitObj.limitNum = val.limitNum //限购人次-1表示不限制，正整数表示限购人次
                    }else{
                        message.error('请填写领取次数')
                        return 
                    }
                }else{
                    limitObj.limitNum = -1 //不限制
                }
                if(timeFlag){
                    if((val.day||val.day==0) && (val.hour||val.hour==0) && (val.minute||val.minute==0)){
                        limitObj.day = val.day
                        limitObj.hour = val.hour
                        limitObj.minute = val.minute
                    }else{
                        message.error('请填写限制时间')
                        return
                    }
                }else{
                    limitObj.delayedMinute = -1
                }
                params.ruleList = [limitObj]
            }
        }
        if(!(val.freeState||val.specifiedMerchantFlag)){
            message.error('请选择店铺设置')
            return 
        }
        if(val.freeState){
            params.freeState = 1 //店铺自由参与标识1开启，0未开启
        }else{
            params.freeState = 0 //店铺自由参与标识1开启，0未开启
        }
        if(val.specifiedMerchantFlag){
            params.specifiedMerchantFlag = 1  //指定参加店铺参与标识1开启，0未开启
            params.merchantListId = selectKey //选中的店铺的id集合
        }else{
            params.specifiedMerchantFlag = 0  //指定参加店铺参与标识1开启，0未开启
        }
        
        console.log('参数params==', params)
        createOrUpdateShop(params).then(res=>{
            if(res){
                message.success('提交成功')
                props.history.go(-1)
            }
        })
    },[ couponType, selectKey, limitNumFlag, timeFlag, ])
    
    return (
      	<PageHeaderWrapper title={props.location.query.type == 'add' ? '新建店铺优惠券' : '编辑店铺优惠券'}>
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
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            name="name"
                            label="模板名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写模板名称',
                                },
                            ]}
                            >
                            <Input />
                        </Item>
                    </Col>
                </Row>
                    {/* 服务类型 */}
                <Row gutter={8}>
					<Col span={12}>
                        <Item 
                            label="服务类型" 
                            name="serviceCateId"
                            rules={[
								{
									required: true,
									message: '请选择服务类型',
								},
							]}
                        >
                            <Select>
                                {
                                    serviceCateList.map(v=>{
                                        return <Select.Option key={v.id} value={v.id}>{v.name}</Select.Option>
                                    })
                                }
                                
                            </Select>
                        </Item>
					</Col>
                </Row>
                    {/* 有效期 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            label={
                            <div>
                                <span style={{color:'#ff4d4f',marginRight:'6px',fontWeight:'bold'}}>*</span>
                                <span>有效期</span>
                            </div>
                        }></Item>
                    </Col>
                </Row>
                <Row gutter={8} style={{marginTop:'-16px'}}>
                    <Col span={2}></Col>
                    <Col span={8}>
                        <Item labelCol={{  offset: 3 }} wrapperCol={{ span: 24 }} label="开始时间">
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
                {/* ****限制规则***** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>限制规则</Typography.Title>
                    {/* 领取人限制 */}
                <Row gutter={8}>
                    <Col span={3} style={{textAlign:'right',marginRight:'6px',lineHeight:'32px'}}>
                        领取人限制：
                    </Col>
                    <Col span={4}>
                        <Item 
                            name="receiveLimit" 
                            style={{ display: 'inline-block',marginRight:'20px' }}
                        >
                            <Radio.Group 
                                onChange={e=>{ 
                                    setReceiveLimit(e.target.value)
                                }} 
                                // value={radioValue}
                            >
                                <Radio style={radioStyle} value={0}>不限制领取人</Radio>
                                <Radio style={radioStyle} value={1}>选择领取人</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                    <Col>
                        {
                            receiveLimit == 1 ?
                            <Item name="userType" style={{marginTop:'30px',width:'160px'}}>
                                <Select>
                                    <Select.Option value={1}>新用户</Select.Option>
                                    <Select.Option value={2}>普通用户</Select.Option>
                                    <Select.Option value={3}>活跃用户</Select.Option>
                                    <Select.Option value={4}>沉默用户</Select.Option>
                                </Select>
                            </Item> : ''
                        }
                    </Col>
                    
				</Row>
                    {/* 领取规则 */}
                <Row gutter={8}>
                    {/* <span style={{verticalAlign:'middle',marginLeft:'40px'}}>领取规则&nbsp;&nbsp;</span> */}
                    <Col span={12}>
                        <Item 
                            label="领取规则"
                            name="limitFlag" 
                            // style={{ display: 'inline-block',marginRight:'20px' }}
                            rules={[
								{
									required: true,
									message: '请选择领取规则',
								},
							]}
                        >
                            <Radio.Group 
                                style={{display:'flex',marginLeft:'8px'}}
                                onChange={e=>{ 
                                    setLimitFlag(e.target.value)
                                }} 
                            >
                                <Radio style={radioStyle} value={0}>不限制</Radio>
                                <Radio style={radioStyle} value={1}>限制</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
				</Row>
                {
                    limitFlag==1 ? 
                    <>
                        <Row gutter={8} style={{marginLeft:'100px'}}>
                            <Item valuePropName="checked"> 
                                <Checkbox checked={limitNumFlag} onChange={e=>{
                                    setLimitNumFlag(e.target.checked)
                                }}/>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>优惠券每人可领取</span>
                            <Item 
                                name="limitNum" 
                                style={{ display: 'inline-block'}}
                                rules={[
                                    { 
                                        pattern: /(^[1-9]\d{0,8}$)/,
                                        message: '优惠券领取次数仅允许输入9位以内的正整数',
                                    },
                                ]}
                            >
                                <Input disabled={limitNumFlag?false:true}/>
                            </Item>
                            <span style={{lineHeight:'32px',marginLeft:'6px'}}>次</span>
                        </Row>
                        <Row gutter={8} style={{marginLeft:'100px'}}>
                            <Item valuePropName="checked"> 
                                <Checkbox checked={timeFlag} onChange={e=>{
                                    setTimeFlag(e.target.checked)
                                }}/>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>可在</span>
                            <Item name="day">
                                <Select style={{width:'60px'}} disabled={timeFlag?false:true}>
                                    {
                                        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30].map(v=>{
                                            return <Select.Option value={v} key={v}>{v}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>天</span>
                            <Item name="hour">
                                <Select style={{width:'60px'}} disabled={timeFlag?false:true}>
                                    {
                                        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(v=>{
                                            return <Select.Option value={v} key={v}>{v}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>时</span>
                            <Item name="minute">
                                <Select style={{width:'60px'}} disabled={timeFlag?false:true}>
                                    {
                                        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59].map(v=>{
                                            return <Select.Option value={v} key={v}>{v}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>分再次领取</span>
                        </Row>
                    </> : ''
                }
                {/* ******店铺设置****** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>店铺设置</Typography.Title>
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            name="freeState" 
                            valuePropName={'checked'}
                            label="店铺自由参与"
                        >
                            <Checkbox style={{marginLeft:'8px'}}>开启</Checkbox>
                        </Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            name="specifiedMerchantFlag" 
                            valuePropName={'checked'}
                            label="指定参加店铺"
                        >
                            <Checkbox style={{marginLeft:'8px'}} onChange={e=>{
                                setPartShopFlag(e.target.checked)
                            }}>开启</Checkbox>
                        </Item>
                    </Col>
                </Row>
                {
                    partShopFlag ? <ProtableSelect setRowKeys={setSelectKey} selectKey={selectKey} pageSize={20}/> : ''
                }
                
                <div style={{display:'flex',justifyContent:'center'}}>
					<Button type="primary" htmlType="submit" size="large" style={{width:'200px',margin:'0 20px'}}>
						提交
					</Button>
                    <Button type="primary" size="large" style={{width:'200px',margin:'0 20px'}} onClick={()=>{props.history.go(-1)}}>
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
        // 店铺优惠券模板创建或修改 
        async createOrUpdateShop(payload, type) {
			return dispatch({
				type: 'coupon/createOrUpdateShop',
				payload
			});
        },
        // 获取服务类型列表 
        async getServiceCategoryList(payload, type) {
			return dispatch({
				type: 'coupon/getServiceCategoryList',
			});
        },
        // 店铺优惠券编辑回显 
        async getShopCouponInfo(payload, type) {
			return dispatch({
                type: 'coupon/getShopCouponInfo',
                payload,
			});
        },
	}),
)(createEditCoupon);
