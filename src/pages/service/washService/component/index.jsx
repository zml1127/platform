import { connect } from 'dva';
import React, { memo,useMemo,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {Input,Cascader } from 'antd'
import {regionalConversion} from '@/utils/utils';

import WashModal from './washHistoryModal';



export default connect(
    ({global}) => ({
        position:global.cityList
    }),
    dispatch=>({

        async getWashList(payload) {
            const params = { ...payload };
            return dispatch({
                type: 'washservice/getMerchantList',
                payload: {
                    ...params,
                },
            });
        },
        async postServicePage(payload) {
            const params = { ...payload };
            return dispatch({
                type: 'washservice/postServicePage',
                payload: {
                    ...params,
                },
            });
        },// 历史查询
        async getHisMerchant(payload) {
            const params = { ...payload };
            return dispatch({
                type: 'washservice/getHisMerchant',
                payload: {
                    ...params,
                },
            });
        },
    })
)(
    memo(props => {


    const { getHisMerchant, postServicePage, position }=props;
    const { id, serviceId } = props.location.query;
    const beforeReq=(payload)=>postServicePage({
        ...payload,
        serviceCateId:id,
        serviceId
    })
    const [ vis, setVis ]=useState(false);

    const [ merchantId, setmerchantId ]=useState();
    const [ names, setName ]=useState();
    const historyDetail=(currentMerchantId,b)=>{
        setVis(true);
        setmerchantId(currentMerchantId)
        setName(b)
    }


    const beforeSearchSubmit = search =>
	// name sname area zname
	{
		const {merchantName, area}=search;
		// eslint-disable-next-line prefer-const
		let tempSearch={
			merchantName: merchantName || null,
		
		}
		if(area&&area.length!==0){
			
			
			return {...regionalConversion(area),...tempSearch};
		}
		
		return tempSearch;
	}
    const columns = useMemo(
        () => [
            {
                title: '店铺名称',
                dataIndex: 'merchantName',
                width: 300,
                renderFormItem: (_item, { value, onChange }) => (
                    <Input value={value} allowClear placeholder="输入店铺名称" onChange={onChange} />
                ),
            },
            {
                title: '所在区域',
                dataIndex: 'area',
                ellipsis: true,
                width: 180,
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
                title: '服务名称',
                dataIndex: 'name',
                hideInSearch: true,
                width: 140,
            },
            {
                title: '原价',
                dataIndex: 'oriPrice',
                hideInSearch: true,
                width: 100,
            },
            {
                title: '优惠价格',
                dataIndex: 'price',
                hideInSearch: true,
                width: 100,

            },
            {
                title: '次数',
                dataIndex: 'totalNum',
                hideInSearch: true,
                width: 100,        
            },
            {
                title: '首页位置',
                dataIndex: 'sort',
                hideInSearch: true,
                width: 100,
            },
            {
                title: '适用车型',
                dataIndex: 'carName',
                width: 130,
                hideInSearch: true,
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                hideInSearch: true,
                render:(text)=>{
                    return <div>{text===1?"上线":"下线"}</div>
                }
            },
            {
                title: '关联时间',
                dataIndex: 'createTime',
                hideInSearch: true,
                width: 140,
            },
            {
                title: '操作',
                dataIndex: 'id',
                valueType: 'options',
                hideInSearch: true,
                width: 200,
                render: (text,record) => {
                  
                    return (
                        <div style={{ display: 'flex', justfyContent: 'space-between' }}>
                            <a  key="排序" style={{ marginRight: '10px' }}
                                 onClick={() => {
                                    // merchantManage/merchant/edit
                                    props.history.push(`list/sort?id=${record.merchantId}`);
                                }}
                            >
                                排序
                            </a>
                            <a  key="历史" style={{ marginRight: '10px' }}
                                 onClick={()=>historyDetail(record.merchantId,record.merchantName)}
                            >
                                历史
                            </a>
                            <a  key="编辑" style={{ marginRight: '10px' }} 
                                    onClick={() => {
    									// merchantManage/merchant/edit
                                        props.history.push(`list/edit?id=${text}`);
                                        sessionStorage.setItem("washMerchantId",record.merchantId);
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
return (
        <PageHeaderWrapper title={`洗美服务-${sessionStorage.getItem("washTName")}`}>
             
                <ProTable
                    request={beforeReq}
                    rowKey="id"
                    columns={columns}    
                    beforeSearchSubmit={beforeSearchSubmit}
                    // 拖拽

                     
                   
                />
                {
                    vis?
                    <WashModal getHisMerchant={getHisMerchant} setVis={setVis}
                    names={`洗美服务-${sessionStorage.getItem("washTName")}-${names}`}
                    id={id}
                    merchantId={merchantId}/>
                    :null
                }
        </PageHeaderWrapper>
        );
    }),
);

