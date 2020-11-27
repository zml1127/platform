/* eslint-disable consistent-return */
import React, { useState, useCallback, useEffect } from 'react';
import { Form, Select, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { photoIsNoTwoMB } from '@/utils/utils';
import OSS from 'ali-oss';
import ImgTemp from './up.svg';

const { Option } = Select;
export default props => {

    console.log(props)
    const { Item } = Form
    const { ossToken, setAcState, selectRow, getStsToken, form,photourl,
        choosePhoto,setMaterState} = props;
    const [imgUrlOnly, setImgUrlOnly] = useState(photourl) // 头图

    const [ossTokencurrent, setossToken] = useState(ossToken);
    const getStsTokenFn = useCallback(async () => {
        const res = await getStsToken();
        if (res) {
            console.log(res.data, "xxyyzz");
            setossToken(res.data)
        }
    }

        , [ossTokencurrent])
    useEffect(() => {
        getStsTokenFn();
        
    }, [ossToken]);

    
    useEffect(()=>{
        setImgUrlOnly(photourl)
    },[photourl])
    const getUrl = useCallback(async (file) => {


        if (ossTokencurrent && JSON.stringify(ossTokencurrent) !== "{}") {
            if (ossTokencurrent.expiration > Date.now()) { // 没有过期
                const client = new OSS({
                    region: ossTokencurrent.region,
                    accessKeyId: ossTokencurrent.accesKeyId,//
                    accessKeySecret: ossTokencurrent.accesKeySecret,//
                    stsToken: ossTokencurrent.securityToken, //
                    bucket: ossTokencurrent.bucket, //
                })


                

                    const rl = await client.put(`/ptd/merchantIconc${Date.now()}`, file)
                    if (rl) {
                        console.log(rl, "r1r1r1r1");
                        return rl.url.replace("http://sk-business.oss-cn-zhangjiakou.aliyuncs.com", "http://sk-oss.shangkehy.com")
                    }
                
                // }
            }
            else {
                getStsToken().then(res => {

                    if (res.msg === "ok") {
                        getUrl(file)
                    }
                })
            }
        }
    }, [ossTokencurrent])
    // 上传之前
    const beforeUploadheadPic = useCallback(async file => {  // 上传文件之前的钩子
        if (photoIsNoTwoMB(file)) {
            const res = await getUrl(file)
            // return resData
            console.log(res, "resxxqqzz");
            if (res) {

                // form.setFieldsValue({ icon: res })
                setImgUrlOnly(res);
                choosePhoto(res)
            }
        }
    }, [ossTokencurrent, imgUrlOnly, form.getFieldValue('icon')])
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
            dataIndex: 'totalNum',
            key: 'totalNum',
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
        },
    ];

    return (
        <div>
            {
                selectRow.length === 0 &&
                <Item name="add" label="添加活动">
                    <Button onClick={() => { setAcState(true) }}>
                        <PlusOutlined />点击设置
                    </Button>
                </Item>
            }
            <Item name="name" label="活动名称" rules={[{
                required:true,
                message:"活动名称不能为空"
            }]}>
                <Input />
            </Item>
            <Item name="icon" label="ICON">
                {
                    photourl ?
                        <img src={photourl} alt="图片" key={photourl} onClick={() => { setMaterState(3) }} width={300}/>
                        // : <img src={ImgTemp} alt="上传图片" onClick={() => { setMaterState(3) }} />
                        :<Button onClick={()=>{setMaterState(3)}}>点击上传ICON</Button>
                }
                {/* <Upload
                    beforeUpload={beforeUploadheadPic}
                    name="file"
                    showUploadList={false}
                    customRequest={() => false}
                >
                    {imgUrlOnly ? (
                        <img
                            src={imgUrlOnly}
                            alt="avatar"
                            style={{ width: '150px', height: '150px' }}
                        />
                    ) : (
                            <div
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    border: '1px solid #333',
                                    textAlign: 'center',
                                    lineHeight: '150px',
                                }}
                            >
                                <PlusOutlined style={{ fontSize: '36px' }} />
                            <div className="ant-upload-text">点击上传</div> 
                            </div>
                        )}
                </Upload> */}
            </Item>
            {
                Array.from(selectRow).length !== 0 &&
                <div onClick={() => { setAcState(true) }}>
                    <ProTable
                        columns={columns}
                        dataSource={selectRow}
                        pagination={false}
                        search={false}
                        options={{ fullScreen: false, reload: false, density: false, setting: false, search: false }}
                    />
                </div>
            }
        </div>
    )
}
