import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Tabs, Cascader, Select, } from 'antd';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { connect } from 'dva';
import ExtensionModal from '../components/extensionModal' //推广弹框


const { TabPane } = Tabs;

const coupon = memo(props => {
    const { getCityList, cityList, getShopDetailList, } = props
    const [extensionModalVisible, setExtensionModalVisible] = useState(false) //控制推广弹框显示隐藏
    const actionRef = useRef();
    
    useEffect(()=>{
        getCityList()
    },[])
    
    const beforeSearchSubmit = ({ merchantName, area=[] }) => { //搜索参数处理
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
	};
    
    const columns = useMemo(()=>[
        {
            title: '店铺名称',
            dataIndex: 'merchantName',
            width: 160,
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
            title: '优惠券名称',
            dataIndex: 'couponType',
            width: 160,
            ellipsis: true, 
            hideInSearch: true, 
            render: (value, row) => {
                let str = '--'
                switch (row.couponType){
                    case 1:
                        str = '满减券'
                        break;
                    case 2:
                        str = '折扣券'
                        break;
                    case 3:
                        str = '商品兑换券'
                    break;
                }
                return str
            },
        },
        {
            title: '服务项目',
            dataIndex: 'serviceName',
            width: 160,
            ellipsis: true, 
            hideInSearch: true, 
        },
        {
            title: '优惠券内容',
            dataIndex: 'couponContent',
            width: 160,
            ellipsis: true, 
            hideInSearch: true, 
            render: (value, row) => {
                let str = '--'
                switch (row.couponType){
                    case 1:  //满减券
                        if(row.useCondition==0){ //无门槛
                            str = '无门槛'+'减'+row.faceValue+'元'
                        }else{
                            str = '满'+row.matchAmount+'减'+row.faceValue+'元'
                        }
                        break;
                    case 2: //折扣券
                    if(row.useCondition==0){ //无门槛
                        str = '无门槛'+'打'+row.faceValue+'折'
                    }else{
                        str = '满'+row.matchAmount+'打'+row.faceValue+'折'
                    }
                        break;
                    case 3: //商品兑换券
                        str = `${row.goodsName}x${row.goodsNum}`
                    break;  
                }
                return str
            },
        },
        {
            title: '库存',
            dataIndex: 'totalNum',
            width: 80,
            ellipsis: true, 
            hideInSearch: true, 
            render: (value, row) => {
                return ((row.receiveNum||row.receiveNum==0)?row.receiveNum:'--')+'/'+((row.totalNum||row.totalNum==0)?(row.totalNum==-1?'不限制':row.totalNum):'--')
            },
        },
        {
            title: '已领取',
            dataIndex: 'receiveNum',
            width: 80,
            ellipsis: true, 
            hideInSearch: true, 
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
            hideInSearch: true, 
            ellipsis: true, 
            fixed: 'right',
            render: (value, row)=>(
                <div>
                    <a style={{marginRight:'6px'}} onClick={()=>{
                        props.history.push(`/market/coupon/partShopDetail/edit?id=${row.id}`)
                    }}>编辑</a>
                    {/* <a onClick={()=>{ setExtensionModalVisible(true) }}>推广</a> */}
                </div>
            )
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
				request={params=>{return getShopDetailList({ ...params, ...{groupTplId: localStorage.getItem('couponIndexId'), pubType: 2} })}}
                columns={columns}
                // dataSource={}
                options={{ fullScreen: false, reload: true, density: true, setting: true }}
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
	({ global, coupon, }) => ({
		cityList: global.cityList, //省市区列表
	}),
	dispatch => ({
		async getCityList(payload) {
			return dispatch({
				type: 'global/getCityList',
				payload,
			});
        },
        // 获取店铺详情列表
        async getShopDetailList(payload) {
			return dispatch({
				type: 'coupon/getShopDetailList',
				payload,
			});
		},
	}),
)(coupon);
