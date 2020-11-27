/* eslint-disable no-case-declarations */
/* eslint-disable consistent-return */
import React from 'react';
import { Select, Table, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Item } = Form;
const { Option } = Select;
const CommonCol = () => {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'ID',
            hideInSearch: true,
        },
        {
            title: '活动名称',
            dataIndex: 'activityName',
            key: 'activityName',
        },
        {
            title: '活动内容',
            dataIndex: 'typeName',
            key: 'typeName',
            hideInSearch: true,
        },
        {
            title: '明细',
            dataIndex: 'detail',
            key: 'address',
            hideInSearch: true,

        },
        {
            title: '库存',
            dataIndex: 'maxNum',
            key: 'maxNum',
            hideInSearch: true,
            render: (item, record) => {
                return <div>{record.remainNum}/{item}</div>
            }

        },
        {
            title: '有效期',
            dataIndex: 'startLimitFlag',
            key: 'startLimitFlag',
            hideInSearch: true,
            render: (item, record) => {
                return <div>{item === 1 ? "开始长期" : record.startTime}-
        {record.endLimitFlag === 1 ? "结束长期" : record.endTime}</div>
            }

        },
        {
            title: '状态',
            dataIndex: 'activityStatus',
            key: 'activityStatus',
            hideInSearch: true,
            renderFormItem: (_item, { value, onChange }) => (
                <Select defaultValue={value} onChange={onChange}>
                    <Option value={1} key="1">
                        进行中
                </Option>
                    <Option value={2} key="2">
                        未开始
                </Option>
                    <Option value={0} key="3">
                        已失效
                </Option>
                </Select>
            ),
            render: (text) => {
                switch (text) {
                    case 1:

                        return <div>进行中</div>
                    case 2:
                        return <div>未开始</div>
                    case 0:
                        return <div>已失效</div>
                    default:
                        return <div>--</div>
                }
            }
        }
    ]
    return columns

}
export const goSwtich = (got, selectRow, setAcState) => {
    switch (got) {
        case 0:
            return null
        case 1:
        case 3:
            return (
                <div>
                    <Item name="url" label="URL" rules={[{
                        required: true
                    }]}>
                        <Input />

                    </Item>
                    <Item name="param" label="参数">
                        <Input />

                    </Item>

                </div>
            )
        case 2: // 小程序
            return (
                <div>
                    <Item name="url" label="URL" rules={[{
                        required: true
                    }]}>
                        <Input />

                    </Item>
                    <Item name="param" label="参数">
                        <Input />
                    </Item>
                    {/* <Item name="Appid" label="Appid" rules={[{
                        required: true
                    }]}>
                        <Input />
                    </Item> */}
                </div>
            )
        case 4:
            const result=!selectRow.length?
            <Item wrapperCol={{offset:2}}>
            <div onClick={() => { setAcState(true) }} style={{color:"#1890ff",cursor:"pointer"}}>
                
                <PlusOutlined />添加活动 </div></Item>:
             <div onClick={() => {setAcState(true)}}>
             <Table columns={CommonCol()} dataSource={Array.from(selectRow)} pagination={false}
             /> </div> 
            return (<div>
                {result}
            </div>)
        default:
            break;
    }
}


export default CommonCol;
