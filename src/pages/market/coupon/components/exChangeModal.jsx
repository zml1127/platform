import { Button, Divider, message, Input, Tabs, Cascader, Select, Modal, Radio, Typography, notification, Table, InputNumber } from 'antd';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback, } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'dva';
import html2canvas from "html2canvas"

const ExChangeModal = memo(props => {
    const { visible, setVisible, getExChangeList, onOk, goodsId, } = props
    const actionRef = useRef()
    const [choosedId, setChoosedId] = useState([]) //选中的项的Id
    const [choosedList, setChoosedList] = useState([]) //选中的项的详细信息
    const [choosedNum, setChoosedNum]= useState({}) //选中的项的数量 {id:num}
    
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    useEffect(()=>{  //回显
        goodsId && setChoosedId([goodsId])
    },[goodsId])

    const columns = useMemo(()=>[
        {
          title: '兑换物品名称',
          dataIndex: 'name',
        },
        {
          title: '累计领取数量',
          hideInSearch: true,
          dataIndex: 'totalNum',
        },
        {
            title: '物品图',
            hideInSearch: true,
            dataIndex: 'pic',
            render: (_, row)=>{
                return (
                    <img src={row.pic} style={{width:'142',height:'80px'}}/>
                )
            }
        },
        {
            title: '发放数量',
            hideInSearch: true,
            dataIndex: 'goodsNum',
            render: (_, row)=>{
                return (
                    <InputNumber
                        defaultValue={row.goodsNum || 1}
                        onChange={
                            e=>{
                                setChoosedNum(prev=>{
                                    prev[row.id] = e;return prev
                                })
                            }
                        }
                        min={1}
                        step={1}
                        disabled={row.id != choosedId[0]}
                    />
                )
            }
        }
    ],[choosedId])
    
    const rowSelection = {
        type: 'radio',
        checkStrictly:true,  //checkable 状态下节点选择完全受控（父子数据选中状态不再关联）
        selectedRowKeys: choosedId, //默认选中项
        onChange: (selectedRowKeys, selectedRows) => {
          setChoosedId(selectedRowKeys)
          setChoosedList(selectedRows)
        },
        // onSelect: (record, selected, selectedRows) => {
        //   console.log('当前操控项详细信息record=',record, '当前操控项是否被选中了selected=',selected, '目前选中的所有项详细信息集合selectedRows=',selectedRows);
        // },
        // onSelectAll: (selected, selectedRows, changeRows) => {
        //   console.log('是否全选了true/false',selected, '当前选中所有项的全部信息=',selectedRows, '新选中的项的所有信息',changeRows);
        // },
    };

    const handleOk = useCallback(()=>{
        onOk({ choosedId: choosedId[0], choosedList: choosedList[0], goodsNum: choosedNum[choosedId[0]]||1 })
        setVisible(false)
    },[ choosedList, choosedId, choosedNum ])

    return (
        <Modal 
            visible={visible}
            // visible={true}
            onCancel={()=>{ setVisible(false) }}
            // footer={false}
            onOk={ handleOk }
            title="选择兑换物品"
            width={800}
        > 
            <ProTable
                scroll={{ x: 'max-content', y: '300px' }}
                tableClassName="pro-table-padding"
                actionRef={actionRef}
                rowSelection={{ 
                    ...rowSelection, 
                }}
                request={ getExChangeList }
                columns={columns}
                rowKey="id"
                options={{ fullScreen: false, reload: false, density: false, setting: false }}
                // pagination={{
                //     pageSize: 5
                // }}
                pagination={false}
            />
                     
      	</Modal>
    );
});

export default connect(
	({ makeGroup, coupon, }) => ({
		
	}),
	dispatch => ({
		async getExChangeList(payload, type) {
            // console.log('页面获取关联列表参数payload==', payload)
            let params = payload
            delete params.current
            delete params.pageSize
			return dispatch({
				type: 'coupon/getExChangeList',
				payload: params
			});
		},
	}),
)(ExChangeModal);
