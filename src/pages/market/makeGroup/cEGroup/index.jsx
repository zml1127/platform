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
	Col, Breadcrumb,Tabs,Tree,
} from 'antd';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'dva';
import moment from 'moment';
const { TabPane } = Tabs;
import ProtableSelect from '@/utils/merchantSelect';

const cEGroup = memo(props => {
    const { getGroupTplInfo, createOrUpdate, serviceCategoryList, loading, } = props
    const { Item, useForm } = Form;
	const [form] = useForm();
    const { submit, setFieldsValue, resetFields } = form;
    const actionRef = useRef();
    const radioStyle = {display: 'block',height: '30px',lineHeight: '30px'};
    const [startTimeDis, setStartTimeDis] = useState(false) //开始时间标志
    const [endTimeDis, setEndTimeDis] = useState(false) //结束时间标志
    const [autoGroup, setAutoGroup] = useState(false) //自动补团开启
    const [limitFlag, setLimitFlag] = useState(0) //限购表示 1限购 0不限购
    const [selectKey,setSelectKey]=useState([]) //指定参加店铺列表
    const [limitNumFlag, setLimitNumFlag] = useState(false) //限制规则领取次数标志
    const [timeFlag, setTimeFlag] = useState(false) //限制规则领取时间标志
    const [partShopFlag, setPartShopFlag] = useState(false) //指定参加店铺下方弹框

    useEffect(()=>{
        if(props.location.query.type=='edit'){ //编辑进来的要回显
            getGroupTplInfo({ id: props.location.query.id}).then(res=>{
                console.log('获取回显res===', res)
                if(res){
                    if(res.startLimitFlag==0){  //1限制 0不限制
                        setStartTimeDis(true)
                    }
                    if(res.endLimitFlag==0){   
                        setEndTimeDis(true)
                    }
                    if(res.automaticState){ //自动补团状态1开启，0未开启
                        setAutoGroup(true)
                    }
                    if(res.limitFlag){ //限购规则，1限购（对应规则表规则），0不限购
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
                        name: res.name,
                        serviceCateId: res.serviceCateId ? res.serviceCateId : '', //服务类别id
                        startTime: res.startTime ? moment(res.startTime, 'YYYY-MM-DD HH:mm:ss') : '', 
                        startLimitFlag: res.startLimitFlag==0 ? true : false,
                        endTime: res.endTime ? moment(res.endTime, 'YYYY-MM-DD HH:mm:ss') : '',
                        endLimitFlag: res.endLimitFlag==0 ? true : false,
                        automaticState: res.automaticState ? true: false, //自动补团状态1开启，0未开启
                        effectNum: (res.effectNum||res.effectNum==0) ? res.effectNum : '',  //拼团生效人数，0表示自动补齐
                        limitFlag: res.limitFlag ? 1 : 0,   //限购规则，1限购（对应规则表规则），0不限购
                        limitNum: res.ruleList&&res.ruleList.length!==0&&res.ruleList[0].limitNum&&res.ruleList[0].limitNum!==-1 ? res.ruleList[0].limitNum : '',//限购人次-1表示不限制，正整数表示限购
                        hour: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].hour||res.ruleList[0].hour==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].hour : '',
                        minute: res.ruleList&&res.ruleList.length!==0&&(res.ruleList[0].minute||res.ruleList[0].minute==0)&&res.ruleList[0].delayedMinute!==-1 ? res.ruleList[0].minute : '', //分
                        freeState: res.freeState==1?true:false, //店铺自由参与
                        specifiedMerchantFlag: res.specifiedMerchantFlag==1?true:false,//指定参加店铺
                    })
                }
            })
        }else{ //新建
            form.setFieldsValue({
                automaticState: false, //自动补团状态1开启，0未开启
                limitFlag: 0   //限购规则，1限购（对应规则表规则），0不限购
            })
        }
    },[ ])
    
    const handleFinish = useCallback(val=>{
        console.log('表单val==', val)
         let params = {
            name: val.name, //模板名称
            serviceCateId: val.serviceCateId, //服务类型
            startLimitFlag: val.startLimitFlag ? 0 : 1, //1限制 0不限制
            endLimitFlag: val.endLimitFlag ? 0 : 1,
            automaticState: val.automaticState ? 1 : 0, //自动补团状态1开启，0未开启
            limitFlag: val.limitFlag, //限购规则，1限购（对应规则表规则），0不限购
        }
        if(props.location.query.type=='edit'){ //编辑进来的要传id
            params.id = props.location.query.id
        }
        if(!val.startLimitFlag){
            if(val.startTime){ 
                 params.startTime = moment(val.startTime._d).format('YYYY-MM-DD HH:mm:ss')
            }else{
                message.error('请选择开始时间')
                return
            }
        }
        if(!val.endLimitFlag){
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
        if(val.automaticState){ //自动补团状态
            if(val.effectNum || val.effectNum==0){
                params.effectNum = val.effectNum  //拼团生效人数
            }else{
                message.error('请填写拼团生效人数')
                return 
            }
        }
        if(val.limitFlag){ //选了限购
            let limitObj = {}
            if(!(limitNumFlag || timeFlag)){
                message.error('请填写限制规则')
                return
            }else{
                if(limitNumFlag&&timeFlag){
                    if(val.limitNum<2){
                        message.error('每单服务限购次数需大于等于2')
                        return
                    }
                }
                if(limitNumFlag){ //勾选了限购次数
                    if(val.limitNum){
                        limitObj.limitNum = val.limitNum //限购人次-1表示不限制，正整数表示限购人次
                    }else{
                        message.error('请填写限购次数')
                        return 
                    }
                }else{
                    limitObj.limitNum = -1 //不限制
                }
                if(timeFlag){
                    if((val.hour||val.hour==0) && (val.minute||val.minute==0)){
                        limitObj.hour = val.hour
                        limitObj.minute = val.minute
                    }else{
                        message.error('请填写再次购买时间')
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
       
        console.log('params==', params)
        createOrUpdate(params).then(res=>{
            if(res){
                message.success('提交成功')
                props.history.push('/market/makeGroup')
            }
        })
    },[ selectKey, limitNumFlag, timeFlag ])
    
    return (
        <PageHeaderWrapper title={props.location.query.type == 'add' ?'新建普通拼团':'编辑普通拼团'}>
            <Form
                labelCol={ {span:6} }
                style={{ background: "#fff", padding: '10px' }}
                form={form}
                layout="horizontal" // 表单布局
                onFinish={handleFinish} // 提交表单且数据验证成功后回调事件
            >
                {/* ****基本信息***** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>基本信息</Typography.Title>
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
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            name="serviceCateId"
                            label="服务类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择服务类型',
                                },
                            ]}
                            >
                            <Select>
                                {
                                    serviceCategoryList.map(v=>(
                                        <Select.Option value={v.id} key={v.id}>{v.name}</Select.Option>
                                    ))
                                }
                            </Select>
                        </Item>
                    </Col>
                </Row>
                    {/* 有效期 */}
                <Row gutter={8}>
                    <Col span={12}><Item label={
                        <div>
                            <span style={{color:'#ff4d4f',marginRight:'6px',fontWeight:'bold'}}>*</span>
                            <span>活动时间</span>
                        </div>
                    }></Item></Col>
                </Row>
                <Row gutter={8} style={{marginTop:'-16px'}}>
                    <Col span={3}></Col>
                    <Col>
                        <Item 
                            name="startTime" 
                            label="开始时间"
                        >
                            <DatePicker showTime disabled={startTimeDis?true:false}/>
                        </Item>
                    </Col>
                    <Col>
                        <Item 
                            style={{ display: 'inline-block' }} 
                            name="startLimitFlag" 
                            valuePropName={'checked'}
                        >
                            <Checkbox onChange={e=>{
                                setStartTimeDis(e.target.checked)
                            }}/>
                        </Item><span style={{ "lineHeight": "32px", marginLeft:'6px' }}>不限</span>
                    </Col>
				</Row>
                <Row gutter={8}>
                    <Col span={3}></Col>
                    <Col>
                        <Item 
                            name="endTime" 
                            label="结束时间"
                        >
                            <DatePicker showTime disabled={endTimeDis?true:false}/>
                        </Item>
                    </Col>
                    <Col>
                        <Item 
                            style={{ display: 'inline-block' }} 
                            name="endLimitFlag" 
                            valuePropName={'checked'}
                        >
                            <Checkbox onChange={e=>{
                                setEndTimeDis(e.target.checked)
                            }}/>
                        </Item>不限
                    </Col>
				</Row>
                {/* ****限制规则***** */}
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px',lineHeight:'32px' }}>限制规则</Typography.Title>
                    {/* 自动补团 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            label="自动补团"
                            name="automaticState" 
                            valuePropName={'checked'}
                        >
                            <Checkbox onChange={e=>{ setAutoGroup(e.target.checked) }}>开启</Checkbox>
                        </Item>
                    </Col>
                    {
                        autoGroup?
                        <>
                            <span style={{lineHeight:'32px',marginLeft:'6px',marginRight:'6px'}}>&nbsp;拼团达到</span>
                            <Item 
                                name="effectNum"
                                rules={[
                                    { 
                                        pattern: /^\d+$/,
                                        message: '生效人数仅允许输入非负整数',
                                    },
                                ]}
                            >
                                <Input />
                            </Item>
                            <span style={{lineHeight:'32px',marginLeft:'6px'}}>人生效</span>
                        </>
                        : ''
                    }
                </Row>
                {
                    autoGroup ?  
                    <Row gutter={8}>
                        <Col span={2}></Col>
                        <Col span={12}>
                            <Item>
                                开启自动补团，当活动到达有效期且拼团人数达到预设生效人数自动补齐人数，若设定人数为0，则不限制结束自动补齐人数。
                            </Item>
                        </Col>
                    </Row>
                    : ''
                }
                    {/* 限购规则 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item 
                            label="限购规则"
                            name="limitFlag" 
                            rules={[
                                {
                                    required: true,
                                    message: '请选择限购规则',
                                },
                            ]}
                        >
                            <Radio.Group 
                                onChange={e=>{ 
                                    setLimitFlag(e.target.value)
                                }} 
                            >
                                <Radio value={1}>限购</Radio>
                                <Radio value={0}>不限购</Radio>
                            </Radio.Group>
                        </Item>
                    </Col>
                </Row>
                {
                    limitFlag==1 ? 
                    <>
                        <Row gutter={8} style={{marginLeft:'100px'}}>
                            <Col span={2}></Col>
                            {/* <Item name="everyServiceSign" valuePropName="checked">  */}
                                <Checkbox style={{lineHeight:'32px'}} checked={limitNumFlag} onChange={e=>{
                                    setLimitNumFlag(e.target.checked)
                                }}/>
                            {/* </Item> */}
                                <span style={{lineHeight:'32px',margin:'0 6px'}}>每单服务限购</span>
                            <Item 
                                name="limitNum" 
                                style={{ display: 'inline-block'}}
                                rules={[
                                    { 
                                        pattern: /(^[1-9]\d{0,8}$)/,
                                        message: '仅允许输入9位以内的正整数',
                                    },
                                ]}
                            >
                                <Input disabled={limitNumFlag?false:true}/>
                            </Item>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>次/人</span>
                        </Row> 
                        <Row gutter={8} style={{marginLeft:'100px'}}>
                            <Col span={2}></Col>
                            <Checkbox style={{lineHeight:'32px'}} checked={timeFlag} onChange={e=>{
                                setTimeFlag(e.target.checked)
                            }}/>
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>可在</span>
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
                            <span style={{lineHeight:'32px',margin:'0 6px'}}>分再次购买</span>
                        </Row>
                    </>
                    : ''
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
                            <Checkbox>开启</Checkbox>
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
                            <Checkbox onChange={e=>{
                                setPartShopFlag(e.target.checked)
                            }}>开启</Checkbox>
                        </Item>
                    </Col>
                </Row>
                {
                    partShopFlag ? 
                    <ProtableSelect 
                        setRowKeys={setSelectKey} 
                        selectKey={selectKey}
                        merchantType={2}
                        pageSize={20}
                    /> : ''
                }

            <div style={{display:'flex',justifyContent:'center'}}>
                <Button type="primary" htmlType="submit" size="large" style={{width:'200px',margin:'0 20px'}} loading={loading}>
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
	({ makeGroup, global, loading, }) => ({
        serviceCategoryList: makeGroup.serviceCategoryList, //洗美类型二级列表
        loading: loading.effects['makeGroup/createOrUpdate'],
	}),
	dispatch => ({
        // 获取编辑页回显数据
        async getGroupTplInfo(payload) {
			return dispatch({
				type: 'makeGroup/getGroupTplInfo',
				payload,
			});
        },
        // 拼团活动模板创建或修改  
        async createOrUpdate(payload) {
			return dispatch({
				type: 'makeGroup/createOrUpdate',
				payload,
			});
        },
    }),
    
)(cEGroup);
