import { connect } from 'dva';
import React, { memo,useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Button,Tabs } from 'antd';
import styled from 'styled-components';
import {Banner} from './table/Banner';
import Capsule from './table/capsule';// 胶囊位
import Pay from './table/Pay';
import {FirstModal} from './table/firstModal';
import {Center} from './table/center';


const {TabPane}=Tabs;
export default connect(
() => ({}),
dispatch=>({
    async getEntranceListPlat(payload) {
        const params = { ...payload };
        // getPageForPEJ
        return dispatch({
            type: 'activitylist/postlistForPEJ',
            payload: {
                ...params,
            },
        });
    },
    async getPageForMerchant(payload) {
        const params = { ...payload };
        // getPageForPEJ
        return dispatch({
            type: 'activitylist/getPageForPEJMerchant',
            payload: {
                ...params,
            },
        });
    },
    async getEntranceListStore(payload) {
        const params = { ...payload };
        return dispatch({
            type: 'moa/getEntranceListStore',
            payload: {
                ...params,
            },
        });
    },
    
    
})
)(memo(props => {

const {getEntranceListPlat,getPageForMerchant}=props;
const [tableState,setTable]=useState(sessionStorage.getItem("MOAState")||"1")

const TableSwitch=(currentState)=>{
    switch (currentState) {
        case "1":
            return  <Banner currentState={currentState} {...props} getEntranceListPlat={getEntranceListPlat} 
            />
        case "2":
            return  <Capsule 
            currentState={currentState}
            {...props} getEntranceListPlat={getEntranceListPlat}
            getPageForMerchant={getPageForMerchant}/>
        case "6":
            return  <Pay 
            currentState={currentState}
            {...props} getEntranceListPlat={getEntranceListPlat}/>
        case "4":
            return  <FirstModal 
            currentState={currentState}
            {...props} getEntranceListPlat={getEntranceListPlat}/>
        case "7":
            return  <Center {...props} getEntranceListPlat={getEntranceListPlat}
            currentState={currentState}/>
        default:
            return  <Banner {...props} getEntranceListPlat={getEntranceListPlat}
            currentState={currentState}/>
    }
}
return (
<PageHeaderWrapper>
    <WrapDiv>
        <Tabs 
         defaultActiveKey={tableState}
         onChange={(value)=>{setTable(value)
         sessionStorage.setItem("MOAState",value)
        //  sessionStorage.setItem("MOAState2","1")
         }}>
                <TabPane tab="Banner" key="1" />
                <TabPane tab="胶囊位" key="2" />
                <TabPane tab="支付完成页" key="6" />
                <TabPane tab="首页弹窗" key="4" />
                <TabPane tab="福利中心" key="7" />
        </Tabs>
        <div style={{lineHeight:"50px"}}>
            <Button onClick={()=>{
                props.history.push(`entrance/edit?type=add`)
                // sessionStorage.setItem("MOAState","1")
            }}>新建活动入口</Button>
        </div>
    </WrapDiv>
   {TableSwitch(tableState)}
   
</PageHeaderWrapper>
);
})
);


const  WrapDiv =styled.div`
    display:flex;
    justify-content:space-between;
    background:white;
    padding:5px 20px;
`;