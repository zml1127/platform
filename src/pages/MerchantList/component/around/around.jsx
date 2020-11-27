import React,{useMemo,useEffect,useState,useRef}from 'react';
import { useToggle } from 'react-use';
import {Select,Switch,Popconfirm,Typography,Cascader,Button,message,Tabs,Form,Modal,Input  } from 'antd'
import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';
import {doGetService,doGetMerchantSInfo} from '@/services/merchant';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
const { Option }=Select;
const { Text } = Typography;
const { TabPane } = Tabs;
const { useForm } = Form;

import GoodMerchant from "./goodMerchant.js"
const AroundInfo=(props => {
    
    const {
		getExtendcouponListM,
		getDeleteByExtendCouponId,
        getExtendcouponmerchantUpdateStatus,
        getExtendcouponTypeList,
        getListForExtendCouponMerchant,//商户列表
        updateMerchantStock,//设置库存
        getServiceCategoryList,//适用服务类型
        cityList,
        switchLoading,
        id,
        tabType
	} = props;
    const [form] = useForm();
	const { submit } = form;
    const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
    const actionRef = useRef();
    const [typeMap,setTypeMap] = useState([])
    const sourceMap = {1:"联联周边游",2:"平台",3:"侠侣"}
    const [type,SetType] = useState(tabType||1)
    const [modalVisible, toggleModalVisible] = useToggle(false);
    const [storageVisible,setStorageVisible] = useState(false)
    const [ currentRow,setCurrentRow ] = useState({})
    const [ serviceList,setServiceList ] = useState([])
   

	const tabArr =[
		{ key:1,value:"周边券" },
		{ key:2,value:"商品券" }
    ]
    const goodsStatusMap = [
		{ title:"全部",value:""},
		{ title:"已失效",value:"0"},
		{ title:"未开始",value:"1"},
		{ title:"进行中",value:"2"},
    ]
    const goodStatusObj = {
		"0":"已失效",
		"1":"未开始",
    }
    
    useEffect(()=>{
		getExtendcouponTypeList().then(res=>{
			if(res.code === "0000"){
				setTypeMap(res.data)
			}
        })
        getServiceCategoryList().then(res=>{
            setServiceList(res)
        })
    },[])
    
    // 修改库存
	const changeStorage = (value)=>{
        const { totalNum } = value
        const { extendCouponMerchantId } = currentRow
        updateMerchantStock({totalNum,extendCouponMerchantId}).then(res=>{
            if(res.code == "0000"){
                setStorageVisible(false)
                actionRef.current.reload()
            }
        })
	}
	
	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { showAddress } = search;
		let provinceId = showAddress&&showAddress[0]?showAddress[0]:null
		let cityId = showAddress&&showAddress[1]?showAddress[1]:null
		let districtId =showAddress&&showAddress[2]?showAddress[2]:null
		let params = {
			...search,
			provinceId,
			cityId,
			districtId,
		}
		delete params.city
		return params;

    };
    useEffect(()=>{
		actionRef.current.reload()
	},[type])

	const changeSwitch=({extendCouponMerchantId})=>{
		getExtendcouponmerchantUpdateStatus({id:extendCouponMerchantId}).then(res=>{
			actionRef.current.reload()
		})
    }
    // 展示关联店铺列表
    const showMerchant = (row)=>{
      
        setCurrentRow(row)
        toggleModalVisible(true)
    }
    
    const around = [
        {
            title: '第三方名称',
            dataIndex: 'source',
            renderText:(_, row) => row.source ? sourceMap[row.source]:"",
            renderFormItem: (_item, { value, onChange }) => {
                return (
                    <Select defaultValue={0} onChange={onChange}>
                        <Select.Option value={0}>全部</Select.Option>
                        <Select.Option value={1}>联联周边游</Select.Option>
                        <Select.Option value={2}>平台</Select.Option>
                        <Select.Option value={3}>侠侣</Select.Option>
                    </Select>
                );
            }
        },
        {
            title: '所属商户',
            dataIndex: 'thirdMerchantName',
            key:"thirdMerchantName",
        },
        {
            title: '券名称',
            dataIndex: 'name',
            key:"name",
            width:300,
        },
        {
            title: '券头图',
            dataIndex: 'headPic',
            filters: false,
            hideInSearch: true,
            render: (_,row) => [
                <img src={`${row.headPic}`} key="img" style={{width:"120px",height:"120px"}}/>
            ]
        },
        {
            title: '券类型',
            dataIndex: 'typeStr',
            renderFormItem: (_item, { value, onChange }) => {
                return (
                    <Select  defaultValue="" onChange={onChange}>
                            {
                                [{id:"",name:"全部"}].concat(typeMap).map((item)=>{
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                    </Select>
                );
            }
        },
        {
            title: '券库存',
            dataIndex: 'remainingAmount',
            hideInSearch: true
        },
        {
            title: '已购买',
            dataIndex: 'receiveNum',
            hideInSearch: true
        },
        {
            title: '所在区域',
            dataIndex: 'showAddress',
            ellipsis: true,
            render: (_,row) => [
                <div key={0}>{row.showAddress}</div>,
                <div key={1}>{row.address}</div>
            ],
            renderFormItem: (_item, { value, onChange }) => (
                <Cascader
                    options={cityList}
                    showSearch
                    allowClear
                    style={{ width: '100%' }}
                    fieldNames={{ label: 'name', value: 'id', children:'children'}} // 定义label/value/children对应字段
                    value={value} // 指定选中项目
                    onChange={onChange}
                    style={{ width: '200px' }}
                />
            ),
        },
        {
            title: '购买日期',
            dataIndex: 'buyStartTime',
            hideInSearch: true,
            renderText:(_, row) => row.buyStartTime ? `${row.buyStartTime.split(" ")[0]}~${row.buyEndTime.split(" ")[0]}`:"",
        },
        {
            title: '状态',
            dataIndex: 'extendCouponMerchantStatus',
            hideInSearch: true,
            render: (status, row) => {
                return (
                    <Switch
                        size="large"
                        loading={true}
                        checked={status == 1}
                        onChange={ (e)=>{
                            if (switchLoading) return
                            changeSwitch(row)
                        }}
                        loading={switchLoading}
                        disabled={switchLoading}
                    />
                );
            },
        },
    ]
    const goods = [
        {
            title: '券名称',
            dataIndex: 'name',
            key:"name",
            width:200,
            ellipsis:true,
        },
        {
            title: '券头图',
            dataIndex: 'headPic',
            filters: false,
            hideInSearch: true,
            render: (_,row) => [
                <img src={`${row.headPic}`} key="img" style={{width:"120px",height:"120px"}}/>
            ]
        },
        {
            title: '券库存',
            dataIndex: 'totalNumForMerchant',
            hideInSearch: true
        },
        {
            title: '已购买',
            dataIndex: 'receiveNumForMerchant',
            hideInSearch: true
        },
        {
            title: '适用服务类型',
            dataIndex: 'serviceId',
            hideInSearch:true,
            renderText:(value, row) =>row.serviceTypeStr,
            renderFormItem: (_item, { value, onChange }) => {
                return (
                    <Select  defaultValue="" onChange={onChange}>
                            {
                                [{id:"",name:"全部"}].concat(serviceList).map((item)=>{
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                    </Select>
                );
            }
        },
        {
            title: '服务原价',
            dataIndex: 'thirdPrice',
            hideInSearch: true
        },
        {
            title: '优惠价',
            dataIndex: 'price',
            hideInSearch: true
        },
        {
            title: '关联商户',
            dataIndex: 'useNum',
            key:"useNum",
            hideInSearch:true,
            renderText:(value, row) =>`${row.useNum}家`,
            render: (thirdMerchantName, row) => 
                <a onClick = { ()=>showMerchant(row) }>{ thirdMerchantName }</a>
        },
        {
            title: '有效期',
            dataIndex: 'buyStartTime',
            hideInSearch: true,
            renderText:(_, row) => {
                const  buyStartTime = row.buyStartTime ? row.buyStartTime.split(' ')[0] : "无限"
                const  buyEndTime = row.buyEndTime ? row.buyEndTime.split(' ')[0] : "无限"
                return buyStartTime+'~'+buyEndTime
            }
        },
        {
            title: '状态',
            dataIndex: 'goodsStatus',
            renderText:(_, row) => row.goodsStatusStr,
            renderFormItem: (_item, { value, onChange }) => {
                return (
                    <Select defaultValue="" onChange={onChange}>{
                        goodsStatusMap.map((item,index)=><Select.Option value={item.value} key={index}>{ item.title }</Select.Option>)
                    }	
                    </Select>
                );
            }
        },
        {
            title: '上/下线',
            dataIndex: 'extendCouponMerchantStatus',
            hideInSearch: true,
            render: (status, row) => {
                return (
                    <Switch
                        size="large"
                        loading={true}
                        checked={status == 1}
                        onChange={ (e)=>{
                            if (switchLoading) return
                            changeSwitch(row)
                        }}
                        loading={switchLoading}
                        disabled={switchLoading}
                    />
                );
            },
        },
    ]
    const columns = useMemo(
        () => (type==1?around:goods).concat([
            {
                title: '操作',
                dataIndex: 'id',
                valueType: 'options',
                hideInSearch: true,
                fixed:'right',
                width:type==1?120:100,
                render: (_,row) => {
                    return (
                        <div style={{ display: 'flex', justfyContent: 'space-between' }}>
                            <Popconfirm
                                title={'确定要解绑吗？'}
                                okType={'danger'}
                                okText={'确定'}
                                key="delete"
                                onConfirm={() => {
                                    getDeleteByExtendCouponId({id:row.extendCouponMerchantId}).then(res=>{
                                        if(res.code == "0000"){
                                            message.success('解绑成功')
                                            actionRef.current.reload()
                                        }
                                    })
                                }}
                            >
                                <a key="delete">
                                    <Text type="danger" style={{cursor:"pointer"}}>解绑</Text>
                                </a>
                            </Popconfirm>
                            {
                                 type == 1 ?
                                    <a key="see" style={{ margin:'0px 10px' }} onClick={()=>{
                                        history.push({
                                            pathname: '/merchantManage/merchant/details/around/see',
                                            query: {
                                                id: row.id,
                                            },
                                        })
                                    }}>查看</a>:null
                                    // <a key="see"  disabled={row.goodsStatus == 1} style={{ margin:'0px 10px' }}  type="text" onClick={()=>{
                                    //     setCurrentRow(row)
                                    //     setStorageVisible(true)
                                    // }}>设置库存</a>
                            }
                            
                        </div>
                    );
                },
            },
        ])
    );
    return (
        <Wrapdiv>
            <ProTable  columns={columns}
                scroll={{ x: 'max-content' }}
                // rowKey="id"
                request={(payload)=>getExtendcouponListM(payload,id,type)}
                // pagination={false}
                actionRef={actionRef}
                beforeSearchSubmit={ beforeSearchSubmit }
                toolBarRender={() => [
                    <Tabs defaultActiveKey={String(type)} size="large" 
                    style={{width:"100%",position:"absolute",top:"0px",left:"20px",zIndex:"1"}}  
                    onChange={val=>{
                        SetType(val)
                    }}>
                        {
                            tabArr.map((item)=>{
                                return (<TabPane tab={item.value} key={item.key}></TabPane>)
                            })
                        }
                    </Tabs>,
                    <Button  type="primary" style={{position: "relative",zIndex:"3"}}
                    onClick={()=>{
                        history.push({
                            pathname:`/merchantManage/merchant/details/${type==1?"around":"good"}/add`,
                            query: {id},
                        })
                    }}>
                        < PlusOutlined />新建{ type==1?"周边券":"商品券" }
                    </Button>,
                ]}
                search={{
                    collapsed: false,
                    optionRender: ({ searchText, resetText }, { form }) => (
                        <>
                            <Button
                                type="primary"
                                onClick={() => {
                                    form.submit();
                                }}
                                htmlType="submit"
                            >{searchText}</Button>{' '}
                            <Button onClick={() => {
                                    form.resetFields();
                                    form.submit();
                                }}
                            >{resetText}</Button>{''}
                        </>
                        ),
                    }}
                options={{ fullScreen: false, reload: false, density: false, setting: false }}
            />
            <Modal width={400} destroyOnClose={true} title="库存设置" visible={storageVisible} onOk={submit}
					onCancel={()=>{ setStorageVisible(false) }} maskClosable={false}>
						<Form name="basic"  onFinish={ changeStorage } form={form}>	
							<Form.Item name="totalNum" label="" rules={[
								{ required: true,message: '请输入库存调整' }
							]}>
								<Input placeholder="请输入库存调整"/>
							</Form.Item>
						</Form>
			</Modal>
            <GoodMerchant
                currentRow = { currentRow }
                modalVisible = { modalVisible }
                onCancle = { ()=>toggleModalVisible(false) }
                onSearch = { getListForExtendCouponMerchant }
                >
			</GoodMerchant>
        </Wrapdiv>
    );
})

const Wrapdiv=styled.div`

    .uniqueTag{
        .ant-row{
            text-align:center;
            justify-content:center;
            margin-bottom:20px;
            .ant-tag{
                width:30%;
                height:30px;
                line-height:30px;
            }
        }
    }
    .photoRow{
        text-align:start;
        img{
            margin:5px;
        }
    }
    .merchantDetail{

    }
`;
export default AroundInfo;
