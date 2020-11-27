import { connect } from 'dva';
import React, { memo,useState , useCallback,useEffect } from 'react';
import {Radio,Space } from 'antd';
// import styled from 'styled-components';
import MUG from './MUG';
import Discount from './discount';



export default connect(
(
    {makeGroup}
) => ({serviceCategoryList: makeGroup.serviceCategoryList,}),
dispatch=>({

    async getSpellGroup(payload) {
        const params = { ...payload };
        return dispatch({
            type: 'merchant/getSpellGroup',
            payload: {
                ...params,
            },
        });
    },
    async getCouponGroup(payload) {
        const params = { ...payload };
        return dispatch({
            type: 'merchant/getCouponGroup',
            payload: {
                ...params,
            },
        });
    },
    async getServiceCategoryList(payload) {
        const params = { ...payload };
        return dispatch({
            type: 'makeGroup/getServiceCategoryList',
            payload: {
                ...params,
            },
        });
    },
    
})
)(
memo(props => {
const {getSpellGroup,getCouponGroup,serviceCategoryList,getServiceCategoryList }=props;
useEffect(()=>{
    getServiceCategoryList()
},[])
const [active,setActive]=useState(1);
const ChildDom=useCallback((currentActive)=>{
    switch (currentActive) {
        case 1:
            return(
                <MUG getMerchantList={getSpellGroup} {...props} serviceCategoryList={serviceCategoryList}/>
            )
        case 2:
            return(
                <Discount getMerchantList={getCouponGroup} {...props}/>
            )
        default:
            return(
                <MUG getMerchantList={getSpellGroup} {...props}  serviceCategoryList={serviceCategoryList}/>
            )
    }
},[active])

        return (
            <div>
                <div>  
                    <Space>
                        <Radio.Group value={active} onChange={(e)=>{setActive(e.target.value);}}>
                        <Radio.Button value={1}>拼团</Radio.Button>
                        <Radio.Button value={2}>优惠券</Radio.Button>   
                        </Radio.Group>
                    </Space>
                </div>
                {ChildDom(active)}
            </div>
        );
    }),
);
