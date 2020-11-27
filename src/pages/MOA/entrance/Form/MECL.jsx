import React, { useState,useEffect } from 'react';
import {Form,Row,Col,Checkbox,DatePicker,Select } from 'antd';
import ProtableSelect from '@/utils/merchantSelect';
import Button from 'antd/es/button';
import ImgTemp from './up.svg';
import {goSwtich} from './commonColumns';

const {Option}=Select;
export default props => {

const {Item}=Form

const {setMaterState,setAcState,merchantIds,setmerchantIds,photourl,currentJumpType,form,
    selectRow}=props;
    const [startDis,setsDis]=useState(false)
    const [endDis,seteDis]=useState(false)
const goTypeData=[
    {name:"跳转指定页面",key:1},
    {name:"跳转小程序",key:2},
    {name:"跳转链接",key:3},
    {name:"跳转活动",key:4},
    {name:"不跳转",key:0},
]
const [goType,setGoType]=useState(currentJumpType||1);
useEffect(()=>{
    setGoType(Number(currentJumpType))
    console.log(currentJumpType,"currentJumpType");
},[currentJumpType])
const handleGoType=(current)=>{
    console.log(current,"current");
    setGoType(current)
}
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
    

        <Item label="选择图片" name="pic">
            {
                photourl?
                <img src={photourl} alt="图片" key={photourl}  onClick={()=>{setMaterState(2)}}/>
            //    : <img src={ImgTemp} alt="上传图片" onClick={()=>{setMaterState(2)}}/>
               :<Button onClick={()=>{setMaterState(2)}}>点击上传图片</Button>
            }
            
        </Item>
        <Row >
        <Col span={4} >
        <Item label="有效期" labelCol={{span: 10,offset:2}} wrapperCol={{span: 10}} name="startTime">
            <DatePicker format="YYYY-MM-DD 00:00:00" disabled={startDis}/>
        </Item>
        </Col>
        <div style={{"line-height":"32px"}}>
        <Item name="startLimitFlag" wrapperCol={{span:24}}
            valuePropName="checked"
        >
            <Checkbox  onChange={(e)=>{setsDis(e.target.checked)}} value={1}>不限</Checkbox>
        </Item>
        </div>
        </Row>
        <Row>
        <Col span={4} >
        <Item name="endTime"  wrapperCol={{span: 10,offset:12}}>
                <DatePicker format="YYYY-MM-DD 23:59:59" disabled={endDis}/>
        </Item>
        </Col>
        <div style={{"line-height":"32px"}} >
        <Item name="endLimitFlag" wrapperCol={{span:24}}
            valuePropName="checked"
        >
            <Checkbox onChange={(e)=>{seteDis(e.target.checked)}} value={1} >不限</Checkbox>
        </Item>
        </div>
        </Row>

        <Item name="jumpType" label="跳转形式">
            <Select onChange={handleGoType} value={goType}>
                {goTypeData.map((item)=>{
                    return (<Option key={item.key} value={item.key}>{item.name}</Option>)
                })
                }
            </Select>
        </Item>
        {goSwtich(goType,selectRow,setAcState)}
        
        <ProtableSelect setRowKeys={setmerchantIds} selectKey={merchantIds} pageSize="20"/>
        </div>
)
        }