import { connect } from 'dva';
import React, { memo,useMemo,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Input,Cascader,Select,Button,Modal,Table,message } from 'antd'
import {regionalConversion,downloadCsv} from '@/utils/utils';
import { PlusOutlined} from '@ant-design/icons';
import {doGetsubList} from '@/services/broMerchant';
import moment from 'moment';

const { Option } = Select;


const BroMerchant = ({ getMerchantList, position, typeMap, history }) => {

    const [ broId, setBroId ] = useState("-1");
    const [ merchantData, setMerchantData ] = useState();
    const [ sea, setSearch ] = useState();
    const onBroList=(id)=>{
        doGetsubList(id).then((res)=>{
            if(res.code==="0000"){
                setBroId(id);
                setMerchantData(res.data);
            }
        })
    }

    const beforeSearchSubmit = ({merchantTypeId, name, area}) =>{
    // name sname area zname
        const tempSearch = {
            name: name || ""
        }
        if(merchantTypeId){
            tempSearch.merchantTypeId=merchantTypeId;
        }

        if(area&&area.length!==0){
            return {...tempSearch,...regionalConversion(area)};
        }
        setSearch(tempSearch)
        return tempSearch;
    }

    const columns = useMemo(
        () => [
            {
                title: '连锁店铺名称',
                dataIndex: 'name',
                width:300,
                renderFormItem: (_item, { value, onChange }) => (
                    <Input value={value} allowClear placeholder="输入店铺名称" onChange={onChange} />
                ),
            },
            {
                title: '店铺类型',
                dataIndex: 'merchantTypeId',
                width: 80,
                valueEnum: typeMap                
            },
            {
                title: '关联店铺数',
                dataIndex: 'merchantCnt',
                hideInSearch: true,
                width: 150,
                render:(text,row)=>{
                    return(<div onClick={()=>{onBroList(row.id)}} style={{cursor:"pointer",color:"#1890ff"}}>{text}</div>)
                }
            },
            {
                title: '所在区域',
                dataIndex: 'area',
                ellipsis: true,
                width: 180,
                hideInTable:true,
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
                title: '店铺建立时间',
                dataIndex: 'createTime',
                hideInSearch: true,
                width: 180,
            },
            {
                title: '操作',
                dataIndex: 'id',
                valueType: 'options',
                hideInSearch: true,
                width: 200,
                fixed:'right',
                render: (text) => {
                  
                    return (
                        <div style={{ display: 'flex', justfyContent: 'space-between' }}>
                            <a key="编辑" style={{ marginRight: '10px' }} 
                                onClick={() => {
                                    // merchantManage/merchant/edit
                                    history.push(`bromerchant/edit?id=${text}`);
                                }}
                            >
                                编辑
                            </a>
                           
                        </div>
                    );
                },
            },
        
        ],
    );
    const exportParams = () => {
        getMerchantList({...sea, current:1, pageSize:9999999}).then(res=>{
            const currentTime = moment(new Date()).format("YYYY-MM-DD");
            const fileName = `连锁店铺信息导出${currentTime}`;
            const linkId = "download-link";

            const header = ["连锁店铺名称","店铺类型","关联店铺数","店铺建立时间"]

            const params = ["name","merchantType","merchantCnt","createTime"]
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
    const columnsMerchant = [
        {
            title: '所在区域',
            dataIndex: 'area',
            ellipsis: true,
            width: 180,
           
        },
        {
            title: '店铺名称',
            dataIndex: 'name',
            width: 300,
        }
    
    ];

    return (
        <PageHeaderWrapper
            extra={[
            <Button key="3" onClick={()=>{exportParams()}}>店铺信息导出</Button>,
            // <Button key="2">批量导出</Button>,
            // <Button key="1">
            //   模板表下载
            // </Button>,
        ]}>
     
            <ProTable
                request={getMerchantList}
               
                rowKey="id"
                columns={columns}    
                scroll={{x:1500}}

                beforeSearchSubmit={beforeSearchSubmit}
                // 拖拽
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
                    <Button
                        icon={<PlusOutlined />}
                        type="dashed"
                        onClick={() => {
                            // merchantManage/merchant/edit
                            history.push(`bromerchant/edit`)
                        }}
                    >
                        新增连锁店铺
                    </Button>
                ]}
            />
            <a style={{display:"none"}} id="download-link">export</a>
        {
            broId!=="-1"&&
            <Modal visible footer={null} onCancel={()=>{setBroId("-1")}}>
                <Table columns={columnsMerchant} dataSource={merchantData}/>
            </Modal>
        }
        </PageHeaderWrapper>
    );
}

export default connect(
    ({global, merchant}) => ({
        position: global.cityList,
        typeMap: merchant.typeMap
    }),
    dispatch=>({
        async getMerchantList(payload) {
            const params = { ...payload };
            return dispatch({
                type: 'broMerchant/getMerchantList',
                payload: {
                    ...params,
                },
            });
        }
    })
)( BroMerchant );

