import React,{useState,useEffect }  from 'react';
import {Form,Row,Col,Checkbox,DatePicker,Table } from 'antd';
import { PlusOutlined} from '@ant-design/icons';
import ColumnsCom from './commonColumns';

export default props => {
const {Item}=Form

const {setAcState,selectRow,form}=props;
const [startDis,setsDis]=useState(false)
const [endDis,seteDis]=useState(false)
useEffect(()=>{
    const a=form.getFieldValue('startLimitFlag')
    setsDis(a===1||a===true)
},[form.getFieldValue('startLimitFlag')])
useEffect(()=>{
    const b=form.getFieldValue('endLimitFlag')
    seteDis(b===1||b===true)
},[form.getFieldValue('endLimitFlag')])
return (

<div>
        <Row >
        <Col span={8} >
        <Item label="有效期" labelCol={{span: 6}} wrapperCol={{span: 10}} name="startTime">
            <DatePicker format="YYYY-MM-DD 00:00:00"  disabled={startDis}/>
        </Item>
        </Col>
        <div style={{"line-height":"32px"}}>
        <Item name="startLimitFlag" wrapperCol={{span:24}}  valuePropName="checked">
            <Checkbox onChange={(e)=>{setsDis(e.target.checked)}} value={1}>不限</Checkbox>
        </Item>
        </div>
        </Row>
        <Row>
        <Col span={8} >
        <Item name="endTime"  wrapperCol={{span: 10,offset:6}}>
                <DatePicker format="YYYY-MM-DD 23:59:59"  disabled={endDis}/>
        </Item>
        </Col>
        <div style={{"line-height":"32px"}} >
        <Item name="endLimitFlag" wrapperCol={{span:24}}  valuePropName="checked">
            <Checkbox onChange={(e)=>{seteDis(e.target.checked)}} value={1}>不限</Checkbox>
        </Item>
        </div>
        </Row>
        
        <Item name="addAc" label="添加活动" wrapperCol={24}>
           {Array.from(selectRow).length !== 0 ?
             <div onClick={()=>setAcState(true)}>
             <Table columns={ColumnsCom()} dataSource={Array.from(selectRow)} pagination={false} /> </div>:
             <div onClick={() => { setAcState(true) }}>

               <PlusOutlined />添加活动 </div>
            }   
                
        </Item>

        </div>
)
        }