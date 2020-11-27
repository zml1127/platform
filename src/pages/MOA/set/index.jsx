/* eslint-disable no-nested-ternary */
import { connect } from 'dva';
import React, { memo, useRef, useState } from 'react';
import { Space, Select, Button, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { doPostDelSet, doPostInvalid } from '@/services/activity';
// import styled from 'styled-components';


const { confirm } = Modal;

const { Option } = Select;
export default connect(
    () => ({}),
    dispatch => ({

        async getActivityList(payload) {
            const params = { ...payload };
            return dispatch({
                type: 'activitylist/postActivityPage',
                payload: {
                    ...params,
                },
            });
        },
    })

)(
    memo(props => {
        const [info, setInfo] = useState();
        console.log(props)
        const { getActivityList } = props;
        const beforeSearchSubmit = (search) => {
            const res = {};
            if (search.activityName) {
                res.activityName = search.activityName;
            }

            return { ...res, activityStatus: search.activityStatus };

        }
        const actionRef = useRef();
        // 删除确认框
        const showConfirm = (text, type) => {
            confirm({
                title: type === "d" ? '你确定要删除本条目吗?' :
                    '你确定要失效本条目吗?',
                icon: <ExclamationCircleOutlined />,
                // content: 'Some descriptions',
                onOk() {
                    if (type === "d") {
                        doPostDelSet(text).then((res) => {
                            console.log(res, "retexts");
                            if (res.code === "0000") {
                                actionRef.current.reload();
                            }
                        })
                    } else {
                        doPostInvalid(text).then((res) => {
                            console.log(res, "retexts");
                            if (res.code === "0000") {
                                actionRef.current.reload();
                            }
                        })
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        }

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
                render: (text, row) => {
                    return (<div onClick={() => {
                        console.log(row.type, "xqxqxqxqxq");
                        if (row.type === 2) {

                            setInfo(row.info)
                        }
                    }}
                    >{row.type === 1 ? text : (row.type === 3 ? `URL:${row.url}` : `图文混编,点击预览`)}</div>)
                }

            },
            {
                title: '库存',
                dataIndex: 'maxNumStr',
                key: 'maxNumStr',
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
                    return (<div>{item === 1 ? "开始长期" : record.startTime}-
                        {record.endLimitFlag === 1 ? "结束长期" : record.endTime}</div>)
                }

            },
            {
                title: '状态',
                dataIndex: 'activityStatus',
                key: 'activityStatus',
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
            {
                title: '操作',
                dataIndex: 'id',
                key: 'id',
                hideInSearch: true,
                render: (text, r) => {
                    return (
                        <div>
                            <Space>
                                <span style={{ color: "#008dff" }} onClick={() => { props.history.push(`set/edit?id=${text}&type=edit`) }}>编辑</span>
                                {
                                    r.activityStatus === 0 ?
                                        <span style={{ color: "#008dff" }} onClick={() => showConfirm(text, "d")}>删除</span>
                                        : <span style={{ color: "#008dff" }} onClick={() => showConfirm(text, "i")}>失效</span>
                                }
                            </Space>
                        </div>
                    )
                }
            },
        ];

        return (
            <PageHeaderWrapper>
                <ProTable
                    request={getActivityList}
                    columns={columns}
                    actionRef={actionRef}
                    beforeSearchSubmit={beforeSearchSubmit}
                    rowKey="id"
                    search={{
						collapsed: false,
						optionRender: ({ searchText, resetText }, { form }) => (
							<>
								<Button
									type="primary"
									onClick={() => {
										form.submit();
									}}
								>
									{searchText}
								</Button>{' '}
								<Button
									onClick={() => {
										form.resetFields();
										form.submit();
									}}
								>
									{resetText}
								</Button>{''}
							</>
						),
					}}
                    toolBarRender={() => [

                        <Button
                            icon={<PlusOutlined />}
                            type="dashed"
                            onClick={() => {
                                // merchantManage/merchant/edit
                                props.history.push({pathname:`set/edit`,query:{"type":"add"}})
                            }}
                        >
                            新增平台活动
        </Button>
                    ]}
                />
                {
                    info ?                             
                        <Modal visible footer={null} onCancel={() => { setInfo() }} >
                            <img src={info} alt="图片" width="100%" />
                        </Modal> : null
                }
            </PageHeaderWrapper>
        )
    })
);
