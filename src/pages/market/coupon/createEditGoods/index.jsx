import {
	Button,
	Input,
	message,
	DatePicker,
	Select,
	Typography, //复制、编辑、标题文本
	Form,
	Row, Checkbox,Radio,
	Col,TreeSelect,Upload,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'dva';
import ProtableSelectGoods from '@/utils/merchantSelectGoods';
const { RangePicker } = DatePicker
const { TreeNode } = TreeSelect;
import OSS from 'ali-oss';

const createEditGoods = memo(props => {
    const { getAssoiatList, getStsToken, ossToken, getGoodsInfo, create, updateGoods, getMerchantList, } = props
    const { Item, useForm } = Form;
	const [form] = useForm();
    const { submit, setFieldsValue, resetFields } = form;
    const radioStyle = {display: 'block',height: '30px',lineHeight: '30px'};
    const [totalNumFlag, setTotalNumFlag] = useState(false) //发券数量不限标识
    const [assoiatList20, setAssoiatList20] = useState([]) //关联服务项下方列表
    const [washChecked, setWashChecked] = useState('')
    const [startTimeSign, setStartTimeSign] = useState(false) //开始时间标志
    const [endTimeSign, setEndTimeSign] = useState(false) //结束时间标志
    const [useCouponDate, setUseCouponDate] = useState([]) //用券时间日期区间
    const [imgUrl, setImgUrl] = useState("") //图片
    const [receiveLimit, setReceiveLimit] = useState(0) //领取规则标识1限制，0不限制
    const [limitNumFlag, setLimitNumFlag] = useState(false) //够买规则领取次数标志
    const [limitFlag, setLimitFlag] = useState(0) //领取规则表示，默认不限制不展示下方  1限制，0不限制
    const [timeFlag, setTimeFlag] = useState(false) //限制规则领取时间标志
    const [ownerMerchantId, setOwnerMerchantId] = useState('') //店铺选中项
    const [ownerMerchantList, setOwnerMerchantList] = useState('') //店铺选中项详细信息
    const [ownerMerchantName, setOwnerMerchantName] = useState('') //店铺选中项的名字

    useEffect(()=>{
        getStsToken()
    },[])

    useEffect(()=>{
        if(props.location.query.type == 'add'){
            form.setFieldsValue({
                effectFlag: 1, //生效标识 1立即生效   0:要选时间
                receiveLimit: 0, //领取人限制
                limitFlag: 0, //购买规则标识1限制，默认0不限制
            })
            setLimitFlag(0)
        }else{
            getGoodsInfo({ id: props.location.query.id }).then(res=>{
                console.log('回显结果res=', res)
                if(res){
                    if(res.totalNum == -1){
                        setTotalNumFlag(true)
                    }
                    setWashChecked(res.serviceCateId) 
                    if(!res.buyStartTime){ //有效期开始时间标识
                        setStartTimeSign(true)
                    }
                    if(!res.buyEndTime){ //有效期结束时间标识
                        setEndTimeSign(true)
                    }
                    if(res.useStartTime || res.useEndTime){ //用券开始时间、用券结束时间
                        setUseCouponDate([res.useStartTime ? moment(res.useStartTime, 'YYYY-MM-DD HH:mm:ss') : null, res.useEndTime ? moment(res.useEndTime, 'YYYY-MM-DD HH:mm:ss') : null])
                    }
                    if(res.headPic){ //商品券头图
                        setImgUrl(res.headPic)
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
                    if(res.ownerMerchantId){
                        setOwnerMerchantId(res.serviceId)
                        setOwnerMerchantList({ id: res.serviceId, merchantId: res.ownermerchantId })
                    }
                    // setOwnerMerchantId('1295959611504857090')
                    if(res.ownerMerchantName){
                        setOwnerMerchantName(res.ownerMerchantName)
                    }
                    // params.serviceId = ownerMerchantList.id
                    // params.ownermerchantId = ownerMerchantList.merchantId
                    form.setFieldsValue({
                        name: res.name ? res.name : '', //商品券名称
                        thirdPrice: res.thirdPrice ? res.thirdPrice : '',//商品券原价
                        price: res.price ? res.price : '',//商品券优惠价
                        commissionAmount: res.commissionAmount ? res.commissionAmount : '', //返佣价
                        totalNum: res.totalNum&&res.totalNum!==-1 ? res.totalNum : '', //发券数量
                        buyStartTime: res.buyStartTime ? moment(res.buyStartTime, 'YYYY-MM-DD HH:mm:ss') : '', //有效期开始时间
                        buyEndTime: res.buyEndTime ? moment(res.buyEndTime, 'YYYY-MM-DD HH:mm:ss') : '', //有效期结束时间
                        startLimitFlag: res.buyStartTime ? false : true, //开始时间限制标识
                        endLimitFlag: res.buyEndTime ? false : true, //结束时间限制标识
                        effectFlag: (!res.useStartTime && !res.useEndTime) ? 1 : 0, //用券时间标识
                        receiveLimit: res.userType==0 ? 0 : 1, //默认领取人不限制
                        userType: res.userType !== 0 ? res.userType : 1, //领取人类型 默认0沉默用户
                        limitFlag: res.limitFlag ? res.limitFlag : 0, //领取规则标识1限制，默认0不限制
                        limitNum: res.ruleList&&res.ruleList.length!==0&&res.ruleList[0].limitNum&&res.ruleList[0].limitNum!==-1 ? res.ruleList[0].limitNum : '',//限购人次-1表示不限制，正整数表示限购
                        day: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].day||res.ruleList[0].day==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].day : '',
                        hour: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].hour||res.ruleList[0].hour==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].hour : '',
                        minute: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].minute||res.ruleList[0].minute==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].minute : '',
                    })
                }
            })
        }
    },[])

    useEffect(()=>{
        getAssoiatList({ pid: 20 }).then(res=>{
            if(res){
                setAssoiatList20(res)
            }
        })
    },[  ])

    const getUrl = useCallback((file, type) => {
        if (ossToken.expiration > Date.now()) {
            // 没有过期
            const client = new OSS({
                region: ossToken.region,
                accessKeyId: ossToken.accesKeyId, 
                accessKeySecret: ossToken.accesKeySecret, 
                stsToken: ossToken.securityToken, 
                bucket: ossToken.bucket, 
            });
            client.put(`/goods${Date.now()}`, file)
            .then(function(rl) {
                setImgUrl(rl.url);
                // setFieldsValue({imgUrl:rl.url})
            })
            .catch(err => {});
        } else {
            getStsToken().then(res => {
                if (res.code === '0000') {
                    getUrl(file, type);
                }
            });
        }
    },[ossToken]);

    const treeChange = useCallback((value,node)=>{
        setWashChecked(value)
    },[  ])
    
    const beforeUpload = useCallback(
		(file, type) => {
			if (!['image/png','image/jpeg'].includes(file.type)) {
				message.error("请选择JPEG、JPG、PNG格式图片");
			}else{
				getUrl(file, type);
			}
		},
		[ossToken],
    );
    
    // 提交表单
    const handleFinish = useCallback(val=>{
        console.log('val==', val)
        let params = {
            name: val.name, //商品券名称
            thirdPrice: val.thirdPrice, //商品券原价
            price: val.price, //商品券优惠价
            commissionAmount: val.commissionAmount, // 返佣价
            // effectFlag: val.effectFlag, //生效标识
            serviceType: 20, 
            headPic: imgUrl, //商品券头图
            receiveLimit: val.receiveLimit, //领取人限制
            limitFlag: val.limitFlag, //购买规则
            source: 4,
        }
        
        if(totalNumFlag){
            params.totalNum = -1 //发券数量
        }else{
            params.totalNum = val.totalNum
        }
        params.serviceCateId = washChecked
        if((!val.startLimitFlag && !val.buyStartTime) || (!val.endLimitFlag && !val.buyEndTime)){
            message.error('请选择有效期')
            return false
        }
        if(val.startLimitFlag){  //开始时间
            // params.startLimitFlag = 0 //调上不限制
        }else{
            // params.startLimitFlag = 1 //开始时间限制
            if(val.buyStartTime){
                params.buyStartTime =  moment(val.buyStartTime._d).format('YYYY-MM-DD HH:mm:ss')
            }else{
                message.error('请选择开始时间')
                return false
            }
        }
        if(val.endLimitFlag){ //结束时间
            // params.endLimitFlag = 0 //调上不限制
        }else{
            // params.endLimitFlag = 1 //结束时间限制
            if(val.buyEndTime){
                params.buyEndTime = moment(val.buyEndTime._d).format('YYYY-MM-DD HH:mm:ss')
            }else{
                message.error('请选择结束时间')
                return false
            }
        }
        if(!val.startLimitFlag){
            if(new Date(moment(val.buyStartTime._d).format('YYYY-MM-DD HH:mm:ss')).getTime() < Date.now()){
                message.error('开始时间需大于等于当前时间')
                return
            }
        }
        if(!val.startLimitFlag && !val.endLimitFlag){ //开始时间和结束时间都有
            if(new Date(moment(val.buyStartTime._d).format('YYYY-MM-DD HH:mm:ss')).getTime() > new Date(moment(val.buyEndTime._d).format('YYYY-MM-DD HH:mm:ss')).getTime()){ //开始时间大于结束时间
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
        if(val.receiveLimit==1){ //用户类型0 不限制，1新用户，2普通用户，3活跃用户，4沉默用户
            if(val.userType){
                params.userType = val.userType
            }else{
                message.error('请选择购买人类型')
                return
            }
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
        if(ownerMerchantId && ownerMerchantList){
            // params.ownerMerchantId = ownerMerchantId
            params.serviceId = ownerMerchantList.id
            params.ownermerchantId = ownerMerchantList.merchantId
        }else{
            message.error('请选择店铺')
            return
        }
        if(props.location.query.type == 'add'){
            create(params).then(res=>{
                console.log('商品券提交表单res=', res)
                if(res){
                    props.history.go(-1)
                }
            })
        }
        if(props.location.query.type == 'edit'){
            params.id = props.location.query.id
            updateGoods(params).then(res=>{
                console.log('商品券编辑提交表单res=', res)
                if(res){
                    props.history.go(-1)
                }
            })
        }
        console.log('params参数==', params)
    },[ totalNumFlag, useCouponDate, imgUrl, limitNumFlag, timeFlag, washChecked, ownerMerchantId, ownerMerchantList ])

    return (
          <PageHeaderWrapper 
            title={props.location.query.type == 'add' ? '新建商品券' : (props.location.query.type == 'edit' ? '编辑商品券' : '查看商品券')}
          >
			<Form
                labelCol={ {span:6} }
                ylest={{ background: "#fff", padding: '10px' }}
                form={form}
                layout="horizontal" // 表单布局
                onFinish={handleFinish} // 提交表单且数据验证成功后回调事件
            >
                {/* ****基本信息***** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>基本信息</Typography.Title>
                <Row gutter={8}>
					<Col span={12} >
						<Item
							name="name"
							label="商品券名称"
							rules={[
								{
									required: true,
									message: '请填写商品券名称',
                                },
                                { 
                                    pattern: /^.{1,15}$/,
                                    message: '商品券名称最多允许输入15个字',
                                },
							]}
						>
							<Input placeholder="请输入商品券名称"/>
						</Item>
					</Col>
				</Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Item
                            name="thirdPrice"
                            label="商品券原价"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写商品券原价',
                                },
                                {
                                    validator: (rules, value, callback) => {
                                        const reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/
                                        if (!reg.test(value)) {
                                            callback('仅允许输入正数，小数点后最多保留两位');
                                            return;
                                        }
                                        if(value > 99999){
                                            callback('最大值允许输入99999')
                                            return
                                        }
                                        callback();
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="0.00"/>
                        </Item>
                    </Col>
                    <Col span={12}>元</Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Item
                            name="price"
                            label="商品券优惠价"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写商品券优惠价',
                                },
                                {
                                    validator: (rules, value, callback) => {
                                        const reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/;
                                        if (!reg.test(value)) {
                                            callback('仅允许输入正数，小数点后最多保留两位');
                                            return;
                                        }
                                        if(value > 99999){
                                            callback('最大值允许输入99999')
                                            return
                                        }
                                        callback();
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="0.00"/>
                        </Item>
                    </Col>
                    <Col span={12}>元</Col>
                </Row>
                <Row gutter={8}>
                    <Col span={12}>
                        <Item
                            name="commissionAmount"
                            label="返佣价"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写返佣价',
                                },
                                {
                                    validator: (rules, value, callback) => {
                                        const reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/;
                                        if (!reg.test(value)) {
                                            callback('仅允许输入正数，小数点后最多保留两位');
                                            return;
                                        }
                                        callback();
                                    },
                                },
                            ]}
                        >
                            <Input placeholder="0.00"/>
                        </Item>
                    </Col>
                    <Col span={12}>元</Col>
                </Row>
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
                                            // const reg = /(^[1-9]\d{0,8}$)/
                                            const reg = /(^[1-9]\d{0,4}$)/
                                            if (!reg.test(value)) {
                                                callback('发券数量仅允许输入1-99999的正整数');
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
                {/* 关联服务项 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            // name="serviceType"
                            label="关联服务项"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择关联服务项',
                                },
                            ]}
                            >
                                <Input value="洗美装" disabled/>
                        </Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={3}></Col>
                    <Col span={9}>
                        <TreeSelect
                            disabled={props.location.query.type !== 'add'?true:false}
                            showSearch
                            style={{ width: '100%' }}
                            value={ washChecked }
                            placeholder="请选择"
                            allowClear
                            // multiple  多选
                            onChange={treeChange}
                        >
                            {
                                assoiatList20.map(v=>{
                                    return (
                                        <TreeNode value={v.id} title={v.name} key={v.id}>
                                            {
                                                v.children&&v.children.length!==0 ? 
                                                v.children.map(c2=>{
                                                    return (
                                                        <TreeNode value={c2.id} title={c2.name} key={c2.id}>
                                                            {
                                                                c2.children&&c2.children.length!==0 ? 
                                                                    c2.children.map(c3=>{
                                                                        return (
                                                                            <TreeNode value={c3.id} title={c3.name} key={c3.id}>
                                                                                {
                                                                                    c3.children&&c3.children.length!==0 ? 
                                                                                        c3.children.map(c4=>{
                                                                                            return (
                                                                                                <TreeNode value={c4.id} title={c4.name} key={c4.id}></TreeNode>
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
                            <Item name="buyStartTime">
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
                        <Item name="buyEndTime" labelCol={{  offset: 3 }} wrapperCol={{ span: 24 }} label="结束时间">
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
                            rules={[
                                {
                                    required: true,
                                    message: '请选择用券时间',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio 
                                    style={radioStyle} 
                                    value={0}
                                >
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
                {/* 商品券头图 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item label={
                            <div>
                                <span style={{color:'#ff4d4f',marginRight:'6px',fontWeight:'bold'}}>*</span>
                                <span>商品券头图</span>
                            </div>
                        }
                            // name="imgUrl"
                            rules={[{ required: true, message: '请选择图片' }]}
                        >
                            <Upload 
                                beforeUpload={file => beforeUpload(file, 'goods')} 
                                name="file" 
                                showUploadList={false} 
                                listType="picture-card"
                                fileList={[imgUrl]}
                                onChange={({ file, fileList }) => {
                                    // if (file.status === 'removed') {
                                    //     setImgUrl([])
                                    // }
                                }}>
                                <div style={{ border: 'dashed 2px #eee', width: 150, height: 150}}>
                                    {imgUrl ? <img src={imgUrl} style={{ width: 150, height: 150,}} /> : <PlusOutlined style={{position:'absolute',left:75,top:75}}/>}
                                </div>
                            </Upload>
                            <div style={{color:"red",fontSize:"12px"}}>注：请选择JPEG、JPG、PNG格式图片</div>
                        </Item>
                    </Col>
                </Row>
                {/* ****限制规则***** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>限制规则</Typography.Title>
                <Row gutter={8}>
                    <Col span={3} style={{textAlign:'right',marginRight:'6px',lineHeight:'32px',marginLeft:'8px'}}>
                        <Item>购买人限制：</Item>
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
                                <Radio style={radioStyle} value={0}>不限制购买人</Radio>
                                <Radio style={radioStyle} value={1}>选择购买人</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                    <Col>
                        { receiveLimit == 1 ?
                            <Item name="userType" style={{marginTop:'30px',width:'160px',display:'inline-block'}}>
                                <Select>
                                    <Select.Option value={1}>新用户</Select.Option>
                                    <Select.Option value={2}>普通用户</Select.Option>
                                    <Select.Option value={3}>活跃用户</Select.Option>
                                    <Select.Option value={4}>沉默用户</Select.Option>
                                </Select>
                            </Item> 
                        : '' }
                    </Col>
                </Row>
                    {/* 领取规则 */}
                    <Row gutter={8}>
                    {/* <span style={{verticalAlign:'middle',marginLeft:'40px'}}>领取规则&nbsp;&nbsp;</span> */}
                    <Col span={12}>
                        <Item 
                            label="购买规则"
                            name="limitFlag" 
                            // style={{ display: 'inline-block',marginRight:'20px' }}
                            rules={[
								{
									required: true,
									message: '请选择购买规则',
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
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>商品券每人可购买</span>
                            <Item 
                                name="limitNum" 
                                style={{ display: 'inline-block'}}
                                rules={[
                                    { 
                                        pattern: /(^[1-9]\d{0,8}$)/,
                                        message: '商品券领取次数仅允许输入9位以内的正整数',
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
                                <Checkbox 
                                    checked={timeFlag} 
                                    onChange={e=>{
                                        setTimeFlag(e.target.checked)
                                    }}
                                />
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
                                <Select 
                                    style={{width:'60px'}} 
                                    disabled={timeFlag?false:true}
                                >
                                    {
                                        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(v=>{
                                            return <Select.Option value={v} key={v}>{v}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>时</span>
                            <Item name="minute">
                                <Select 
                                    style={{width:'60px'}} 
                                    disabled={timeFlag?false:true}
                                >
                                    {
                                        [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59].map(v=>{
                                            return <Select.Option value={v} key={v}>{v}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>分再次购买</span>
                        </Row>
                    </> : ''
                }
                {/* ******店铺设置****** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>店铺设置</Typography.Title>
                <ProtableSelectGoods 
                    washChecked={washChecked}
                    initalId={ownerMerchantId}
                    ownerMerchantName={ownerMerchantName}
                    onOk={value=>{
                        setOwnerMerchantId(value.choosedId)
                        setOwnerMerchantList(value.choosedList)
                    }}
                />
            

            <div style={{display:'flex',justifyContent:'center'}}>
                {
                    props.location.query.type !== 'look' ? 
                    <Button type="primary" htmlType="submit" size="large" style={{width:'200px',margin:'0 20px'}}>提交</Button> : null
                }
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
	({ makeGroup, coupon, global, }) => ({
		ossToken: global.ossToken,
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
        async getStsToken (){
			return dispatch({
				type: 'global/getStsToken',
			});
        },
         // 编辑查看回显 
        async getGoodsInfo(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
			return dispatch({
				type: 'coupon/getGoodsInfo',
				payload
			});
        },
        // 提交表单
        async create(payload, type) {
			return dispatch({
				type: 'coupon/create',
				payload
			});
        },
        // 商品券编辑提交表单 
        async updateGoods(payload, type) {
			return dispatch({
				type: 'coupon/updateGoods',
				payload
			});
        },
        async getMerchantList(payload) { //获取店铺列表
            const params = { ...payload };
            if(!(params.merchantTypeId)){
                delete params.merchantTypeId;
            }
            return dispatch({
                type: 'merchant/getMerchantGoodsList',
                payload: {
                    ...params,
                },
            });
        },
	}),
)(createEditGoods);
