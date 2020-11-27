import { connect } from 'dva';
import React, { memo,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Radio,Card,Space,Button } from 'antd';
// import styled from 'styled-components';
import BasicPage from './basic';
import ServiceInfo from './serviceInfo';
import Marketing from './marketing';
import Around from './around/around'

export default connect(
    ({global, merchant, loading,makeGroup}) => ({
		cityList: global.cityList, // 省市区数据
        basicPosition:global.cityListBasic,
        switchLoading: loading.effects['around/getExtendcouponmerchantUpdateStatus'],
        typeMap: merchant.typeMap,
    }),
    dispatch=>({
        async getMerchantListById(id) {
            return dispatch({
                type: 'merchant/getMerchantId',
                id
            });
        },
        async getOilMerchantId(payload) {
            return dispatch({
                type: 'merchant/getOilMerchantId',
                payload
            });
        },
        async getMerchantserviceTag() {
            return dispatch({
                type: 'merchant/getMerchantserviceTag',
            });
        },

        async getExtendcouponListM (payload,id,typeForMerchant) {
            return dispatch({
                type: 'around/getExtendcouponListM',
                payload:{
                    ...payload,
                    merchantId:id,
                    typeForMerchant
                },
            });
        },
        async getDeleteByExtendCouponId  (payload) {
            return dispatch({
                type: 'around/getDeleteByExtendCouponId',
                payload,
            });
        },
        async getExtendcouponmerchantUpdateStatus  (payload) {
            return dispatch({
                type: 'around/getExtendcouponmerchantUpdateStatus',
                payload,
            });
        },
        async getExtendcouponTypeList  (payload) {
			return dispatch({
				type: 'couponMaintain/getExtendcouponTypeList',
				payload,
			});
        },
        // 店铺下商户列表
        async getListForExtendCouponMerchant  (payload) {
            return dispatch({
                type: 'around/getListForExtendCouponMerchant',
                payload,
            });
        },
        // 店铺下商户库存修改
        async updateMerchantStock  (payload) {
            return dispatch({
                type: 'around/updateMerchantStock',
                payload,
            });
        },
         // 获取服务类型列表 
         async getServiceCategoryList(payload, type) {
			return dispatch({
				type: 'coupon/getServiceCategoryList',
			});
        },
        
    }))
    (memo(props => {
        const id = props.location.query.id?props.location.query.id:localStorage.getItem("merchantId");
        const {type,tabType} = props.location.query;
        const [active,setActive]=useState(type?Number(type):1);
        const [option,setOption]=useState(1);
        const { 
            getMerchantListById,
            getOilMerchantId,
            basicPosition,
            cityList,
            getMerchantserviceTag,
            getExtendcouponmerchantUpdateStatus,
            getListForExtendCouponMerchant,
            getDeleteByExtendCouponId,
            getExtendcouponListM,
            getExtendcouponTypeList,
            updateMerchantStock,
            switchLoading,
            typeMap,
            getServiceCategoryList 
        }=props;
        
        const ChildDom=(currentActive)=>{
            switch (currentActive) {
                case 1:
                    return(
                        <BasicPage
                            getMerchantListById={getMerchantListById}
                            setOption={setOption}
                            getMerchantserviceTag={getMerchantserviceTag}
                            position={basicPosition}
                            id={id}
                            typeMap={typeMap}
                        />
                    )
                case 2:
                    return(
                        <ServiceInfo
                            getMerchantListById={getMerchantListById}
                            id={id}
                            option={option}
                            getOilMerchantId={getOilMerchantId}
                        />
                    )
                case 3:
                    return(
                        <Marketing
                            getMerchantListById={getMerchantListById}
                            id={id}
                        />
                    )
                case 4:
                    return(
                        <Around
                            getOilMerchantId={getOilMerchantId}
                            cityList={cityList}
                            id={id}
                            tabType={tabType}
                            getExtendcouponListM={getExtendcouponListM}
                            getExtendcouponmerchantUpdateStatus={ getExtendcouponmerchantUpdateStatus }
                            getDeleteByExtendCouponId={getDeleteByExtendCouponId}
                            getExtendcouponTypeList={getExtendcouponTypeList}
                            getListForExtendCouponMerchant = { getListForExtendCouponMerchant }
                            updateMerchantStock = { updateMerchantStock }
                            switchLoading={switchLoading}
                            getServiceCategoryList = { getServiceCategoryList }
                        />
                    )
                default:
                    return(
                        <BasicPage
                            getMerchantListById={getMerchantListById}
                            setOption={setOption}
                            getMerchantserviceTag={getMerchantserviceTag}
                            position={basicPosition}
                            id={id}/>
                    )
            }
    }

    return (
    <PageHeaderWrapper extra={[
        <Button onClick={()=>{props.history.push(`edit?id=${id}`);}}>编辑</Button>
    ]}
    footer={
        <Button onClick={()=>{props.history.push('/merchantManage/merchant')}}>返回</Button>
    }
    >
        <Card title={
        <div>
            <Space>
                <Radio.Group value={active} onChange={(e)=>{setActive(e.target.value)}}>
                    <Radio.Button  value={1} key="1">店铺信息</Radio.Button>
                    <Radio.Button  value={2} key="2">服务信息</Radio.Button>
                    <Radio.Button  value={3} key="3">营销活动</Radio.Button>
                    <Radio.Button  value={4} key="4" >周边优惠券</Radio.Button>:null
                    
                </Radio.Group>
            </Space>
        </div>}
        >
        {ChildDom(active)}
        </Card>
    </PageHeaderWrapper>
    );
    }),
);
