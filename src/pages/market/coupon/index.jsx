import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Tabs, Cascader, Select, Popconfirm, } from 'antd';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { connect } from 'dva';
import PartShopModal from './components/partShopModal' //参加店铺数弹框
import ExtensionModal from './components/extensionModal' //推广弹框

const { TabPane } = Tabs;

const coupon = memo(props => {
	const { getCouponActivityList, updateStatus, getGoodsList, deleteGoods, updateGoodsStatus, } = props
	const actionRef = useRef();
    const { id, type } = props.location.query;
	const [queryType, setPlatShopType] = useState(type || '1')
	const [partModalVisible, setPartModalVisible] = useState(false) //控制参加店铺数弹框显示隐藏
	const [extensionModalVisible, setExtensionModalVisible] = useState(false) //控制推广弹框显示隐藏
	const [idName, setIdName] = useState('') //点击参加店铺数弹框显示的id和店铺名

	const beforeSearchSubmit = useCallback(( searchProps ) => {
		let search = {};
		if (searchProps.name) {
			search.name = searchProps.name.trim();
		}
		if (searchProps.couponType) {
			search.couponType = searchProps.couponType;
		}
		if(searchProps.status){
			search.status = searchProps.status;
		}
		return search;
	},[ queryType ])

	const showPartShopModal = useCallback((id="", name="")=>{
		if(queryType == 1){
			setIdName({ id, name })
			setPartModalVisible(true)
		}else{
			console.log('现在是店铺下的，该跳页面啦')
		}
	},[ queryType ])

	const columns = useMemo(
		() => [
			{
				title: 'ID',
				dataIndex: (queryType==1 || queryType == 2) ? 'couponCode' : 'id',
				width: 160,
				ellipsis: true, 
				fixed: 'left',
				hideInSearch: true, 
			},
			{
				title: '模板名称',
				dataIndex: 'name',
				width: 160,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: queryType==2?false:true, 
				render: (value, row) => {
					return row.name ? value : '--';
				},
			},
			{
				title: '优惠券名称',
				dataIndex: 'name',
				width: 220,
				ellipsis: true, 
				hideInSearch: queryType==1?false:true, 
				hideInTable: queryType==1?false:true, 
				render: (value, row) => {
					return row.name ? value : '--';
				},
			},
			{
				title: '商品券名称',
				dataIndex: 'name',
				width: 160,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: queryType==4?false:true, 
				fixed: 'left',
				render: (value, row) => {
					return row.name ? value : '--';
				},
			},
			{
				title: '适用服务类型',
				dataIndex: queryType == 4 ? 'serviceTypeStr' : 'serviceName',
				width: 120,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: (queryType==2||queryType==4)?false:true, 
				render: (value, row) => {
					if(queryType == 4){
						return row.serviceTypeStr ? value : '--';
					}else{
						return row.serviceName ? value : '--';
					}
				},
			},
			{  //*******************/
				title: '服务原价（元）',
				dataIndex: 'thirdPrice',
				width: 120,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: queryType==4?false:true, 
				render: (value, row) => {
					return row.thirdPrice ? value : '--';
				},
			},
			{  //*******************/
				title: '优惠价（元）',
				dataIndex: 'price',
				width: 120,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: queryType==4?false:true, 
				render: (value, row) => {
					return row.price ? value : '--';
				},
			},
			{  //*******************/
				title: '返佣价（元）',
				dataIndex: 'commissionAmount',
				width: 120,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: queryType==4?false:true, 
				render: (value, row) => {
					return row.commissionAmount ? value : '--';
				},
			},
			{
				title: '有效期',
				dataIndex: 'validityDate',
				width: 300,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: (queryType==2||queryType==4)?false:true, 
				render: (value, row) => {
					if(queryType == 4){
						return (row.buyStartTime ? row.buyStartTime : '不限制') + '--' + (row.buyEndTime ? row.buyEndTime : '不限制')
					}else{
						return (row.startLimitFlag==1?row.startTime:'不限制') +'--'+ (row.endLimitFlag==1?row.endTime:'不限制')
					}
				},
			},
			{
				title: '服务项目',
				dataIndex: 'serviceName',
				width: 120,
				ellipsis: true,
				hideInSearch: true, 
				hideInTable: queryType==1?false:true, 
				render: (value, row) => {
					return row.serviceName ? value : '--';
				},
			},
			{
				title: '优惠券类型',
				dataIndex: 'couponType',
				width: 100,
				ellipsis: true,
				hideInSearch: queryType==1?false:true, 
				hideInTable: queryType==1?false:true, 
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
				renderFormItem: (_item, { value, onChange }) => {
					return (
						<Select defaultValue={0} onChange={onChange}>
							<Select.Option value={0}>全部</Select.Option>
							<Select.Option value={1}>满减券</Select.Option>
							<Select.Option value={2}>折扣券</Select.Option>
							<Select.Option value={3}>商品兑换券</Select.Option>
						</Select>
					);
				}
			},
			{
				title: '优惠券内容',
				dataIndex: 'couponContent',
				width: 140,
				ellipsis: true,
				hideInSearch: true, 
				hideInTable: queryType==1?false:true, 
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
							str = '无门槛'+'打'+row.faceValue/10+'折'
						}else{
							str = '满'+row.matchAmount+'打'+row.faceValue/10+'折'
						}
							break;
						case 3: //商品兑换券
							str = `${row.goodsName}x${row.goodsNum}`
						break;  
					}
					return str
				},
			},
			{  //************************/
				title: '库存',
				dataIndex: queryType == 4 ? 'remainingAmount' : 'totalNum',
				width: 140,
				ellipsis: true,
				hideInSearch: true, 
				hideInTable: (queryType==1||queryType==4)?false:true, 
				render: (value, row) => {
					if(queryType == 4){
						return row.remainingAmount
					}else{
						return row.receiveNum+'/'+(row.totalNum==-1?'不限制':row.totalNum)
					}
				},
			},
			{ //*************************/
				title: '已使用',
				dataIndex: queryType == 4 ? 'receiveNum' : 'useNum',
				width: 100,
				ellipsis: true,
				hideInSearch: true, 
				hideInTable: (queryType==1||queryType==4)?false:true, 
				render: (value, row) => {
					if(queryType == 4){
						return row.receiveNum
					}else{
						return row.useNum
					}
				}
			},
			{ //*************************/
				title: '关联店铺数',
				dataIndex: 'useNum',
				width: 100,
				ellipsis: true,
				hideInSearch: true, 
				hideInTable: (queryType==1||queryType==4)?false:true, 
			},
			{
				title: '参加店铺数',
				dataIndex: 'joinMerchantNum',
				width: 100,
				ellipsis: true, 
				hideInSearch: true, 
				hideInTable: (queryType==1||queryType==2)?false:true, 
				render: (value, row) => {
					return <div>
						{
							queryType==1 ? <a onClick={()=>{ showPartShopModal(row.id, row.name) }}>
									{
										(row.joinMerchantNum||row.joinMerchantNum==0) ? row.joinMerchantNum : '--'
									}
								</a> : 
								<div>
									{
										(row.joinMerchantNum||row.joinMerchantNum==0) ? row.joinMerchantNum : '--'
									}
								</div>
						}
					</div>
				},
			},
			{
				title: '状态',
				dataIndex: queryType == 4 ? 'goodsStatusStr' : 'status',
				width: 100,
				ellipsis: true, 
				fixed: 'right',
				hideInSearch: (queryType==1||queryType==2)?false:true, 
				render: (value, row) => {
					let str = '--'
					switch (row.status){
						case 0:
							str = '全部'
							break;
						case 1:
							str = '进行中'
							break;
						case 2:
							str = '已失效'
							break;
						case -1:
							str = '未开始'
						break;
					}
					if(queryType == 4){
						return row.goodsStatusStr
					}else{
						return str
					}
				},
				renderFormItem: (_item, { value, onChange }) => {
					return (
						<Select>
							<Select.Option value={0}>全部</Select.Option>
							<Select.Option value={1}>进行中</Select.Option>
							<Select.Option value={2}>已失效</Select.Option>
							<Select.Option value={-1}>未开始</Select.Option>
						</Select>
					);
				}
			},
			{
				title: '操作',
				dataIndex: 'option',
				hideInSearch: true,
				fixed: 'right',
				width: 200,
				render: (value, row) => {
					return (
						<React.Fragment>
							{
								queryType == 1 ?
								<div>
									{/* {
										row.status!==2?
											<a style={{marginRight:'6px'}} onClick={()=>{ setExtensionModalVisible(true) }}>推广</a>
										: ''
									} */}
									<a style={{marginRight:'6px'}} onClick={()=>{
										props.history.push(`/market/coupon/createEditPlatCoupon?type=${'edit'}&id=${row.id}`)
									}}>编辑</a>
									{
										row.status!==2 ? 
										<Popconfirm
												// disabled={false?true:false}
											title="确定要失效吗?"
											onConfirm={()=>{ invalidDel({ id: row.id, status: 0, type: 1 }) }}
											okText="确定"
											cancelText="取消"
										>
											<a style={{marginRight:'6px'}}>失效</a>
										</Popconfirm> : ''
									}
									{
										row.status==2 ? 
										<Popconfirm
											// disabled={false?true:false}
											title="确定要删除吗?"
											onConfirm={()=>{ invalidDel({ id: row.id, status: 2, type: 1 }) }}
											okText="确定"
											cancelText="取消"
										>
											<a>删除</a>
										</Popconfirm> : ''
									}
								</div> : 
								(
									queryType == 2 ? 
									<div>
										{
											row.status!==2 ? 
											<a style={{marginRight:'6px'}} onClick={()=>{
												localStorage.setItem('couponIndexId', row.id)
												props.history.push(`/market/coupon/partShopDetail`)
											}}>查看</a> : ''
										}
										<a style={{marginRight:'6px'}} onClick={()=>{
											props.history.push(`/market/coupon/createEditShopCoupon?type=${'edit'}&id=${row.id}`)
										}}>编辑</a> 
										{
											row.status !== 2 ? 
											<Popconfirm
												title="确定要失效吗?"
												onConfirm={()=>{
													invalidDel({ id: row.id, status: 0, type: 2 })
												}}
												okText="确定"
												cancelText="取消"
											>
												<a style={{marginRight:'6px'}}>失效</a>
											</Popconfirm> : ''
										}
										{
											row.status == 2 ? 
											<Popconfirm
												// disabled={false?true:false}
												title="确定要删除吗?"
												onConfirm={()=>{ invalidDel({ id: row.id, status: 2, type: 2 }) }}
												okText="确定"
												cancelText="取消"
											>
												<a>删除</a>
											</Popconfirm> : ''
										}
									</div> 
									: 
									<div>
										{
											row.goodsStatusStr !== '已失效' ? 
											<a style={{marginRight:'6px'}} onClick={()=>{
												props.history.push(`/market/coupon/createEditGoods?type=${'look'}&id=${row.id}`)
											}}>查看</a> : ''
										}
										<a style={{marginRight:'6px'}} onClick={()=>{
											props.history.push(`/market/coupon/createEditGoods?type=${'edit'}&id=${row.id}`)
										}}>编辑</a> 
										{
											row.goodsStatusStr !== '已失效' ? 
											<Popconfirm
												title="确定要失效吗?"
												onConfirm={()=>{
													updateGoodsStatus({ extendCouponId: row.id }).then(res=>{
														if(res){
															actionRef.current.reload()
														}
													})
												}}
												okText="确定"
												cancelText="取消"
											>
												<a style={{marginRight:'6px'}}>失效</a>
											</Popconfirm> : ''
										}
										{
											row.goodsStatusStr == '已失效' ? 
											<Popconfirm
												title="确定要删除吗?"
												onConfirm={()=>{ 
													deleteGoods({ id: row.id }).then(res=>{
														if(res){
															message.success('删除成功')
															actionRef.current.reload()
														}
													})
												}}
												okText="确定"
												cancelText="取消"
											>
												<a>删除</a>
											</Popconfirm> : null
										}
									</div>
								)
							}
						</React.Fragment>
					);
				},
			},
		],
		[ queryType, ],
	);

	const invalidDel = useCallback((params)=>{
		updateStatus(params).then(res=>{
			if(res){
				if(params.status==2){
					message.success('删除成功')
				}
				actionRef.current.reload()
			}
		})
	},[])
    return (
      	<PageHeaderWrapper>
			<Tabs 
				tabBarGutter={20} //tabs 之间的间隙
				defaultActiveKey={queryType}
			  	// type="card" 
				onChange={val=>{
					setPlatShopType(val)
					actionRef.current.reset()
					actionRef.current.reload()
				}} 
				>
				<TabPane tab="平台券" key='1'></TabPane>
				<TabPane tab="店铺券" key='2'></TabPane>
				<TabPane tab="商品券" key='4'></TabPane>
			</Tabs>
			<ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				actionRef={actionRef}
				rowKey="id"
				beforeSearchSubmit={beforeSearchSubmit}
				toolBarRender={() => [
					<Button onClick={()=>{
						if(queryType == 1){
							props.history.push(`/market/coupon/createEditPlatCoupon?type=${'add'}`)
						}
						else if(queryType == 2){
							props.history.push(`/market/coupon/createEditShopCoupon?type=${'add'}`)
						}
						else if(queryType == 4){
							props.history.push(`/market/coupon/createEditGoods?type=${'add'}`)
						}
					}}>
						< PlusOutlined />新建{queryType==1?'平台优惠':(queryType==2?'店铺优惠':'商品')}券
					</Button>,
				]}
				pagination={{
					showSizeChanger: true,
				}}
				request={params=>{
					if(queryType == 4){
						return getGoodsList(params, id)
					}else{
						return getCouponActivityList(params, queryType, id)
					}
				}}
				columns={columns}
				options={{ fullScreen: false, reload: true, density: true, setting: true }}
				search={{
					collapsed: false,
					optionRender: ({ searchText, resetText }, { form }) => (
						<React.Fragment>
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
						</React.Fragment>
					)
				}}
			/>
			<PartShopModal 
				idName={idName}
				visible={partModalVisible}
				setVisible={setPartModalVisible}
			/>
			<ExtensionModal 
				visible={extensionModalVisible}
				setVisible={setExtensionModalVisible}
			/>
      	</PageHeaderWrapper>
    );
});

export default connect(
	({ makeGroup, coupon, }) => ({
		
	}),
	dispatch => ({
		async getCouponActivityList(payload, type, id) {
			let params = {
				...payload,
			}
			params.queryType = type
			if ( !payload._timestamp && id ) {
				params.id = id
			}
			if(type.queryType == 2){
				delete params.name
			}
			return dispatch({
				type: 'coupon/getCouponActivityList',
				payload: params
			});
		},
		// 失效删除 
		async updateStatus(payload) {
			return dispatch({
				type: 'coupon/updateStatus',
				payload
			});
		},
		// 获取商品券列表 
		async getGoodsList(payload, id) {
			let params = {
				...payload,
				source: 4
			}
			if ( !payload._timestamp && id ) {
				params.id = id
			}
			return dispatch({
				type: 'coupon/getGoodsList',
				payload: params,
			});
		},
		// 商品券失效
		async updateGoodsStatus(payload) {
			return dispatch({
				type: 'coupon/updateGoodsStatus',
				payload
			});
		},
		// 删除某个商品券
		async deleteGoods(payload) {
			return dispatch({
				type: 'coupon/deleteGoods',
				payload
			});
		},
	}),
)(coupon);
