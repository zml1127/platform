/* eslint-disable no-nested-ternary */
import React, { useState,useEffect } from 'react';
import { Form, Row, Col, Checkbox, DatePicker, Select,Button } from 'antd';
// import ImgTemp from './up.svg';
import { goSwtich } from './commonColumns';

const { Option } = Select;
export default props => {
    const { Item } = Form
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setMaterState, setAcState, photourl, selectRow,currentJumpType,current,form } = props;

    const goTypeData = [
        { name: "跳转指定页面", key: 1 },
        { name: "跳转小程序", key: 2 },
        { name: "跳转链接", key: 3 },
        { name: "跳转活动", key: 4 },
        { name: "不跳转", key: 0 },
    ]
    // form.
    // console.log(form.getFieldValue("jumpType"),form.getFieldsValue("jumpType"));
    console.log(current,"currentxqxqxq");
    const [goType, setGoType] = useState(1);
    useEffect(()=>{
        setGoType(currentJumpType)
        
    },[currentJumpType])
    const handleGoType = (currentx) => {
        console.log(currentx, "current");
        setGoType(currentx)
    }
    //
    console.log(form.getFieldValue('startLimitFlag'),"startLimitFlag");
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


            <Item label="选择图片" name="pic"
                rules={[{
                    required: true,
                    message: "请选择图片"
                }]}
            >
                {
                    photourl ?
                        <img src={photourl} alt="图片" key={photourl} onClick={() => { setMaterState(current===3?2:current) }} width={300}/>
                       // : <img src={ImgTemp} alt="上传图片" onClick={() => { setMaterState(current===3?2:current) }} />
                       :<Button onClick={() => { setMaterState(current===3?2:current) }}>点击上传图片</Button>
                }

            </Item>
            <Row >
                <Col span={12} >

                    <Item label="有效期" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} name="startTime"
                        rules={[{
                            required: !startDis,
                            message: "请输入开始时间"
                        }]}
                    >
                        <DatePicker placeholder="请输入开始时间" format="YYYY-MM-DD 00:00:00" disabled={startDis}/>
                    </Item>
                </Col>
                <div style={{ "line-height": "32px" }}>
                    <Item name="startLimitFlag" wrapperCol={{ span: 24 }}
                     valuePropName="checked">
                        <Checkbox onClick={(e) => { setsDis((e.target.checked)) }} value={1}>不限</Checkbox>
                    </Item>
                </div>
            </Row>
            <Row>
                <Col span={12} >
                    <Item name="endTime" wrapperCol={{ span: 10, offset: 4 }}

                        rules={[{
                            required: !endDis,
                            message: "请输入结束时间"
                        }]}
                    >
                        <DatePicker placeholder="请输入结束时间" format="YYYY-MM-DD 23:59:59" disabled={endDis}/>
                    </Item>
                </Col>
                <div style={{ "line-height": "32px" }} >
                    <Item name="endLimitFlag" wrapperCol={{ span: 24 }}
                         valuePropName="checked"
                    >
                        <Checkbox onClick={(e) => { seteDis((e.target.checked)) }} value={1}>不限</Checkbox>
                    </Item>
                </div>
            </Row>
                          
            <Item name="jumpType" label="跳转形式">
                <Select onChange={handleGoType} value={goType}>
                    {goTypeData.map((item) => {
                        return (<Option key={item.key} value={item.key}>{item.name}</Option>)
                    })
                    }
                </Select>
            </Item>
            {goSwtich(goType, selectRow, setAcState)}
        </div>
    )
}