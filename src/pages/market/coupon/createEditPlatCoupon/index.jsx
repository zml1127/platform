import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Input,
	message,
	Switch,
	Cascader,
	DatePicker,
	Tooltip,
	Select,
	Typography, //复制、编辑、标题文本
	Popconfirm,
	Statistic,
	Modal, // 弹框
	Form,
	Row, Menu, Dropdown,Checkbox,Radio,
	Col, Breadcrumb,Tabs,Tree,TreeSelect,
} from 'antd';
const { TreeNode } = TreeSelect;
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { connect } from 'dva';
import { trimEnd } from 'lodash';
import ExChangeModal from '../components/exChangeModal'
const { RangePicker } = DatePicker
import ProtableSelect from '@/utils/merchantSelect';

const createEditCoupon = memo(props => {
    const { getAssoiatList, createOrUpdate, getPlatCouponInfo, } = props
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
    const [useDoorType, setUseDoorType] = useState(0) //使用门槛 默认1无门槛 2订单满xx元
    const [startTimeSign, setStartTimeSign] = useState(false) //开始时间标志
    const [endTimeSign, setEndTimeSign] = useState(false) //结束时间标志
    const [useCouponDate, setUseCouponDate] = useState([]) //用券时间日期区间
    const [receiveLimit, setReceiveLimit] = useState(0) //领取规则标识1限制，0不限制
    const [limitFlag, setLimitFlag] = useState(0) //领取规则表示，默认不限制不展示下方  1限制，0不限制

    const [selectKey,setSelectKey]=useState([]) //指定参加店铺列表
    const [oilChecked, setOilChecked] = useState([]) //加油关联服务项选中的
    const [washChecked, setWashChecked] = useState([]) //洗美关联服务选中的
    const [goodsName, setGoodsName] = useState('') //选中的兑换品的名字
    const [goodsNum, setGoodsNum] = useState(1) //选中的兑换品的数量
    const [limitNumFlag, setLimitNumFlag] = useState(false) //限制规则领取次数标志
    const [timeFlag, setTimeFlag] = useState(false) //限制规则领取时间标志
    const [partShopFlag, setPartShopFlag] = useState(false) //指定参加店铺下方弹框

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
    },[ associatedServiceType, ])

    const treeChange = useCallback((value,node)=>{
        if(associatedServiceType==1){
            setOilChecked(value)
        }else{
            setWashChecked(value)
        }
    },[ associatedServiceType, ])

    useEffect(()=>{
        if(props.location.query.type == 'add'){
            form.setFieldsValue({
                serviceType: 1, //关联服务项
                useCondition: 0, //使用门槛 0无门槛 有门槛
                receiveLimit: 0, //默认领取人不限制
                userType: 1, //领取人类型 默认0沉默用户 
                effectFlag: 1, //生效标识 1立即生效   0:要选时间
                limitFlag: 0, //领取规则标识1限制，默认0不限制
            })
            setUseDoorType(0) 
            // setUseCouponDate([moment('2000-12-01 23:01:01', 'YYYY-MM-DD HH:mm:ss'), moment('2020-12-12 12:12:12', 'YYYY-MM-DD HH:mm:ss')])
            setLimitFlag(0) //领取规则表示，默认不限制不展示下方  1限制，0不限制
        }else{ //编辑进来的
            getPlatCouponInfo({ id: props.location.query.id }).then(res=>{
                console.log('编辑回显res==', res)
                if(res){
                    setCouponType(res.couponType) //优惠券类型
                    setGoodsId(res.goodsId ? res.goodsId : '') //兑换品id
                    setGoodsName(res.goodsName ? res.goodsName : '') //兑换品名字
                    setGoodsNum(res.goodsNum ? res.goodsNum : 1) //兑换品数量
                    setUseDoorType(res.useCondition ? res.useCondition : 0)
                    setUseCouponDate([res.useStartTime?moment(res.useStartTime, 'YYYY-MM-DD HH:mm:ss'):null, res.useEndTime?moment(res.useEndTime, 'YYYY-MM-DD HH:mm:ss'):null]) //用券时间
                    if(res.totalNum == -1){
                        setTotalNumFlag(true)
                    }
                    if(res.startLimitFlag==0){
                        setStartTimeSign(true)
                    }
                    if(res.endLimitFlag==0){
                        setEndTimeSign(true)
                    }
                    if(res.effectFlag==0){ //生效标识  1立即生效 0选时间
                        setUseCouponDate([res.useStartTime ? moment(res.useStartTime, 'YYYY-MM-DD HH:mm:ss') : null, res.useEndTime ? moment(res.useEndTime, 'YYYY-MM-DD HH:mm:ss') : null])
                    }
                    if(res.userType!==0){ //用户类型0 不限制，1新用户，2普通用户，3活跃用户，4沉默用户
                        setReceiveLimit(1)
                    }
                    if(res.limitFlag==1){ //领取规则标识1限制，0不限制
                        setLimitFlag(1)
                    }
                    if(res.couponServiceList&&res.couponServiceList.length!==0){
                        let list = []
                        res.couponServiceList.map(v=>{
                            list.push(v.serviceId+'_'+v.serviceCateId)
                        })
                        if(res.serviceType==20){
                            setWashChecked(list)
                        }else{
                            setOilChecked(list)
                        }
                    }
                    if(res.serviceType==20){ //洗美装关联服务
                        setAssociatedServiceType(20)
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
                        name: res.name ? res.name : '', //优惠券名称
                        faceValue: res.faceValue ? res.faceValue : '', //优惠券面额
                        totalNum: res.totalNum&&res.totalNum!==-1 ? res.totalNum : '', //发券数量
                        serviceType: res.serviceType ? Number(res.serviceType) : 1, //关联服务项
                        useCondition: res.useCondition ? res.useCondition : 0, //使用门槛 0无门槛 有门槛
                        matchAmount: res.matchAmount ? res.matchAmount : '', //满足面额使用条件
                        startLimitFlag: res.startLimitFlag==0?true : false, //活动开始时间限制标识1限制，0不限制
                        startTime: res.startTime ? moment(res.startTime, 'YYYY-MM-DD HH:mm:ss') : '',
                        endLimitFlag: res.endLimitFlag==0?true:false, 
                        endTime: res.endTime ? moment(res.endTime, 'YYYY-MM-DD HH:mm:ss') : '',
                        receiveLimit: res.userType==0?0:1, //默认领取人不限制
                        userType: res.userType!==0?res.userType:1, //领取人类型 默认0沉默用户
                        effectFlag: res.effectFlag==1?1:0, //生效标识 1立即生效   0:要选时间
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
    },[ ])
    
    // 提交表单
    const handleFinish = useCallback(val=>{ //limitNumFlag timeFlag
        console.log('val==', val)
        let params = {
            couponType,
            name: val.name, //优惠券名称
            effectFlag: val.effectFlag, //生效标识
            limitFlag: val.limitFlag, //领取规则标识1限制，0不限制
        }
        // totalNum: val.totalNum, //发券数量
        if(totalNumFlag){
            params.totalNum = -1 //发券数量
        }else{
            params.totalNum = val.totalNum
        }
        if(props.location.query.type == 'edit'){
            params.id = props.location.query.id
        }
        params.serviceType = val.serviceType //关联服务项 1加油 20洗美装
        if(val.serviceType==1){ //加油
            let arr = []
            if(oilChecked.length!==0){
                for(let i=0;i<oilChecked.length;i++){
                    let obj = {
                        serviceId: oilChecked[i].split('_')[0],
                        serviceCateId: oilChecked[i].split('_')[1],
                    }
                    arr.push(obj)
                }
            }
            params.couponServiceList = arr  //选中的服务列表  oilCheckedList
        }else{
            console.log('washChecked==', washChecked)
            let arr = []
            if(washChecked.length!==0){
                for(let i=0;i<washChecked.length;i++){
                    let obj = {
                        serviceId: washChecked[i].split('_')[0],
                        serviceCateId: washChecked[i].split('_')[1],
                    }
                    arr.push(obj)
                }
            }
            params.couponServiceList = arr 
        }
        if(couponType!==3){ //满减券、折扣券
            params.faceValue = val.faceValue //优惠券面额
            
            params.useCondition = val.useCondition //使用门槛 0 标识无门槛,1-有门槛
            if(val.useCondition==1){
                if(val.matchAmount){
                    if(couponType == 1){
                        if(Number(val.matchAmount) < Number(val.faceValue)){ //满足金额需大于等于优惠券面额
                            message.error('使用门槛满足金额需大于等于优惠券面额')
                            return
                        }
                    }
                    params.matchAmount = val.matchAmount //满足面额使用条件
                }else{
                    message.error('请填写订单满足条件')
                    return
                }
            }
        }
        if(couponType==3){
            params.goodsId = goodsId //兑换品id
            params.goodsNum = goodsNum //兑换品数量
        }
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
                return false
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
                return false
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
        if(val.effectFlag!==1){ //没有立即生效，需要选时间区域
            if(JSON.stringify(useCouponDate)!=='[]'){
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
                        message.error('限购次数需大于等于2')
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
        createOrUpdate(params).then(res=>{
            if(res){
                props.history.go(-1)
            }
        })
    },[ couponType, totalNumFlag, goodsId, goodsNum, useCouponDate, selectKey, oilChecked, washChecked, limitNumFlag, timeFlag, ])
    
    return (
      	<PageHeaderWrapper title={props.location.query.type == 'add' ? '新建平台优惠券' : '编辑平台优惠券'}>
			<Form
                labelCol={ {span:6} }
                style={{ background: "#fff", padding: '10px' }}
                form={form}
                layout="horizontal" // 表单布局
                // initialValues={initialValues} // 表单默认值
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
                                { 
                                    pattern: /^.{1,15}$/,
                                    message: '优惠券名称最多允许输入15个字',
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
                        <Col span={12}>{couponType==1?'元':'%'}</Col>
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
                    <>
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
                    </> : ''
                }
                <ExChangeModal 
                    visible={exChangeVisible}
                    setVisible={setExChangeVisible}
                    onOk={value=>{
                        // console.log('选中结果value==', value, value.choosedList.name)
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
                                disabled={props.location.query.type == 'edit'?true:false}
                                onChange={val=>{
                                    setAssociatedServiceType(val)
                                }}
                            >
                                <Select.Option value={1}>加油</Select.Option>
                                <Select.Option value={20}>洗美装</Select.Option>
                            </Select>
                        </Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={3}></Col>
                    <Col span={9}>
                        <TreeSelect
                            disabled={props.location.query.type == 'edit'?true:false}
                            showSearch
                            style={{ width: '100%' }}
                            value={ associatedServiceType==1?oilChecked:washChecked }
                            // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择"
                            allowClear
                            multiple
                            onChange={treeChange}
                        >
                            {
                                (associatedServiceType==1?assoiatList1:assoiatList20).map(v=>{
                                    return (
                                        <TreeNode value={v.id+'_'+v.parentId} title={v.name} key={v.id+'_'+v.parentId}>
                                            {
                                                v.children&&v.children.length!==0 ? 
                                                v.children.map(c2=>{
                                                    return (
                                                        <TreeNode value={c2.id+'_'+c2.parentId} title={c2.name} key={c2.id+'_'+c2.parentId}>
                                                            {
                                                                c2.children&&c2.children.length!==0 ? 
                                                                    c2.children.map(c3=>{
                                                                        return (
                                                                            <TreeNode value={c3.id+'_'+c3.parentId} title={c3.name} key={c3.id+'_'+c3.parentId}>
                                                                                {
                                                                                    c3.children&&c3.children.length!==0 ? 
                                                                                        c3.children.map(c4=>{
                                                                                            return (
                                                                                                <TreeNode value={c4.id+'_'+c4.parentId} title={c4.name} key={c4.id+'_'+c4.parentId}></TreeNode>
                                                                                            )
                                                                                        })
                                                                                    :''
                                                                                }
                                                                            </TreeNode>
                                                                        )
                                                                    })
                                                                :''
                                                            }
                                                        </TreeNode>
                                                    )
                                                })
                                                    : ''
                                            }
                                        </TreeNode>
                                    )
                                })
                            }
                        </TreeSelect>
                    </Col>
                </Row>
                    {/* 使用门槛 */}
                {
                    couponType !== 3 ? 
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
                    </Row> : ''
                }   
                    {/* 有效期 */}
                {/* <Row>
                    <Col span={12} >
                        <Item label="有效期" labelCol={{  offset: 4 }} wrapperCol={{ span: 24 }}>
                            <Item name="startTime">
                                <DatePicker showTime style={{width:'100%'}} disabled={startTimeSign?true:false}/>
                            </Item>
                        </Item>
                    </Col>
                    <div style={{ "lineHeight": "32px", marginLeft:'6px' }}>开始时间</div>
                    <div style={{ "lineHeight": "32px", marginLeft:'10px' }}>
                        <Item name="startLimitFlag" wrapperCol={{ span: 24 }} valuePropName="checked">
                            <Checkbox onChange={e=>{
                                setStartTimeSign(e.target.checked)
                            }}>不限</Checkbox>
                        </Item>
                    </div>
                </Row>
                <Row>
                    <Col span={12} >
                        <Item name="endTime" wrapperCol={{ span: 20, offset: 6  }}>
                            <DatePicker showTime style={{width:'100%'}} disabled={endTimeSign?true:false}/>
                        </Item>
                    </Col>
                    <div style={{ "lineHeight": "32px", marginLeft:'6px' }}>结束时间</div>
                    <div style={{ "lineHeight": "32px", marginLeft:'10px' }} >
                        <Item name="endLimitFlag" wrapperCol={{ span: 24 }} valuePropName="checked">
                            <Checkbox onChange={e=>{
                                setEndTimeSign(e.target.checked)
                            }}>不限</Checkbox>
                        </Item>
                    </div>
                </Row> */}
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
                            <Radio.Group>
                                <Radio style={radioStyle} value={0}>
                                    <RangePicker
                                        allowClear
                                        showTime
                                        value={useCouponDate}
                                        onChange={c=>{
                                            if(c&&c[0]&&c[1]){
                                                setUseCouponDate([ c[0], c[1] ])
                                            }else{
                                                setUseCouponDate([])
                                            }
                                        }}
                                    />
                                </Radio>
                                <Radio style={radioStyle} value={1}>领券后立即可用,无有效期</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                </Row>
                
                {/* ****限制规则***** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>限制规则</Typography.Title>
                    {/* 领取人限制 */}
                <Row gutter={8}>
                    <Col span={3} style={{textAlign:'right',marginRight:'6px',lineHeight:'32px',marginLeft:'8px'}}>
                        <Item>领取人限制：</Item>
                    </Col>
                    <Col span={4}>
                        <Item 
                            label=""
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
                            <Item name="userType" style={{marginTop:'30px',width:'160px',display:'inline-block'}}>
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
                                style={{display:'flex',marginLeft:'16px'}}
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
                        <Row gutter={8}>
                            <Col span={2}></Col>
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
                        <Row gutter={8}>
                            <Col span={2}></Col>
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
                {/* <div style={{marginLeft:'16px'}}>
                    店铺自由参与： <Checkbox style={{marginRight:'10px'}}/>开启
                </div>
                <div style={{marginLeft:'16px'}}>
                    指定参加店铺： <Checkbox style={{marginRight:'10px'}}/>开启
                </div> */}
                
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            name="freeState" 
                            valuePropName={'checked'}
                            label="店铺自由参与"
                        >
                            <Checkbox style={{marginLeft:'16px'}}>开启</Checkbox>
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
                            <Checkbox style={{marginLeft:'16px'}} onChange={e=>{
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
        // 平台优惠券模板创建或修改 
        async createOrUpdate(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
			return dispatch({
				type: 'coupon/createOrUpdate',
				payload
			});
        },
        // 编辑回显 
        async getPlatCouponInfo(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
			return dispatch({
				type: 'coupon/getPlatCouponInfo',
				payload
			});
        },
	}),
)(createEditCoupon);
