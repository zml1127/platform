import { connect } from 'dva';
import React, { useRef, useMemo, memo, useEffect } from 'react';
import { Input, DatePicker, Tooltip, Select, Cascader } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { useList } from 'react-use';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default connect(
	() => ({}),
	dispatch => ({
		async getLogsList(payload) {
			// console.log("获取商户列表参数payload:::",payload)
			return dispatch({
				type: 'log/getLogsList',
				payload,
			});
		},
	}),
)(
	memo(props => {
		const { getLogsList } = props;
		const actionRef = useRef();

		const beforeSearchSubmit = ({ userName = null, operateType = null, createTime=null }) => {
			// 搜索方法
			const search = {};
			if (userName) {
				search.userId = userName;
			}
			if (operateType) {
				search.operateType = operateType[0];
			}
			if (createTime) {
				
				search.startDate = moment(createTime[0]._d).format('YYYY-MM-DD HH:mm:ss');
				search.endDate = moment(createTime[1]._d).format('YYYY-MM-DD HH:mm:ss');
			}
			return search;
		};

		const columns = useMemo(
			() => [
				{
					title: '帐号ID',
					dataIndex: 'userName',
					// hideInSearch: true,
					width: 160,
					ellipsis: true, // 是否自动缩略
					render: (value, row) => row.userName ? value : '--',
				},
				{
					title: '责任人',
					dataIndex: 'realName',
					hideInSearch: true,
					width: 160,
					ellipsis: true, // 是否自动缩略
					render: (value, row) => row.realName ? value : '--',
				},
				{
					title: '联系方式',
					dataIndex: 'mobile',
					hideInSearch: true,
					width: 160,
					ellipsis: true, // 是否自动缩略
					render: (value, row) => row.mobile ? value : '--',
				},
				{
					title: '角色',
					dataIndex: 'roleName',
					hideInSearch: true,
					width: 160,
					ellipsis: true, // 是否自动缩略
					render: (value, row) => row.roleName ? value : '--',
				},
				{
					title: '执行动作',
					dataIndex: 'operateType',
					// hideInSearch: true,
					width: 160,
					ellipsis: true, // 是否自动缩略
					renderFormItem: (_item, { value, onChange }) => (
						<Cascader
							options={[
								{ label: '帐号登入', value: 1 },
								{ label: '帐号登出', value: 2 },
							]}
							showSearch
							value={value}
							allowClear
							onChange={onChange}
							style={{ width: '200px' }}
						/>
					),
					render: (value, row) => row.operateType ? (row.operateType == 1 ? '登入' : '登出') : '--',
				},
				{
					title: '操作时间',
					dataIndex: 'createTime',
					// hideInSearch: true,
					width: 160,
					ellipsis: true, // 是否自动缩略
					renderFormItem: (_item, { value, onChange }) => (
						<RangePicker
							ranges={{
								Today: [moment(), moment()],
								'This Month': [moment().startOf('month'), moment().endOf('month')],
							}}
							showTime
							format="YYYY/MM/DD HH:mm:ss"
							onChange={onChange}
						/>
					),
					render: (value, row) => row.createTime ? value : '--',
				},
			],
			[],
		);

		return (
			<PageHeaderWrapper>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					columns={columns}
					request={getLogsList}
					rowKey="id"
					key="id"
					beforeSearchSubmit={searchProps => beforeSearchSubmit(searchProps)}
					options={{ fullScreen: false, reload: true, density: true, setting: true }}
					pagination={{
						showSizeChanger: true,
					}}
				/>
			</PageHeaderWrapper>
		);
	}),
);
