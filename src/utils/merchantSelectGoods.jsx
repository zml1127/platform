/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { connect } from 'dva';
import React, { memo, useState, useMemo, useEffect, useCallback, useRef, } from 'react';

import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';
import { Input, Cascader, message,Popover,Button } from 'antd';
import {regionalConversion} from '@/utils/utils';

export default connect(
    ({global}) => ({
        position:global.cityList
    }),
    dispatch => ({
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
        async postMerchantByIds(ids) {
            return dispatch({
                type: 'merchant/postMerchantByIds',
                ids
            });
        },
    })
)(
    memo(props => {
        const { position,washChecked, getMerchantList, onOk, initalId, ownerMerchantName,} = props;
        const actionRef = useRef();
        const [choosedId, setChoosedId] = useState([]) //选中的项的Id
        const [choosedList, setChoosedList] = useState([]) //选中的项的详细信息
       
        const columns = useMemo(
            () => [
                {
                    title: '店铺名称',
                    dataIndex: 'merchantName',
                    width: 80,
                    // hideInSearch: true,
                    // renderFormItem: (_item, { value, onChange }) => (
                    //     <Input value={value} allowClear placeholder="输入店铺名称" onChange={onChange} />
                    // ),
                },
                {
                    title: '所在区域',
                    dataIndex: 'area',
                    ellipsis: true,
                    width: 230,
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
                    width: 80,
                    hideInSearch: true
                },
                {
                    title: '次数',
                    dataIndex: 'totalNum',
                    width: 80,
                    hideInSearch: true
                },
                // {
                //     title: '关联连锁店铺',
                //     dataIndex: 'merchantChainName',
                //     hideInSearch: true,
                //     width: 140,
                // },
                {
                    title: '店铺建立时间',
                    dataIndex: 'createTime',
                    hideInSearch: true,
                    width: 140,
                }
            ]
        );
        
        const getList = useCallback((payload)=>{
            let params = {
                ...payload,
                serviceCateId: washChecked ? washChecked : ''
            }
            return getMerchantList(params)
        },[ washChecked ])

        useEffect(()=>{ //回显
            if(initalId){
                setChoosedId([initalId])
            }
        },[ initalId ])

        useEffect(()=>{
            if(ownerMerchantName){
                setChoosedList([{ merchantName: ownerMerchantName }])
            }
        },[ ownerMerchantName ])

        useEffect(()=>{
            actionRef.current.reset()
            setTimeout(()=>{
                actionRef.current.reload()
            },200)
        },[ washChecked ])

        const rowSelection = {
            type: 'radio',
            checkStrictly:true,  //checkable 状态下节点选择完全受控（父子数据选中状态不再关联）
            selectedRowKeys: choosedId, //默认选中项
            onChange: (selectedRowKeys, selectedRows) => {
                setChoosedId(selectedRowKeys)
                setChoosedList(selectedRows)
                // console.log('selectedRowKeys==', selectedRowKeys, 'selectedRows==', selectedRows)
                onOk({ choosedId: selectedRowKeys[0], choosedList: selectedRows[0] })
            },
        };

        const beforeSearchSubmit = (search) => {
            const tempSearch={
                // name: search.name||"",
                merchantName: search.merchantName||"",
            }
            const { area }=search;
            if(area && area.length!==0){
                return {...tempSearch,...regionalConversion(area)};
            }
            return tempSearch
        }

        return (
            <div>
                <ProTable
                    rowKey="id"
                    actionRef={actionRef}
                    columns={columns}
                    beforeSearchSubmit={beforeSearchSubmit}
                    request={getList}
                    pagination={{pageSize:10}}
                    rowSelection={{ 
                        ...rowSelection, 
                    }}
                    toolBarRender={() => [
                        <div>
                            已选择: <span style={{color:"#1890ff"}}>{choosedList&&choosedList.length!==0&&choosedList[0].merchantName}</span>
                        </div>
                    ]}
                />
            </div>
        );
    }),
);

