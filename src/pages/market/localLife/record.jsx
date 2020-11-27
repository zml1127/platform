import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	message,
	DatePicker,
	Input
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { useState } from 'react';
import { history } from 'umi';
import moment from 'moment';
const UserInfo = memo(props => {
	const {
		selectPushRecordList,
	} = props;
	const actionRef = useRef();
	const { RangePicker } = DatePicker;

    useEffect(()=>{
		
	},[])

	// 表格搜索函数
	const beforeSearchSubmit = search => {
		const { pushTime } = search;
		let pushStartTime = ""
		let pushEndTime = ""

		if(pushTime){
			 pushStartTime = pushTime[0] ? pushTime[0].format("YYYY-MM-DD") +" 00:00:00" : null
			 pushEndTime = pushTime[0] ?  pushTime[1].format("YYYY-MM-DD") +" 23:59:59": null
		}
		let params = {
			pushStartTime,
			pushEndTime,
			...search,
		}
		delete params.pushTime
		return params;

	};
	const columns = useMemo(
		() => [
				{
					title: '推送活动名称',
					dataIndex: 'activityName',
					key:"activityName",
					renderFormItem: (_item, { value, onChange }) => (
						<Input placeholder="请输入推送活动名称"/>
					),
				},
				{
					title: '推送团长数量',
					dataIndex: 'userCnt',
					key:"userCnt",
					hideInSearch: true
				},
				{
					title: '推送券数量',
					dataIndex: 'extendCouponCnt',
					key:"extendCouponCnt",
					hideInSearch: true
				},
				{
					title: '推送时间',
					dataIndex: 'pushTime',
					key:"pushTime",
					renderFormItem: (_item, { value, onChange }) => (
						<RangePicker allowClear value={value} onChange={onChange} style={{ width: '100%' }} />
					),
				},
				{
					title: '操作',
					key: 'option',
					valueType: 'option',
					fixed:"right",
					render: (_,row) => [
						<a key="edit" onClick={ ()=>{
							history.push({
								pathname: '/market/localLife/record/detail',
								query: {
									id: row.id,
								},
							})
						} }>查看</a>
				   ]
				},
		],[],
	);

		return (
			<PageHeaderWrapper>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					request={ selectPushRecordList }
					columns={columns}
					toolBarRender={() => [
					]}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
					beforeSearchSubmit={ beforeSearchSubmit }
					search={{
						collapsed: false,
						optionRender: ({ searchText, resetText }, { form }) => (
							<>
								<Button
									type="primary"
									onClick={() => {
										form.submit();
									}}
									htmlType="submit"
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
				/>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global }) => ({
		cityList: global.cityList, // 省市区数据
	}),
	dispatch => ({
		
		async selectPushRecordList  (payload) {
			return dispatch({
				type: 'localLife/selectPushRecordList',
				payload,
			});
		},
		async createExtendcouponType  (payload) {
			return dispatch({
				type: 'couponMaintain/createExtendcouponType',
				payload,
			});
		},
		async updataExtendcouponType  (payload) {
			return dispatch({
				type: 'couponMaintain/updataExtendcouponType',
				payload,
			});
		},
		
		async deleteExtendcouponType  (payload) {
			return dispatch({
				type: 'couponMaintain/deleteExtendcouponType',
				payload,
			});
		}
	}),
)(UserInfo);
