/* eslint-disable default-case */
/* eslint-disable consistent-return */
import React, {useState,useEffect } from 'react';
import styled from 'styled-components';
import {Modal, Radio,Row,Col,Divider,message} from 'antd';
import ProTable from '@ant-design/pro-table';

const AcModalSet=props => {
const {setAcState,width="auto",setSelectRow,getCouponActivityList,
setclicked,acSelectId,setacSelectId,acState}=props;
const [currentKey,setcurrentKey]=useState([])
useEffect(()=>{
  if(acSelectId){

    setcurrentKey([acSelectId]);
  }
  
},[acSelectId])
const getCouponActivityLists=(payload)=>getCouponActivityList(
  {pagesize:payload.pageSize,current:payload.current,status:1})
const [currentRow,setcurrentRow]=useState([]);
console.log(props,"xxyyzz")
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'name',
    hideInSearch:true
  },
  {
    title: '优惠券名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '优惠券类型',
    dataIndex: 'couponType',
    key: 'couponType',
    hideInSearch:true,
    render:(coupontype)=>{
        switch (coupontype) {
          case 1:
            
            return <div>满减券</div>
          case 2:
            
            return <div>折扣券</div>
          case 3:
            
            return <div>商品兑换券</div>
        
          default:
            break;
        }
    }
  },
  {
    title:"优惠券内容",
    dataIndex:"couponContent",
    key:"couponContent",
    hideInSearch:true,
    render: (value, row) => {
      let str = '--'
      switch (row.couponType){
        case 1:  // 满减券
          if(row.useCondition===0){ // 无门槛
            str = `${'无门槛减'}${row.faceValue}元`
          }else{
            str = `满${row.matchAmount}减${row.faceValue}元`
          }
          break;
        case 2: // 折扣券
        if(row.useCondition===0){ // 无门槛
          str = `${'无门槛打'}${row.faceValue}折`
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
    title:"剩余库存",
    dataIndex:"totalNum",
    key:"totalNum",
    hideInSearch:true,
    render:(text,row)=>{
      return (
      <div >{`${text===-1?"无限":text-(row.receiveNum)}`}</div>
      )
    }
  },
  {
    title:"已使用",
    dataIndex:"useNum",
    key:"useNum",
    hideInSearch:true
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    hideInSearch:true,
    render:(coupontype)=>{
        switch (coupontype) {
          case 1:
            
            return <div>进行中</div>
          case 2:
            
            return <div>已失效</div>
          case -1:
            
            return <div>未开始</div>
        
          default:
            break;
        }
    
    }
  },
];


const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {

    const s=selectedRows[0]
    setcurrentRow([{...s,num:1}])
    setclicked(false);
    setcurrentKey(selectedRowKeys)
    
    
  }
};
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
return (


    <Modal visible={acState}
      onCancel={()=>{setAcState(false)}}
      closable={false}
      width={900}
      onOk={()=>{
        // console.log(currentRow,"currentRow");
        if(currentRow[0]&&currentRow[0].id){
          setSelectRow(currentRow)
          
        }else{
          setSelectRow([])
        }
        const ids=currentRow.map((item)=>(item.id))
        console.log(ids,"currentRow");
        if(ids[0]){

          setacSelectId(ids[0]);
        }
        setAcState(false)
      }}
    >
     <Row>
      <Col span="3">
        <Radio.Group>
           <Radio.Button>
             平台优惠券
           </Radio.Button>
        </Radio.Group>
      </Col>
      <Divider type="vertical" style={{height:"50vh"}}/>
      <Col span="20" >
        <Wraph4>

        <b>选择活动</b>
        <Divider/>
        </Wraph4>

        <Wdiv>
        <Radio.Group>
           <Radio.Button>
           优惠券管理
           </Radio.Button>
        </Radio.Group>
        <WrapProTable 
        request={getCouponActivityLists} 
        columns={columns} 
        pagination={{pageSize:10}}
        rowKey="id"
        rowSelection={{...rowSelection,type:"radio",selectedRowKeys:currentKey}}
        form={{...formItemLayout}}
        options={{fullScreen:false,reload:false,density:false,setting:false,search:false}}
        />
        </Wdiv>
        </Col>
      </Row>
    </Modal>


);
}
export default AcModalSet;

const WrapProTable=styled(ProTable)`
  .ant-pro-table-search{
    padding:0;
    margin:0;

  }
  .ant-pro-table-toolbar{
    padding:0px;
    display:none;
  }
  .ant-pro-table-search .ant-col>.ant-form-item{
    .ant-form-item-control-input{
      position:absolute;
    min-width:180px;
    }
  }
  .ant-pro-table-search .ant-form-item{
    /* width:100px; */
    padding:0;
    margin:0;
    min-width:350px;
  .ant-input-affix-wrapper{
    padding:4px;
  }
  }
  .ant-row-start{
    width:70%;
    padding-left:36%;
  }
  .ant-card-body .ant-pro-table-toolbar{
    padding:0px;
    display:none !important;
  }
  .ant-btn-primary   {
    position: absolute;
    right: -20px !important;
    top: 0;
  }
  .ant-btn{
    position: absolute;
    right: -94px;
    top: 0;
  }
`;

const Wraph4=styled.h4`

.ant-divider-horizontal{
  margin:10px 0;
}
`;

const Wdiv=styled.div`
  .ant-radio-group{
    position: absolute;
    line-height: 54px;
    height: 60px;
  }

`;
