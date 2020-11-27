import { connect } from 'dva';
import React, {memo, useMemo, useEffect, useState, useRef} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Input,Cascader,Select,Button,message,Tabs,Modal} from 'antd'
import {regionalConversion,downloadCsv} from '@/utils/utils';
import { PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
// import areadata from './area';
import moment from 'moment';
import style from "../operation/material/index.less";

const { Option } = Select;
const { TabPane } = Tabs;


const MerchantList = memo(props => {
    const { getMerchantList, getMerchantserviceTag, position, getUpdateIsSeed, typeMap } = props;
    const actionRef = useRef()
    const [ sea, setSearch ]=useState();
    const [ isSeed, SetIsseed ] = useState(0)
    useEffect(()=>{
        getMerchantserviceTag().then((res)=>{
            localStorage.setItem("serviceTag",JSON.stringify(res.service))
            localStorage.setItem("specialTag",JSON.stringify(res.special))
        })
    },[])
    // 切换类型 刷新列表
    useEffect(()=>{
        actionRef.current.reload()
    },[isSeed])
    
    const beforeSearchSubmit = (search) => {
        const tempSearch={
            name:search.name||"",
            isSeed:search.isSeed||"",
        }
        if(search.merchantTypeId){
            tempSearch.merchantTypeId=search.merchantTypeId
        }
        const {area}=search;
        if(area&&area.length!==0){
            return {...tempSearch,...regionalConversion(area)};
        }
        setSearch(tempSearch);
        return tempSearch
    }

    const columns = useMemo(
        () => [
            {
                title: '店铺名称',
                dataIndex: 'name',
                renderFormItem: (_item, { value, onChange }) => (
                    <Input value={value} allowClear placeholder="输入店铺名称" onChange={onChange} />
                ),
            },
            {
                title: '店铺类型',
                dataIndex: 'merchantTypeId',
                valueEnum: typeMap
            },
            {
                title: '店铺属性',
                dataIndex: 'isSeed',
                valueEnum: {
                    0: '普通门店',
                    1: '尚客车享',
                    2: '尚客权益'
                }
            },
            {
                title: '所在区域',
                dataIndex: 'area',
                ellipsis: true,
                renderFormItem: (_item, { value, onChange }) => (
                    <Cascader
                        options={position}
                        showSearch
                        value={value}
                        key={_item}
                        allowClear
                        onChange={onChange}
                        fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                    />
                ),
            },
            {
                title: '配置服务数量',
                dataIndex: 'serviceCnt',
                hideInSearch: true,
            },
            {
                title: '配置营销活动',
                dataIndex: 'activityCnt',
                hideInSearch: true,
            },
            {
                title: '配置周边优惠数',
                dataIndex: 'preferentialNum',
                hideInSearch: true,
            },
            {
                title: '归属连锁商户',
                dataIndex: 'merchantChainName',
                hideInSearch: true,
            },
            {
                title: '特约商户号',
                dataIndex: 'wxMchId',
                hideInSearch: true,
            },
            {
                title: '店铺建立时间',
                dataIndex: 'createTime',
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'id',
                valueType: 'options',
                hideInSearch: true,
                fixed:'right',
                width:300,
                render: (text,row) => {
                    return (
                        <div style={{ display: 'flex', justfyContent: 'space-between' }}>
                            <a  key="查看" style={{ marginRight: '10px' }}
                                onClick={() => {
                                    localStorage.setItem("merchantId",text)
                                    props.history.push({
                                        pathname: 'merchant/details',
                                        query: {
                                            id:row.id,
                                           
                                        },
                                    })
                                    
                                }}
                            >
                                查看
                            </a>
                            <a  key="编辑" style={{ marginRight: '10px' }}
                                    onClick={() => {
                                            props.history.push(`merchant/edit?id=${text}`);
                                    }}
                                    >
                                编辑
                            </a>
                            {/*<a  key="设为普通门店" style={{ marginRight: '10px' }}
                                    onClick={() => {
                                        Modal.confirm({
                                            title: '提示',
                                            icon: <ExclamationCircleOutlined />,
                                            content: `确定要设置为${row.isSeed == 0?'尚客车享':"普通"}门店？`,
                                            okText: '确认',
                                            cancelText: '取消',
                                            onOk:()=>{
                                                getUpdateIsSeed({merchantId:row.id}).then(res=>{
                                                    if(res.code == "0000"){
                                                        actionRef.current.reload()
                                                    }
                                                })
                                            } 
                                        });
                                    }}
                            >
                                {row.isSeed == 0?'设为尚客车享门店':"设为普通门店"}
                            </a>*/}

                        </div>
                    );
                },
            },

        ],
    );
    // 导出数据
    const exportParams = () => {
            //
        getMerchantList({...sea, current:1, pageSize:9999999}).then(res=>{
        console.log(res,"resxqxqxq");
        const currentTime = moment(new Date()).format("YYYY-MM-DD");
        const fileName = `店铺信息导出${currentTime}`;
        const linkId = "download-link";
        const header = ["店铺名称","店铺类型","所在区域","配置服务数量","配置营销活动","归属连锁商户","特约商户号","店铺建立时间"]
        const params = ["name","merchantType","area","serviceCnt","activityCnt","merchantChainName","wxMchId","createTime"]
        const content = [];
        res.data.forEach(item => {
            const rowContent = [];
            params.forEach(data=>{
                rowContent.push(item[data]?item[data]:"-")
            })
            content.push(rowContent);
        });

        downloadCsv(linkId, header, content, fileName);
        },()=>{ message.error('导出失败'); })
    };
    return (
    <PageHeaderWrapper extra={[
            <Button
                key="3"
                onClick={()=>{exportParams()}}>店铺信息导出
            </Button>,
            // <Button key="2">批量导入</Button>,
            // <Button key="1">
            //   模板表下载
            // </Button>,
        ]}>

            <ProTable
                request={(payload)=>getMerchantList(payload) }
                rowKey="id"
                columns={columns}
                beforeSearchSubmit={beforeSearchSubmit}
                scroll={{ x: 'max-content' }}
                actionRef={actionRef}
                search={{
                    collapsed: false,
                    optionRender: ({ searchText, resetText }, { form }) => (
                        <React.Fragment>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                {searchText}
                            </Button>{' '}
                            <Button
                                onClick={() => {
                                    form.resetFields();
                                    form.submit();
                                }}
                            >
                                {resetText}
                            </Button>
                        </React.Fragment>
                    ),
                }}
                toolBarRender={() => [
                    // <Button
                    //     icon={<PlusOutlined />}
                    //     type="dashed"
                    //     style={{position: "relative",zIndex:3}}
                    //     onClick={() => {
                    //         // merchantManage/merchant/edit
                    //         props.history.push(`merchant/edit`)
                    //     }}
                    // >
                    //     新增店铺
                    // </Button>
                ]}
            />
            <a id="download-link" style={{display: 'none'}}>export</a>
    </PageHeaderWrapper>
    )
})
export default connect(
    ({global, merchant }) => ({
        position: global.cityList,
        typeMap: merchant.typeMap
    }),
    dispatch=>({
        async getMerchantList(payload) {
            const params = { ...payload };
            return dispatch({
                type: 'merchant/getMerchantList',
                payload: {
                    ...params,
                },
            });
        },
        async getMerchantserviceTag() {
            return dispatch({
                type: 'merchant/getMerchantserviceTag',
            });
        },
        async getUpdateIsSeed(payload) {
            return dispatch({
                type: 'merchant/getUpdateIsSeed',
                payload
            });
        },
        
    })
)(MerchantList)
