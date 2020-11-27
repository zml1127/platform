import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {SearchOutlined,PlusOutlined} from '@ant-design/icons';
import {
	Tabs,
	Typography,
	DatePicker,
	Select,
	Button
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import style from './index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;

// 格式化传参 （分离分页参数和data）
const formatPayload = payload => {
	const params = { ...payload };
	const pagination = {
		current: payload.current,
		pageSize: payload.pageSize,
	};
	const { current, pageSize } = payload;
	delete params.current;
	delete params.pageSize;
	return {
		// ...payload
		current: String(current),
		pageSize: String(pageSize),
	};
};

const UserInfo = memo(props => {
	const {
		getAppletsList,
	} = props;
    useEffect(()=>{
		
	},[])
	
	const actionRef = useRef();	
	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { registrationTime, latestFeedbackTime } = search;
		if ( registrationTime ) {
			search.registerStartTime = registrationTime[0].format("YYYY-MM-DD")+" 00:00:00"
			search.registerEndTime = registrationTime[1].format("YYYY-MM-DD")+" 23:59:59"
			delete search.registrationTime;
		}
		if ( latestFeedbackTime ) {
			search.feedBackStartTime = latestFeedbackTime[0].format("YYYY-MM-DD")+" 00:00:00"
			search.feedBackEndTime = latestFeedbackTime[1].format("YYYY-MM-DD")+" 23:59:59"
			delete search.latestFeedbackTime;
		}
		// console.log(search)
		return search;
	};
	const columns = useMemo(
		() => [
				{
					title: '用户名',
					dataIndex: 'userName',
					ellipsis:true,
					key:"userName",
					hideInSearch: true,
				},
				{
					title: '手机号',
					dataIndex: 'phoneNumber',
					filters: false,
					hideInSearch: true,
				},
				{
					title: '服务使用总次数',
					dataIndex: 'totalServiceUsage',
					hideInSearch: true
				},
				{
					title: '注册时间',
					dataIndex: 'registrationTime',
					renderFormItem: (_item, { value, onChange }) => (
						<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
					),
					render(value, row) {
						return value ? value : '--';
					},
				},
				{
					title: '反馈次数',
					dataIndex: 'feedbackTimes',
					hideInSearch: true
				},
				{
					title: '最近反馈时间',
					dataIndex: 'latestFeedbackTime',
					renderFormItem: (_item, { value, onChange }) => (
						<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
					),
					render(value, row) {
						return value ? value : '--';
					},
				},
				{
					title: '是否全部已读',
					dataIndex: 'isRead',
					renderFormItem: (a, { onChange }) => (
						<Select onChange={onChange} defaultValue="">
							<Option value="">全部</Option>
							<Option value="1">是</Option>
							<Option value="0">否</Option>
						</Select>
					),
					renderText:(_, row) => row.isRead ==1 ? "已读":"未读"
				},
				{
					title: '操作',
					key: 'option',
					width: 140,
					valueType: 'option',
					fixed:"right",
					render: (_,row) => [
					<a key="see" onClick={
						()=>{
							history.push({
								pathname: '/operation/feedback/detail',
								query: {
									userId: row.userId,
								},
							})
						}
					}>查看</a>
				   ]
				  },
		],[],
	);
		return (
			<PageHeaderWrapper>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					className={style.material_con}
					actionRef={actionRef}
					rowKey="userId"
					beforeSearchSubmit={beforeSearchSubmit}
					pagination={{
						showSizeChanger: true,
					}}
					request={(params)=>getAppletsList(params)}
					columns={columns}
					search={{
						collapsed: false,
						collapseRender: null,
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
					]}
					options={{ fullScreen: false, reload: false, density: true, setting: false }}
				/>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global, order }) => ({
		orderList: order.orderList,
		serviceTypeContent: global.serviceTypeContent
	}),
	dispatch => ({
		async getAppletsList(params) {
			return dispatch({
				type: 'operation/getFeedBackList',
				payload:{
					...params,
				}
			});
		},
	}),
)(UserInfo);
