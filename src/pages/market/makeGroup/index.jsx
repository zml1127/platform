import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Tabs, Cascader, Select, Popconfirm, } from 'antd';
import React, { useState, useRef, memo, useMemo, useCallback, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { connect } from 'dva';
import { Switch } from 'umi';

const { TabPane } = Tabs;

const makeGroup = memo(props => {
	const {
		getPageList,
		getServiceCategoryList,
		serviceCategoryList,
		updateStatus,
	} = props
	const actionRef = useRef();
    const { id } = props.location.query;

	useEffect(()=>{
		getServiceCategoryList()
	},[])

	const beforeSearchSubmit = (payload) => {
		// console.log('id', id)
		// return { ...payload, id}
	}
	
	const columns = useMemo(()=>[
		{
			title: 'ID',	
			dataIndex: 'id',
			width: 200,
			ellipsis: true,
			/*renderFormItem: (_item, { value, onChange }) => {
				return (
					<Input defaultValue={id} onChange={onChange} value={value}/>
				);
			},*/
		},
		{
			title: '店铺拼团模版名称',	
			dataIndex: 'name',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
		},
		{
			title: '适用服务类型',
			dataIndex: 'serviceCateId',
			width: 160,
			ellipsis: true, 
			renderFormItem: (_item, { value, onChange }) => {
				return (
					<Select onChange={onChange} allowClear>
						{
							serviceCategoryList.map(v=>(
								<Select.Option value={v.id} key={v.id}>{v.name}</Select.Option>
							))
						}
					</Select>
				);
			},
			render: (value,row)=>{
				let name = serviceCategoryList.filter(v=>{
					return v.id == row.serviceCateId
				})
				return name&&name.length!==0&&name[0].name ? name&&name.length!==0&&name[0].name : '--'
			}
		},
		{
			title: '活动时间',
			dataIndex: 'activityTime',
			width: 160,
			ellipsis: true, 
			hideInSearch: true,
			// render: (value, row)=>{
			// 	return (row.startTime ? row.startTime : '--') +'至'+ (row.endTime ? row.endTime : '--')
			// }, 
			render: (value, row) => {
				return (row.startLimitFlag==1?row.startTime:'不限制') +'--'+ (row.endLimitFlag==1?row.endTime:'不限制')
			},
		},
		{
			title: '参加店铺数',
			dataIndex: 'joinMerchantNum',
			width: 160,
			ellipsis: true, 
			hideInSearch: true, 
		},
		{
			title: '状态',
			dataIndex: 'status',
			width: 160,
			ellipsis: true,
			valueEnum: {
				'0': '全部',
				'1': '进行中',
				'2': '已失效',
				'-1': '未开始'
			}
		},
		{
			title: '操作',
			dataIndex: 'status',
			width: 160,
			ellipsis: true, 
			fixed: 'right',
			hideInSearch: true, 
			render: (value, row)=>(
				<div>
					{
						row.status!==2?<a style={{margin:'4px'}} onClick={()=>{
							localStorage.setItem('makeGroupIndexId', row.id)
							props.history.push(`/market/makeGroup/makeGroupDetail`)
						}}>查看</a> : ''
					}
					<a style={{margin:'4px'}} onClick={()=>{ 
						// jumpPage('edit',  row.id) 
						props.history.push(`/market/makeGroup/cEGroup?type=edit&id=${row.id}`)
					}}>编辑</a>
					{
						row.status!==2 ? 
						<Popconfirm
							// disabled={false?true:false}
							title="确定要失效吗?"
							onConfirm={()=>{
								console.log('row===', row)
								updateStatus({ id: row.id, status: 0 }).then(res=>{
									if(res){
										// message.success('失效成功')
										actionRef.current.reload()
									}
								})
							}}
							okText="确定"
							cancelText="取消"
						>
							<a style={{margin:'4px'}}>失效</a> 
						</Popconfirm> : ''
					}
					{
						row.status==2 ? 
						<Popconfirm
							title="确定要删除这行内容吗?"
							onConfirm={()=>{
								updateStatus({ id: row.id, status: 2}).then(res=>{
									if(res){
										actionRef.current.reload()
									}
								})
							}}
							onCancel={()=>{ console.log('点击取消了') }}
							okText="确定"
							cancelText="取消"
						>
							<a style={{margin:'4px'}}>删除</a>
						</Popconfirm> 
						: ''
					}
				</div>
			)
		},
	],[ serviceCategoryList, id])

    return (
      <PageHeaderWrapper>
			{/* <Tabs> */}
				{/* <TabPane tab="店铺活动" key="1"> */}
					<ProTable
						headerTitle='店铺活动'
						scroll={{ x: 'max-content' }}
						tableClassName="pro-table-padding"
						actionRef={actionRef}
						rowKey="id"
						toolBarRender={() => [
							<Button onClick={()=>{ 
								// jumpPage('add') 
								props.history.push(`/market/makeGroup/cEGroup?type=add`)
							}}>
								< PlusOutlined />新建店铺拼团
							</Button>,
						]}
						pagination={{
							showSizeChanger: true,
						}}
                		// beforeSearchSubmit={beforeSearchSubmit}
						request={(e)=>getPageList(e, id)}
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
				{/* </TabPane> */}
			{/* </Tabs> */}
			
      </PageHeaderWrapper>
    );
});

export default connect(
	({ makeGroup, loading, }) => ({
		serviceCategoryList: makeGroup.serviceCategoryList, //洗美类型二级列表
	}),
	dispatch => ({
		// 获取列表
		async getPageList(payload, id) {
			// TODO: 进入页面默认按照params里的参数进行查询 随后查询可正常使用 与该参数无关
			// 输入框默认值 before 都无法放入table首次搜索内
			// 目前仅通过是否有_timestamp 判断是人为搜索 还是页面第一次自动搜索
			// 自动搜索时 无_timestamp 将页面参数带入搜索内容 后续不再使用该参数
			if ( !payload._timestamp ) {
				payload.id = id
			}
			return dispatch({
				type: 'makeGroup/getPageList',
				payload,
			});
		},
		// 洗美类型二级查询
        async getServiceCategoryList(payload) {
			return dispatch({
				type: 'makeGroup/getServiceCategoryList',
				payload,
			});
		},
		// 失效删除
		async updateStatus(payload) {
			return dispatch({
				type: 'makeGroup/updateStatus',
				payload,
			});
		},
	}),
)(makeGroup);
