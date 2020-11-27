/* eslint-disable eqeqeq */
/* eslint-disable no-useless-concat */

import React,{useMemo}from 'react';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';

const nameMap = {
    1: '满减劵',
    2: '折扣劵',
    3: '商品兑换劵'
}

const ServiceInfoXXXX=(props => {
    const {getMerchantList,id}=props;
    const onReq=(payload)=>getMerchantList({...payload,merchantId:id})
    const columns = useMemo(
        () => [
            {
                title: '优惠券名称',
                dataIndex: 'couponType',
                hideInSearch: true,
                width: 140,
                render:(text, row)=>{
                    return <a style={{marginRight:'6px'}} onClick={()=>{
                        history.push(`/market/coupon?type=${row.pubType}&id=${row.couponTplId}`)
                    }}>{nameMap[text]}</a>
                }
            },
            {
                title: '服务项目',
                dataIndex: 'serviceName',
              
                hideInSearch:true
            },
            {
                title: '优惠券内容',
                dataIndex: 'couponContent',
                hideInSearch: true,
               
                render: (value, row) => {
					let str = '--'
					switch (row.couponType){
						case 1:  // 满减券
							if(row.useCondition==0){ // 无门槛
								str = `${'无门槛'+'减'}${row.faceValue}元`
							}else{
								str = `满${row.matchAmount}减${row.faceValue}元`
							}
							break;
						case 2: // 折扣券
						if(row.useCondition==0){ // 无门槛
							str = `${'无门槛'+'打'}${row.faceValue}折`
						}else{
							str = `满${row.matchAmount}打${row.faceValue}折`
						}
							break;
						case 3: // 商品兑换券
							str = row.goodsName
						break;  
					}
					return str
				},
            },
            {
                title: '库存',
                dataIndex: 'totalNum',
                hideInSearch: true,
              
                render:(text,record)=>{
                return <div>{record.receiveNum}/{text===-1?"不限":text}</div>
               
                }
            },
            {
                title: '已使用',
                dataIndex: 'useNum',
                hideInSearch: true,
              
            },
            {
                title: '参与时间',
                dataIndex: 'createTime',
                hideInSearch: true,
             
            },
            {
                title: '活动有效期',
                dataIndex: 'startLimitFlag',
                key: 'startLimitFlag',
                hideInSearch: true,
                render: (item, record) => {
                    return (<div>{item === 0 ? "开始长期" : record.startTime}-
                        {record.endLimitFlag === 0 ? "结束长期" : record.endTime}</div>)
                }

            },
        
        
        ],[id]
    );
    return (

        <div>

            <ProTable  columns={columns} d
                request={onReq}
                // pagination={false}
                search={false}
            />
        </div>

    );
})


export default ServiceInfoXXXX;