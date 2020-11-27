import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Tabs, Cascader, Select, Popconfirm, Space, } from 'antd';
import React, { useState, useRef, memo, useMemo, useCallback, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'dva';
import ExtensionModal from '../../coupon/components/extensionModal' //推广弹框

const makeGroup = memo(props => {
    const { getGroupDetailList, cityList, getCityList, } = props
	const actionRef = useRef();
    const [extensionModalVisible, setExtensionModalVisible] = useState(false) //控制推广弹框显示隐藏


	const beforeSearchSubmit = useCallback(({ merchantName, area=[] }) => {
        let params = {};
		if (merchantName) {
			params.name = merchantName;
		}
		if (area.length !== 0) {
			params.provinceId = area[0]
			params.cityId = area[1] ? area[1] : null
			params.districtId = area[2] ? area[2] : null
		}
		return params;
    },[ ])
    
    useEffect(()=>{
        getCityList()
    },[])
	
	const columns = useMemo(()=>[
		{
			title: '店铺名称',
			dataIndex: 'merchantName',
			width: 220,
			ellipsis: true, 
			render: (value, row)=>{
				return <a onClick={()=>{
					props.history.push(`/merchantManage/merchant/details?id=${row.merchantId}`)
				}}>{ row.merchantName?row.merchantName:'--' }</a>
			}
        },
        {
			title: '店铺所在区域',
			dataIndex: 'area',
			width: 220,
			ellipsis: true, 
			render: (value, row)=>{
				return value
			},
            renderFormItem: (_item, { value, onChange }) => (
				<Cascader
					options={cityList}
					fieldNames={{ label: 'name', value: 'id', children: 'children' }}
					showSearch
					value={value} // 指定选中项目
					allowClear
					onChange={onChange}    
					style={{ width: '200px' }}
				/>
			),
        },
        {
			title: '拼团名称',
			dataIndex: 'groupName',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
        },
        {
			title: '原价',
			dataIndex: 'oriPrice',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
        },
        {
			title: '拼团价格',
			dataIndex: 'price',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
        },
        {
			title: '服务项目',
			dataIndex: 'serviceName',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
        },
        {
			title: '参团人数',
			dataIndex: 'joinNum',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
        },
        {
			title: '已成团数',
			dataIndex: 'cloudsNum',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
        },
        {
			title: '库存',
			dataIndex: 'stockNum',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
			render: (_, row)=>{
				return row.stockNum==-1?'不限制':row.stockNum
			}
        },
        {
			title: '参与时间',
			dataIndex: 'createTime',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
        },
        {
			title: '操作',
			dataIndex: 'options',
			width: 160,
			ellipsis: true, 
            hideInSearch: true, 
            fixed: 'right',
            render(value, row) {
                return (
                    <div>
                        <Space size={8}>
                            <a onClick={()=>{
								props.history.push(`/market/makeGroup/makeGroupDetail/edit?id=${row.id}&serviceName=${row.serviceName}&oriPrice=${row.oriPrice}&merchantId=${row.merchantId}`)
							}}>编辑</a>
                            {/* <a onClick={()=>{ setExtensionModalVisible(true) }}>推广</a> */}
                        </Space>
                    </div>
                )
            },
		},
	],[ cityList, ])
	
    return (
        <PageHeaderWrapper>
            <ProTable
                scroll={{ x: 'max-content' }}
                tableClassName="pro-table-padding"
                actionRef={actionRef}
                rowKey="id"
                key="id"
                beforeSearchSubmit={beforeSearchSubmit}
                pagination={{
                    showSizeChanger: true,
                }} 
                request={params=>{return getGroupDetailList({ ...params, ...{templateId: localStorage.getItem('makeGroupIndexId')} })}}
                columns={columns}
				options={{ fullScreen: false, reload: false, density: false, setting: false }}
				search={{
					collapsed: false,
					optionRender: ({ searchText, resetText }, { form }) => (
						<>
							<Button
								type="primary"
								htmlType="submit"
								onClick={() => {
									form.submit();
								}}
							>
								{searchText}
							</Button>{' '}
							<Button
								onClick={() => {
									form.resetFields();
									form.submit();
								}}
							>
								{resetText}
							</Button>{''}
						</>
					)
				}}
            />
            <ExtensionModal 
				visible={extensionModalVisible}
				setVisible={setExtensionModalVisible}
			/>
        </PageHeaderWrapper>
    );
});

export default connect(
	({ makeGroup, global, }) => ({
        cityList: global.cityList, //省市区列表
	}),
	dispatch => ({
        async getCityList(payload) {
			return dispatch({
				type: 'global/getCityList',
				payload,
			});
        },
        // 多人拼团参加店铺详情列表
		async getGroupDetailList(payload) {
			return dispatch({
				type: 'makeGroup/getGroupDetailList',
				payload,
			});
		},
    }),
    
)(makeGroup);
