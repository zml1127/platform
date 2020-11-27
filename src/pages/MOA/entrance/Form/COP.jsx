import React, { useState,useEffect} from 'react';
import {Form, Input,Row,Col,Checkbox,DatePicker,Select, Table } from 'antd';
import ProtableSelect from '@/utils/merchantSelect';
import { PlusOutlined} from '@ant-design/icons';
import ColumnsCom from './commonColumns';

const {Option}=Select;
export default props => {
    
console.log(props)
const {Item}=Form

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const {selectRow,setAcState,merchantIds,setmerchantIds,form}=props;



//
const [startDis,setsDis]=useState(false)
const [endDis,seteDis]=useState(false)
   //
useEffect(()=>{
    const a=form.getFieldValue('startLimitFlag')
    setsDis(a===1||a===true)
},[form.getFieldValue('startLimitFlag')])
useEffect(()=>{
    const b=form.getFieldValue('endLimitFlag')
    seteDis(b===1||b===true)
},[form.getFieldValue('endLimitFlag')])

const [payState,setPayState]=useState(false);
return (

<div>
       <Item label="名称" name="bannerName" rules={[{
           required:true,
           message:"请输入名称"
       }]} >
            <Input />
       </Item>
        <Row >
        <Col span={4} >
       
        <Item label="有效期" labelCol={{span: 10,offset:2}} wrapperCol={{span: 10}} name="startTime">
            <DatePicker format="YYYY-MM-DD 00:00:00"  disabled={startDis}/>
        </Item>
        </Col>
        <div style={{"line-height":"32px"}}>
        <Item name="startLimitFlag" wrapperCol={{span:24}}
            valuePropName="checked"
        >
            <Checkbox onChange={(e)=>{setsDis(e.target.checked)}} value={1}>不限</Checkbox>
        </Item>
        </div>
        </Row>
        <Row>
        <Col span={4} >
        <Item name="endTime"  wrapperCol={{span: 10,offset:12}}>
                <DatePicker format="YYYY-MM-DD 23:59:59"  disabled={endDis}/>
        </Item>
        </Col>
        <div style={{"line-height":"32px"}} >
        <Item name="endLimitFlag" wrapperCol={{span:24}}
            valuePropName="checked"
        >
            <Checkbox onChange={(e)=>{seteDis(e.target.checked)}} value={1}>不限</Checkbox>
        </Item>
        </div>
        </Row>
        <Row>
            <Col span="6">
        <Item name="matchAmount" label="参与条件" labelCol={{offset:2,span:6}} wrapperCol={{span:18}}>
              <Select onChange={(e)=>{setPayState(e!==0)}}>
                  <Option value={0}>不限制</Option>
                  <Option value={1}>
                          支付需满
                </Option>
              </Select>
        </Item>
            </Col>
            <Col span="10">
            
        {
            payState?
            <Item name="matchAmounts" wrapperCol={{span:10}} rules={[
                {
                    pattern:/^[1-9]\d*$/,
                    required:true,
                    message:"请输入正确的数值"
                }
            ]}>

                <Input addonAfter="元" maxLength={5}/>
            </Item>:null
        }
        </Col>
        </Row>
        <Item name="addAc" wrapperCol={{offset:2}}>
           {Array.from(selectRow).length !== 0 ?
           <div onClick={()=>{setAcState(true)}}>
             <Table columns={ColumnsCom()} dataSource={Array.from(selectRow)} pagination={false} />
             </div> :
             <div onClick={() => { setAcState(true) }}>

               <PlusOutlined />添加活动 </div>
            }   
                
                {/* <Button onClick={()=>{setAcState(true)}}>+添加活动</Button> */}
        </Item>
       
        
        <ProtableSelect setRowKeys={setmerchantIds} selectKey={merchantIds}/>
        </div>
)
        }