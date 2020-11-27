/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { connect } from 'dva';
import React, { memo, useState, useMemo, useEffect, useCallback, useRef, } from 'react';

import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';
import { Input, Cascader, message,Popover,Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { doGetsubList } from '@/services/broMerchant';
// import areadata from '../pages/MerchantList/area';
import {regionalConversion} from '@/utils/utils';

export default connect(
    ({global}) => ({
        position:global.cityList
    }),
    dispatch => ({
        // async getMerchantList(payload) { //获取列表
            
        //     const params = { ...payload };
        //     if(!(params.merchantTypeId)){
        //             delete params.merchantTypeId;
        //     }
        //     return dispatch({
        //         type: 'merchant/getMerchantList',
        //         payload: {
        //             ...params,
        //         },
        //     });
        // },
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
        const { setRowKeys, getMerchantList, selectKey, postMerchantByIds, parentId,pageSize,merchantType,broList,position,washChecked} = props;
        const [sRKey, setselectedRowKeys] = useState([...selectKey]);
        const [sRows, setselectedRows] = useState([]);
        const actionRef = useRef();
        
        const [editState,setEd]=useState(false);
        useEffect(() => {
            console.log(selectKey,'1213123');
            if (selectKey.length !== 0&&!editState) {
                 
                fetchComment(selectKey)
            }
        }, [selectKey])
        useEffect(() => {

            if (parentId) {

                fetchComment2(parentId)
            }
        }, [])
       
        async function fetchComment(key) {
            const initRow = await postMerchantByIds(key)
            console.log(initRow,"initRowxxqqeeaa");
            if(initRow.length!==0){
                setselectedRowKeys(selectKey)
                setselectedRows(initRow)
            }else{
                message.warning("商户ID有误")
            }
            
        }
        async function fetchComment2(key) {
            const initRow2 = await doGetsubList(key)
            console.log(initRow2, 'initRow2xqxq');
            const ids = initRow2.data.map((item) => (item.id));
            setselectedRowKeys(ids);
            setselectedRows(initRow2.data);
            // setselectedRows(initRow)
        }

        const rowSelection = {
            type: "checkbox",
            getCheckboxProps:record=>({
                
                // disabled:broList?record.merchantChainId!=="0":false
                disabled:broList&&record.merchantChainId!=="0"
            }),
            // }, 
            onSelectAll: (selected, selectedRows,changeRows) => {
                setEd(true);
                console.log(`selected: ${selected}`, 'selectedRowKeys-onSelectAll: ', selectedRows,changeRows);
                // 全选 判断有没重复的
                if(selected){
                        const ids=changeRows.map((item) => {
                            return item.id
                        })
                        //
                        setselectedRowKeys([...ids,...sRKey]);
                        setselectedRows([...changeRows,...sRows]);
                        setRowKeys([...ids,...sRKey]);
                }
                // // 全不选 判断有没重复的
                else{
                    const ids=changeRows.map((item) => {
                        return item.id
                    })
                    const sRKeyTemp=sRKey.filter((ttt)=>(ids.indexOf(ttt)===-1));
                    const sRowsTemp=sRows.filter((rrr)=>(ids.indexOf(rrr.id)===-1));
                    console.log(sRKeyTemp,"sRKeyTemp");
                    setselectedRowKeys(sRKeyTemp);
                    setselectedRows(sRowsTemp);
                    setRowKeys(sRKeyTemp);
                    //
                }
            },
            onSelect: (record, selected, selectedRows) => {
                setEd(true);
                //    console.log(selectedRows,"selectedRowsxxqqzz");
                const { id } = record;

                // 之前 选中的 
                const tempsRKey = sRKey.filter((item) => item !== id);
                const tempsRows = sRows.filter((item) => item.id !== id);

                console.log(selectedRows, "selectedRowKeys-onSelect", record, selected, tempsRows);

                //   现在选中的 与之前对比 去掉 重复 的id 
                const selectedTemp = selectedRows.filter((item) => {

                    if (item) {
                        // 新增 删除 
                        if (tempsRKey.indexOf(item.id) === -1) {

                            return item;
                        }

                    }
                })
                //    console.log(selectedTemp,"selectedTempxxyyzz");
                const ids = selectedTemp.map((item) => {
                    return item.id
                })


                // 要去重
                setselectedRowKeys(Array.from(new Set([...tempsRKey, ...ids])));
                setselectedRows([...tempsRows, ...selectedTemp]);
                setRowKeys(Array.from(new Set([...tempsRKey, ...ids])));// 准备返回的值

            },
            onChange: (selectedRowKeys, selectedRows) => {
                setEd(true);
                console.log(`selectedRowKeys-onChange: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                // setcurrentRow(selectedRows)
                                // 要去重
                if ( selectedRowKeys.length === 0 ) {
                    setselectedRowKeys([]);
                    setselectedRows([]);
                    setRowKeys([]);
                }
            },
        };
        const handleTagSpan = (item) => {
            const sRKeyCurrent = sRKey.filter((i) => (i !== item.id))
            const sRowCurrent = sRows.filter((i) => (i.id !== item.id))

            setselectedRowKeys(sRKeyCurrent)
            setselectedRows(sRowCurrent)
            setRowKeys(sRKeyCurrent);// 准备返回的值

        }

        const onReq = useCallback(((payload) => {
            let params = {
                ...payload,
                merchantTypeId:merchantType||null,
                serviceCateId: washChecked ? washChecked : ''
            }
            // return getMerchantList({...payload,merchantTypeId:merchantType||null, })
            return getMerchantList(params)
        }),[ washChecked ])

        useEffect(()=>{
            actionRef.current.reload()
        },[ washChecked ])


        const beforeSearchSubmit = (search) =>
			// name sname area zname
			{
                const tempSearch={
                    name:search.name||"",
                    merchantChainName:search.merchantChainName||"",
                }
                    // merchantTypeId:search.merchantTypeId||"",

			   const {area}=search;
				if(area&&area.length!==0){
					return {...tempSearch,...regionalConversion(area)};
				}
				return tempSearch
			}
        const columns = useMemo(
            () => [
                {
                    title: '店铺ID',
                    dataIndex: 'id',
                    hideInSearch: true,
                    width: 80,

                },
                {
                    title: '店铺名称',
                    dataIndex: 'name',
                    width: 80,
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
                    title: '关联连锁店铺',
                    dataIndex: 'merchantChainName',
                    // hideInSearch: true,
                    width: 140,
                },
                {
                    title: '店铺建立时间',
                    dataIndex: 'createTime',
                    hideInSearch: true,
                    width: 140,
                }


            ]
        );
        return (
            <div>
                <ProTable
                    rowKey="id"
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Wrapdiv >
                            {
                                sRows.length>20?
                                <Popover content={
                                    sRows.map((item) => {

                                        return <TagSpan onClick={() => handleTagSpan(item)}>{item.name}<span onClick={() => handleTagSpan(item)}><CloseCircleFilled /></span></TagSpan>
                                    }) 
                                } title="已选择店铺">
                                    <Button>显示全部已选择店铺</Button>
                                </Popover>
                                :null
                            }
                            已选择:
                            {
                                sRows.length ? sRows.slice(0,20).map((item) => {

                                    return <TagSpan onClick={() => handleTagSpan(item)}>{item.name}<span onClick={() => handleTagSpan(item)}><CloseCircleFilled /></span></TagSpan>
                                }) : null
                            }

                        </Wrapdiv>
                    ]}
                    columns={columns}
                    beforeSearchSubmit={beforeSearchSubmit}
                    request={onReq}
                    pagination={{pageSize:pageSize || 100}}
                    rowSelection={{ ...rowSelection, selectedRowKeys: sRKey }}
                />
               
            </div>
        );
    }),
);
const TagSpan = styled.span`

   /* color:#1890ff; */
   background:#f5f5f5;
   border:1px solid #f0f0f0;
   margin:0 10px;
   padding:0 3px;
`;
const Wrapdiv=styled.div`
    height:100px;
`;