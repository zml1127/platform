import { connect } from 'dva';
import { Button, message, Switch, Input, Tooltip, Popconfirm, Typography } from 'antd';
import React, { useRef, useCallback, useMemo, useState, memo, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { useToggle } from 'react-use';
import { history } from 'umi';

const { Text } = Typography;

const Admin = memo(props => {
	const {
		roleList,
		getUserList,
		toggleUser,
		getRoleList,
		createUser,
		updateUser,
		deleteUser,
		updatePassword,
	} = props;
	const actionRef = useRef();

	const [currentRow, setCurrentRow] = useState(null); //当前行

	const [resetPassVisible, toggleResetPassVisible] = useToggle(false); //重置密码
	const [addAccountVisible, toggleAddAccountVisible] = useToggle(false); //账号设置

	// 获取用户角色
	useEffect(() => {

	}, []);

	//重置密码
	const showResetPassForm = useCallback(row => {
		setCurrentRow(row);
		toggleResetPassVisible(true);
	}, []);
	//添加账户
	const showAddAccountForm = id => {
		let query = {}
		if(id) {
			query.id = id
			query.type = 'edit'
		} else {
			query.type = 'add'
		}
		history.push({
			pathname:'/system/admin/detail',
			query
		})
	};
	// 设置账户
	const changeStatus = useCallback((checked, row) => {
		const { id } = row;
		const status = checked ? 1 : 0;
		toggleUser({ id: id, status }).then(res => {
			if (res.code === '0000') {
				actionRef.current.reload();
				message.success('状态编辑成功');
			}
		});
	}, []);

	// 更新列表
	const onFresh = useCallback(values => {
		toggleAddAccountVisible(false);
		toggleResetPassVisible(false);
		actionRef.current.reload();
	}, []);

	const columns = useMemo(
		() => [
			{
				title: '账号ID',
				dataIndex: 'username',
				hideInSearch: true,
				ellipsis: true,
				renderText(value, row) {
					return value || '--';
				},
			},
			{
				title: '联系方式',
				dataIndex: 'mobile',
				ellipsis: true,
				hideInSearch: true,
				renderText(value, row) {
					return value || '--';
				},
			},
			{
				title: '权限',
				dataIndex: 'roleName',
				ellipsis: true,
				hideInSearch: true,
				width: 120,
				renderText(value, row) {
					return value || '--'
				},
			},
			{
				title: '状态',
				dataIndex: 'status',
				ellipsis: true,
				hideInSearch: true,
				width: 100,
				render: (text, row) => {
					return (
						<Switch
							checked={row.status == 1}
							checkedChildren="开启"
							unCheckedChildren="停用"
							onChange={(checked)=>changeStatus(checked, row)}
						/>
					);
				},
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				ellipsis: true,
				hideInSearch: true,
				width: 240,
				render(value, row) {
					return row.createTime ? value : '--';
				},
			},
			{
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				width: 240,
				render(value, row) {
					return [
						<a
							onClick={() => {
								showAddAccountForm(row.id);
							}}
							key="edit"
						>
							编辑
						</a>,
						<Popconfirm
							title={'确定要删除吗？'}
							okType={'danger'}
							okText={'确定'}
							key="delete"
							onConfirm={() => {
								deleteUser({ id: row.id }).then(res => {
									if (res.code == '0000') {
										message.success('账户删除成功');
									    actionRef.current.reload();
									}
								});
							}}
						>
							<a key="delete">
								<Text type="danger">删除</Text>
							</a>
						</Popconfirm>
					
					];
				},
			},
		],
		[currentRow],
	);
	return (
		<PageHeaderWrapper>
			<ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				rowKey="id"
				key="id"
				toolBarRender={() => [
					<Button
						// icon={<PlusOutlined />}
						type="dashed"
						onClick={row => showAddAccountForm(null)}
					>
						添加账户
					</Button>,
				]}
				pagination={{
					showSizeChanger: false,
				}}
				search={false}
				actionRef={actionRef}
				columns={columns}
				request={getUserList}
				options={{ fullScreen: true, reload: true, density: false, setting: true }}
			/>
		</PageHeaderWrapper>
	);
});
export default connect(
	({role}) => ({
		roleList: role.roleList
	}),
	dispatch => ({
		// 获取设置列表
		async getUserList(payload) {
			return dispatch({
				type: 'admin/getUserList',
				payload: {
					...payload,
					pageSize:1000000,
				},
			});
		},
		//编辑状态
		async toggleUser(payload) {
			return dispatch({
				type: 'admin/toggleUser',
				payload,
			});
		},
		//用户角色
		async getRoleList(payload) {
			return dispatch({
				type: 'admin/getRoleList',
				payload: {
					platformType: 1,
				},
			});
		},
		//新增用户
		async createUser(payload) {
			return dispatch({
				type: 'admin/createUser',
				payload: {
					...payload,
				},
			});
		},//编辑用户
		async updateUser(payload) {
			return dispatch({
				type: 'admin/updateUser',
				payload: {
					...payload,
				},
			});
		},
		// 删除用户
		async deleteUser(payload) {
			return dispatch({
				type: 'admin/deleteUser',
				payload: {
					...payload,
				},
			});
		},
		// 重置密码
		async updatePassword(payload) {
			return dispatch({
				type: 'admin/updatePassword',
				payload: {
					...payload,
				},
			});
		},
	}),
)(Admin);
