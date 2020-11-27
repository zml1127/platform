
import React,{useMemo,useEffect,useState}from 'react';
import {Select } from 'antd'
import ProTable from '@ant-design/pro-table';
import styled from 'styled-components';
import { doGetService, doGetMerchantSInfo } from '@/services/merchant';
import { history } from 'umi';

const {Option}=Select;
const ServiceInfo = (props => {
    const [ opt, sel ] = useState([]);
    const {
        id,
        option,
        getOilMerchantId
    } = props;

    useEffect(()=>{
        handleFetch()
    },[])

    const handleFetch = async ()=>{
        if(option===2){
            const res = await doGetService();
            if(res.code === "0000"){
                sel(res.data)
            }
        }
    }

    const getOilMerchantx=(payload)=>getOilMerchantId({...payload,merchantId:id});
    const getMerchantSInfo=(payload)=>doGetMerchantSInfo({...payload,merchantId:id,dataType:1 }) //dataType 1不去重 ''去重
    const beforeSearchSubmit=({serviceCate2Name})=>{
        if(serviceCate2Name){
            return { serviceCate2Id: serviceCate2Name }
        }
        return {}
    }
    const columns = useMemo(
        () => [
            {
                title: '服务名称',
                dataIndex: 'name',
                hideInSearch: true,
                render: (_, row)=>{
                    return <a style={{marginRight:'6px'}} onClick={()=>{
                        sessionStorage.setItem("washTName", row.serviceCate2Name)
                        history.push(`/service/washService/list?id=${row.serviceCateId}&serviceId=${row.id}`)
                    }}>{row.name}</a>
                }
            },
            {
                title: '服务类型',
                dataIndex: 'serviceCate2Name',
                renderFormItem: (_item, { value, onChange }) => {
                    return option===2 &&
                    (
                        <Select defaultValue={value} onChange={onChange}>
                            {
                                opt.map((item)=>(
                                    <Option value={item.id}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    )
                },
                render:(text)=>{
                    return <div>{text}</div>
                }
            },
            {
                title: '原价',
                dataIndex: 'oriPrice',
                hideInSearch: true,
            },
            {
                title: '优惠价格',
                dataIndex: 'price',
                hideInSearch: true,
            },
            {
                title: '店铺首页位置',
                dataIndex: 'sort',
                hideInSearch: true,
            },
             {
                title: '生成订单数',
                dataIndex: 'saleCnt',
                hideInSearch: true,
            },
            {
                title: '添加服务时间',
                dataIndex: 'createTime',
                hideInSearch: true,
            },



        ],
    );
    const columnsOil = useMemo(
        () => [
            {
                title: '服务名称',
                dataIndex: 'oilName',
                hideInSearch: true,
            },
            {
                title: '原价',
                dataIndex: 'guidePrice',
                hideInSearch: true,
            },
            {
                title: '优惠价格',
                dataIndex: 'privilegePrice',
                hideInSearch: true,
            },
            {
                title: '店铺首页位置',
                dataIndex: 'sort',
                hideInSearch: true,
            },
            //  {
            //     title: '生成订单数',
            //     dataIndex: 'createtime',
            //     hideInSearch: true,
            // },
            {
                title: '添加服务时间',
                dataIndex: 'createTime',
                hideInSearch: true,
            },



        ],
    );
    return (

        <Wrapdiv>
            <ProTable
                columns={option===2?columns:columnsOil}
                request={option===2?getMerchantSInfo:getOilMerchantx}
                pagination={false}
                search={option===2}
                rowKey="id"
                beforeSearchSubmit={beforeSearchSubmit}
            />
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
export default ServiceInfo;
