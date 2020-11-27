/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
import { connect } from 'dva';
import React, { memo, useState, useEffect } from 'react';
import { Select, Form, Button, Space, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    doPostActivityCreate, doPostActivityUpdate,
    doGetDetail,
    doGetByIdDetail
} from '@/services/activity';
import moment from 'moment';
import { OssUrlPreFix, optionDataDom, MOAactivity } from '@/utils/utils';
import PlatBan from './Form/platBanner';// 平台banner 1// 平台胶囊 2// 我的胶囊 3
import HPPW from './Form/HPPW';// 首页弹窗 4
import MECL from './Form/MECL';// 商户端胶囊 5
import COP from './Form/COP';// 支付完成 6 
import WelfareCenter from './Form/welfareCenter';// 福利中心 7
import MaterialModal from './Form/MaterialModal';// 素材库 弹框
import AcModal from './Form/AcModal';// 活动弹框 

// 福利中心    
const { Option } = Select;

export default connect(
    () => ({}),
    dispatch => ({
        async getOpmaterialPage(params, type) {
            return dispatch({
                type: 'operation/getOpmaterialPage',
                payload: {
                    ...params,
                    type
                }
            });
        },
        async postActivityPage(params, type) {
            return dispatch({
                type: 'activitylist/postActivityPage',
                payload: {
                    ...params,
                    type
                }
            });
        },
        async getStsToken() { // 获取用于oss的token
            return dispatch({
                type: 'global/getStsToken'
            })
        }


    })
)(
    memo(props => {
        const formatD = "YYYY-MM-DD 00:00:00" // 开始时间
        const formatF = "YYYY-MM-DD 23:59:59" // 结束时间
        const { getOpmaterialPage, postActivityPage, getStsToken } = props;
        //   选择活动
        const [selectRow, setSelectRow] = useState([]);
        //
        const [photourl, choosePhoto] = useState();
        // 设置活动回显ID
        const [acSelectId, setacSelectId] = useState();// 活动设置的回显ID

        //
        const [currentJumpType, setCurrentJumpType] = useState(1);
        //
        const { id, tabspane } = props.location.query
        // form.getFieldValue
        //
        // useEffect(()=>{

        // })
        //

        const [startDis,setsDis]=useState(false)
        const [endDis,seteDis]=useState(false)

        const [merchantIds, setmerchantIds] = useState([]);
        const [active, setActive] = useState(Number(tabspane) || 1);

        const [form] = Form.useForm();
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 4 },
        };
        // 请求服务详情
        useEffect(() => {
            if (id) {
                fetchComment(props.location.query.tabspane);
            } else {
                form.setFieldsValue({ "status": 1, "jumpType": 1, type: 1 })
            }
        }, [])
        async function fetchComment(a) {

            const res = await doGetDetail({ id, type: Number(a) }, Number(a))
            if (res.code === "0000") {
               
                form.setFieldsValue(
                    {
                        ...res.data,
                        "startTime": res.data.startTime ? moment(res.data.startTime): null,
                        "endTime": res.data.endTime ? moment(res.data.endTime) : null,
                        type: Number(a)
                    });
                if (res.data.activityId !== "0") {
                    setacSelectId(res.data.activityId)
                    const resxxx = await doGetByIdDetail(res.data.activityId);
                    await MOAactivity(resxxx, setSelectRow)
                }
                setsDis(!!res.data.startTime)
                seteDis(!!res.data.endTime)
            }
            switch (Number(a)) {
                case 1:
                case 2:
                case 3:
                    choosePhoto(res.data.pic)
                    setCurrentJumpType(res.data.jumpType)

                    break;
                case 4:
                    choosePhoto(res.data.pic)
                   
                    break;
                case 5:
                    choosePhoto(res.data.pic)
                    setCurrentJumpType(res.data.jumpType)
                    setmerchantIds(res.data.merchantIds)
                    break;
                case 6:
                    choosePhoto(res.data.pic)

                    setmerchantIds(res.data.merchantIds)
                  

                    break;
                case 7:
                    choosePhoto(res.data.icon)
                    
                    break;

                default:
                    break;
            }
        }


        // form.setFieldsValue({type:active})

        const beforeSubmit = (cValue) => {
            const result = { ...cValue }
            if (Number(cValue.type) !== 7) {
                if (cValue.startLimitFlag) {
                    delete result.startTime
                    result.startLimitFlag = 1
                } else {
                    delete result.startLimitFlag
                    result.startTime = moment(cValue.startTime).format(formatD);
                }

                if (cValue.endLimitFlag) {
                    delete result.endTime
                    result.endLimitFlag = 1
                } else {
                    delete result.endLimitFlag
                    result.endTime = moment(cValue.endTime).format(formatF);
                    // .format("YYYY-MM-DD HH:mm:SS")
                }
            }
            const activityId = selectRow.map((item) => {
                return item.id
            })[0];
            switch (Number(cValue.type)) {
                case 1:
                case 2:
                case 3:

                    if (cValue.jumpType === 0) {
                        delete result.URL;
                        delete result.param;
                    }

                    return { ...result, type: Number(result.type), activityId };
                case 4:
                    return { ...result, type: Number(result.type), activityId };
                case 5:
                    return { ...result, type: Number(result.type), activityId, merchantIds };
                case 6:
                    return { ...result, type: Number(result.type), activityId, merchantIds };
                case 7:
                    const icon = photourl.replace(OssUrlPreFix, "");
                    return { ...result, type: Number(result.type), activityId, icon };
                default:
                    break;
            }
        }
        // 提前校验
        const beforeVaild = (value) => {
            // if(value.icon||value.pic)
            if (Number(value.startLimitFlag) !== 1 && Number(value.endLimitFlag) !== 1) {
                if (value.endTime && value.startTime) {
                    const s = moment(value.startTime).valueOf();
                    const e = moment(value.endTime).valueOf();
                    if (s > e) {
                        message.warning("有效期开始时间应小于有效期结束时间");
                        return false
                    }
                }
            }
            if (value.jumpType === 4 && !(selectRow.length)) {
                message.warning("请选择关联活动")
                return false
            }

            if (value.type >= 4 && value.type !== 5) {
                if (selectRow.length === 0) {
                    message.warning("请添加活动")
                    return false
                }
            }
            if (value.type === 6 || value.type === 5) {
                if (merchantIds.length === 0) {
                    message.warning("请选择关联店铺")
                    return false
                }
            }
            return true;
        }
        const onFinish = (Value) => {
            if (beforeVaild(Value)) {

                const res = beforeSubmit(Value);
                // console.log(res,);
                if (id) {
                    doPostActivityUpdate({ ...res, id }).then((r) => {
                        if (r.code === "0000") {
                            message.success("编辑成功")
                            props.history.goBack()
                        } else {
                            message.warning("操作失败")
                        }

                    })
                } else {
                    doPostActivityCreate(res).then((r) => {
                        if (r.code === "0000") {
                            message.success("新增成功")
                            props.history.goBack()
                        } else {
                            message.warning("操作失败")
                        }
                    })
                }
            }

        }
        const [materState, setMaterState] = useState(0);// 素材库 弹框 状态
        const [acState, setAcState] = useState(false);// 活动 弹框 状态

        // 活动 useState
        // 素材库 useState
        const tableView = (current) => {
            const props = {
                setMaterState, setAcState, photourl, form, selectRow, current, currentJumpType, setmerchantIds
                , merchantIds, setSelectRow, getStsToken, choosePhoto,setsDis,seteDis,startDis,endDis
            };
            
            switch (String(current)) {
                case "1":
                case "2":
                case "3":
                    // if(upState){
                    //     choosePhoto()
                    // }
                    
                    return <PlatBan {...props} />

                case "4":

                    return <HPPW {...props} />
                case "5":

                    return <MECL {...props} />
                case "6":

                    return <COP {...props} />
                case "7":

                    return <WelfareCenter {...props} />

                default:
                    return <PlatBan {...props} />
            }
        }
        return (
            <PageHeaderWrapper title={id ? "编辑活动入口" : "新建活动入口"}>
                <div style={{ background: "white" }}>

                    <Form {...formItemLayout} onFinish={onFinish}
                        form={form}

                    >
                        <Form.Item name="type" label="入口位置"
                            style={{ padding: "20px" }}
                            rules={[
                                {
                                    message: '入口位置',
                                    required: true,
                                },
                            ]}
                        >
                            <Select onChange={(e) => { setActive(e); 
                            choosePhoto();
                            form.setFieldsValue({'pic':null,'icon':null})
                            }} disabled={!!id}>
                                {
                                    optionDataDom()
                                }
                            </Select>
                        </Form.Item>
                        <div style={{ marginLeft: 20 }}>
                            {tableView(active)}
                        </div>
                        <Form.Item wrapperCol={{span:4}}
                            labelCol={{span:2}}
                            style={{marginLeft:"20px"}}
                        name="status" label="状态" >
                            <Select>
                                <Option value={1}>开启</Option>
                                <Option value={0}>关闭</Option>
                            </Select>
                        </Form.Item>
                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "30px" }}>
                            <Space>
                                <Button type="primary" htmlType="submit" >提交</Button>
                                <Button onClick={() => { props.history.goBack() }}>取消</Button>
                            </Space>
                        </div>
                    </Form>
                    <div>
                        {
                            materState !== 0 ?
                                <MaterialModal setMaterState={setMaterState}
                                    getOpmaterialPage={getOpmaterialPage} materState={materState}
                                    choosePhoto={choosePhoto}
                                    form={form}
                                    getStsToken={getStsToken}
                                /> : null
                        }
                        {
                            acState ?
                                <AcModal setAcState={setAcState} width={888} setSelectRow={setSelectRow}
                                    postActivityPage={postActivityPage} acSelectId={acSelectId}
                                    setacSelectId={setacSelectId}
                                /> : null
                        }
                    </div>

                </div>
            </PageHeaderWrapper>
        );
    }),
);

