import { PlusOutlined, DownOutlined } from '@ant-design/icons';
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
    Row, Menu, Dropdown, Checkbox, Radio,
    Col, Breadcrumb, Tabs, Tree, Table,
} from 'antd';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'dva';
import moment from 'moment';
const { TabPane } = Tabs;
import ProtableSelect from '@/utils/merchantSelect';

const Edit = memo(props => {
    const { update, getById, } = props
    const { Item, useForm } = Form;
    const [form] = useForm();
    const { resetFields, setFieldsValue, getFieldValue, getFieldsValue, validateFields } = form;
    const actionRef = useRef();
    const radioStyle = { display: 'block', height: '30px', lineHeight: '30px' };
    const [price, setPrice] = useState('') //拼团价    
    const [stockNum, setStockNum] = useState('') //库存
    const [info, setInfo] = useState('') //回显的信息

    useEffect(() => {
        getById({ id: props.location.query.id }).then(res => {
            console.log('拼团详情编辑回显res==', res)
            if(res){
                setInfo(res)
                if(res.price || res.price==0){ //拼团价
                    setPrice(res.price)
                }
                if(res.stockNum || res.stockNum==0){
                    setStockNum(res.stockNum==-1 ? '-' : res.stockNum)
                }
                form.setFieldsValue({
                    serviceCateId: props.location.query.serviceName || '', //关联服务项
                    groupName: res.groupName ? res.groupName : '',//拼团名称
                    joinNum: res.joinNum ? res.joinNum : '', //参团人数
                })
            }
        })
    }, [])

    const columns = useMemo(() => [
        {
            title: '服务',
            dataIndex: 'name',
            width: 160,
            ellipsis: true,
            hideInSearch: true,
            render: ()=>{
                return <div>{ props.location.query.serviceName || '' }</div>
            }
        },
        {
            title: '原价',
            dataIndex: 'oldPrice',
            width: 60,
            ellipsis: true,
            hideInSearch: true,
            render: ()=>{
                return <div>{ props.location.query.oriPrice || '' }</div>
            }
        },
        {
            title: '拼团价',
            dataIndex: 'price',
            width: 160,
            ellipsis: true,
            hideInSearch: true,
            render: (value, row, index) => {
                return <Input placeholder="请输入" value={price} onInput={e=>{
                    setPrice(e.target.value)
                }}/>
            }
        },
        {
            title: '库存',
            dataIndex: 'stockNum',
            width: 160,
            ellipsis: true,
            hideInSearch: true,
            render: (value, row, index) => {
                return <Input placeholder="请输入" value={stockNum} onInput={e=>{
                    setStockNum(e.target.value)
                }}/>
            }
        },
    ], [ price, stockNum, ])

    const handleFinish = useCallback(val => {
        console.log('表单val==', val)
        if(price > props.location.query.oriPrice){  
            message.error('拼团价格需小于原价')
            return
        }
        if(!/^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/.test(price)){
            message.error('拼团价仅允许输入正数，小数点后最多保留两位')
            return
        }
        if(!(/(^[1-9]\d{0,4}$)/.test(stockNum) || stockNum=='-')){ //库存
            message.error('仅可输入正整数和"-"，最大为99999，输入"-"表示库存为无限')
            return 
        }
        let params = {
            id: props.location.query.id, 
            groupTplId: localStorage.getItem('makeGroupIndexId'), //团Id   11394
            merchantId: props.location.query.merchantId || 1, //商户Id

            groupName: val.groupName, //拼团名称
            serviceCateId: info.serviceCateId, //关联服务
            serviceId: info.serviceId, //关联服务
            joinNum: val.joinNum, //参团人数
            price, //拼团价
            stockNum: stockNum == '-' ? -1 : stockNum, //库存
        }
        console.log('参数params==', params)
        update(params).then(res=>{
            console.log('拼团详情编辑提交res==', res)
            if(res){
                message.success('提交成功')
                props.history.go(-1)
            }
        })
    }, [ price, stockNum, info, ])

    
    return (
        <PageHeaderWrapper>
            <Form
                labelCol={{ span: 6 }}
                // wrapperCol={{ span: 10 }}
                style={{ background: "#fff", padding: '10px' }}
                form={form}
                layout="horizontal" // 表单布局
                // initialValues={initialValues} // 表单默认值
                onFinish={handleFinish} // 提交表单且数据验证成功后回调事件
            >
                <Typography.Title level={4} style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>基本信息</Typography.Title>
                {/* 拼团名称 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item
                            name="groupName"
                            label="拼团名称"
                            rules={[
                                {
                                    required: true,
                                    // message: '请选择服务类型',
                                },
                            ]}
                        >
                            <Input />
                        </Item>
                    </Col>
                </Row>
                {/* 关联服务项 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item
                            name="serviceCateId"
                            label="关联服务项"
                        >
                            <Input  disabled/>
                        </Item>
                    </Col>
                </Row>
                {/* 拼团价格设置 */}
                {
                    <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: '16px' }}>
                            <Item><span style={{ color: 'red' }}>*&nbsp;</span>拼团价格设置</Item>
                        </div>
                        <div style={{ flex: 1, marginRight: '30px',marginBottom:'16px' }}>
                            <Table
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                                dataSource={[
                                    {
                                        id:0,
                                        // name: '服务啊啊',
                                        // oldPrice: 111,
                                        // groupPrice: 222,
                                        // save: 10,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                }
                {/* 参团人数 */}
                <Row gutter={8}>
                    <Col span={12}>
                        <Item
                            name="joinNum"
                            label="参团人数"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写参团人数',
                                },
                                { 
                                    pattern: /^(?:[2-9]|[1-9]\d)$/,
                                    message: '仅允许输入2-99的正整数',
                                },
                            ]}
                        >
                            <Input placeholder="2-99" />
                        </Item>
                    </Col>人
                </Row>


                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" htmlType="submit" size="large" style={{ width: '200px', margin: '0 20px' }}>
                        提交
                    </Button>
                    <Button type="primary" size="large" style={{ width: '200px', margin: '0 20px' }} onClick={()=>{
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
    ({ makeGroup, global, }) => ({

    }),
    dispatch => ({
        // 拼团详情编辑提交
        async update(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
            return dispatch({
                type: 'makeGroup/update',
                payload
            });
        },
        // 拼团详情编辑回显 
        async getById(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
            return dispatch({
                type: 'makeGroup/getById',
                payload
            });
        },
    }),

)(Edit);
