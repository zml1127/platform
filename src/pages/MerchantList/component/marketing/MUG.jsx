
import React,{useMemo}from 'react';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';


const ServiceInfo=(props => {
    const {getMerchantList,id}=props;
    const onReq=(payload)=>(getMerchantList({...payload,merchantId:id}))
    const columns = useMemo(
        () => [
            {
                title: '拼团名称',
                dataIndex: 'serviceName',
                render: (_, row)=>{
                    return <a style={{marginRight:'6px'}} onClick={()=>{
                        history.push(`/market/makeGroup?id=${row.groupTplId}`)
                    }}>{_}</a>
                }
            },
            {
                title: '适用服务类型',
                dataIndex: 'cateName',
                hideInSearch: true,
                // render: (value,row)=>{
                //     const name = serviceCategoryList.filter(v=>{
                //         return v.id === row.serviceCateId
                //     })
                //     return name&&name.length!==0&&name[0].name ? name&&name.length!==0&&name[0].name : '--'
                // }
            },
            {
                title: '服务项目',
                dataIndex: 'serviceName',
            },
            {
                title: '服务优惠价格',
                dataIndex: 'privilegePrice',
                hideInSearch: true,
            },
            {
                title: '拼团价格',
                dataIndex: 'price',
                hideInSearch: true,
            },
            {
                title: '成团订单数',
                dataIndex: 'groupOrderNum',
                hideInSearch: true,
            },
            {
                title: '已成团数量',
                dataIndex: 'cloudsNum',
                hideInSearch: true,
            },
            {
                title: '库存',
                dataIndex: 'stockNum',
                hideInSearch: true,
                render:(text,record)=>{
                return(<div>{record.useStock?record.useStock:0}/{text===-1?"无限":text}</div>)
                }
            },
            {
                title: '参与时间',
                dataIndex: 'createTime',
                hideInSearch: true,
            },
              
        
        ],
    );
    return (

        <div>
            <ProTable  
                search={false}
                columns={columns}
                request={onReq}   
                // pagination={false}
            />
        </div>

    );
})


export default ServiceInfo;