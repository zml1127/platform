import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import { Button, Typography, message, Switch, Popconfirm, Tooltip, Input } from 'antd';
import React, { useRef, useCallback, useMemo, useState, memo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getObjectFromArrayWithDic } from '@/utils/utils';
import { useToggle } from 'react-use';
// import SaveRoleForm from './SaveRoleForm';
import { history } from 'umi';
const { Text } = Typography;

const RoleSetting = memo(props => {
	const {
		getRoleList,
		getRoleById,
		toggleRole,
		enableStatusLoading,
		saveRole,
		deleteRole,
	} = props;

	const actionRef = useRef();

	const showRuleForm = (id) => {
		let query = {}
		if(id) {
			query.id = id
			query.type = 'edit'
		} else {
			query.type = 'add'
		}
		history.push({
			pathname:'/system/role/detail',
			query
		})
	};

	const changeStatus = useCallback(async (checked, row) => {
		try {
			const status = checked ? 1 : 0;
			const res = await toggleRole({ id:row.id, status });
			if (res) {
				message.success(
					`修改成功！`
				);
				actionRef.current.reload();
			}
		} catch (e) {
			console.log(e);
		}
	}, [])

	const columns = useMemo(
		() => [
			{
				title: '角色名称',
				dataIndex: 'roleName',
			},
			{
				title: '角色描述',
				dataIndex: 'description',
			},
			{
				title: '当前状态',
				dataIndex: 'status',
				width: 90,
				filters: false,
				render: (value, row, _, action) => {
					let originStatus = row.status;

					return (
						<Switch
							size="large"
							loading={false}
							// loading={_valueLoading}
							checkedChildren={'启用'}
							unCheckedChildren={'停用'}
							checked={value === 1}
							onChange={(checked)=>changeStatus(checked, row)}
						/>
					);
				},
			},
			{
				title: '创建日期',
				dataIndex: 'createTime',
			},
			{
				title: '操作',
				dataIndex: 'option',
				valueType: 'option',
				width: 300,
				render: (_, row, _index, action) => [
					<a key="edit" onClick={() => showRuleForm(row.id)}>编辑</a>,
					<Popconfirm
						title="确定要删除？"
						okType="danger"
						okText="删除"
						key="deletePop"
						onConfirm={async () => {
							const res = await deleteRole(row.id);
							if (res) {
								message.success('删除成功！');
								action.reload();
							}
						}}
					>
						<a>
							<Text type="danger">删除</Text>
						</a>
					</Popconfirm>,
				],
			},
		],
		[],
	);

	const submitRoleForm = useCallback(async fieldsValue => {
		const res = await saveRole(fieldsValue);
		if (res) {
			toggleSaveRoleFormVisible(false);
			message.success('保存成功！');
			// noinspection JSUnresolvedFunction
			actionRef.current.reload();
		}
	}, []);

	// const submitPrivsForm = useCallback(async fieldsValue => {
	// 	const res = await savePrivs(fieldsValue);
	// 	if (res) {
	// 		toggleSavePrivsFormVisible(false);
	// 		message.success('保存成功！');
	// 		// noinspection JSUnresolvedFunction
	// 		actionRef.current.reload();
	// 	}
	// }, []);

	return (
		<PageHeaderWrapper>
			<ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				headerTitle="角色列表"
				search={false}
				actionRef={actionRef}
				rowKey="id"
				beforeSearchSubmit={searchProps => beforeSearchSubmit(searchProps)}
				toolBarRender={() => [
					<Button
						icon={<PlusOutlined />}
						type="dashed"
						onClick={() => showRuleForm()}
					>
						添加角色
					</Button>,
				]}
				pagination={{
					showSizeChanger: true,
				}}
				request={getRoleList}
				columns={columns}
				options={{ fullScreen: false, reload: true, density: true, setting: true }}
			/>
		</PageHeaderWrapper>
	);
})

const beforeSearchSubmit = props => props;

export default connect(
	({ loading }) => ({
		enableStatusLoading: loading.effects['role/toggleRole'],
	}),
	dispatch => ({
		async getRoleList(payload) {
			return dispatch({
				type: 'role/getRoleList',
				payload,
			});
		},
		async getRoleById(id) {
			return dispatch({
				type: 'role/getRoleById',
				payload: {
					id
				},
			});
		},
		async toggleRole(payload) {
			return dispatch({
				type: 'role/toggleRole',
				payload,
			});
		},
		async deleteRole(id) {
			return dispatch({
				type: 'role/deleteRole',
				payload: {
					id,
				},
			});
		},
		async saveRole(payload) {
			return dispatch({
				type: 'role/saveRole',
				payload,
			});
		},
	}),
)(
	RoleSetting,
);
