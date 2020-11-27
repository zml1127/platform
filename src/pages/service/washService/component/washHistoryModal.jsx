import React, { useMemo} from 'react';
import {Modal} from 'antd';
import ProTable from '@ant-design/pro-table';
 
const WashMadal=(props => {

    const {getHisMerchant,setVis,merchantId,id,names}=props;
   
   console.log(merchantId,"WashModalxxqqzz",props);
   // 历史暂停
   const beforegetHisMerchant=(payload)=>getHisMerchant({...payload,merchantId,serviceCateId:id})
    const columns = useMemo(
        () => [
            {
                title: '修改时间',
                dataIndex: 'createTime',
                hideInSearch: true,
                width: 140,
            },
            {
                title: '服务名称',
                dataIndex: 'name',
                width: 80,
                hideInSearch: true,

            },
            {
                title: '原价',
                dataIndex: 'oriPrice',
                hideInSearch: true,
                width: 140,
            },
            {
                title: '优惠价',
                dataIndex: 'price',
                hideInSearch: true,
                width: 140,
            },
            {
                title: '首页位置',
                dataIndex: 'sort',
                hideInSearch: true,
                width: 140,
            },
            {
                title: '适用车型',
                dataIndex: 'carName',
                hideInSearch: true,
                width: 140,
            },
            {
                title: '操作角色',
                dataIndex: 'creator',
                hideInSearch: true,
                width: 140,
            },
        
        
        ],)
    return (
        <Modal visible 
        width={800}
            title={names}
            footer={null}  
            onCancel={()=>{setVis(false)}}         
            >
            <ProTable  
               columns={columns} 
               search={false}
               request={beforegetHisMerchant}
            />
        </Modal>
    );
    })
export default WashMadal;