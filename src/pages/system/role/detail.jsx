import { Input, Form, Row, Col, Tree, Card, Button, message } from 'antd';
import React, { useCallback, memo, useEffect, useState } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';

const { Item, useForm } = Form;
const { TextArea } = Input;

const treeData = [
	{
		path: '/dashboard',
		key: 'dashboard-0100',
		title: '数据看板',
		id: '0100',
	},
	{
		title: '店铺管理',
		path: '/merchantManage',
		key: 'merchantManage-0200',
		id: '0200',
		children:[
			{
				title:"店铺详情列表",
				path: '/merchantManage/merchant',
				key: 'merchant-0201',
				id: '0201',
			},
			{
				title:"连锁店铺详情列表",
				path: '/merchantManage/bromerchant',
				key: 'bromerchant-0202',
				id: '0202',
			},
		]
	},
	{
		title: '服务管理',
		path: '/service',
		key: 'service-0300',
		id: '0300',
		children: [
			{
				title: '油品管理',
				path: '/service/gasService',
				key: 'gasService-0301',
				id: '0301',
			},
			{
				title: '洗美服务列表',
				path: '/service/washService',
				key: 'washService-0302',
				id: '0302',
			},
		],
	},

	{
		title: '营销管理',
		path: '/market',
		key: 'market-0400',
		id: '0400',
		children: [
			{
				title: '多人拼团',
				path: '/market/makeGroup',
				key: 'makeGroup-0401',
				id: '0401',
			},
			{
				title: '优惠券管理',
				path: '/market/coupon',
				key: 'coupon-0402',
				id: '0402',
			},
			{
				title: '周边券管理',
				path: '/market/around',
				key: 'around-0403',
				id: '0403',
			},
			{
				title: '券类型维护',
				path: '/market/couponMaintenance',
				key: 'maintenance-0404',
				id: '0404',
			},
			{
				title: '本地生活',
				path: '/market/localLife',
				key: 'localLife-0405',
				id: '0405',
			},
		],
	},
	{
		title: '用户管理',
		path: '/userManagement',
		key:'userManagement-0500',
		id: '0500',
		children: [
			{
				title: '用户信息',
				path: '/userManagement/userInfo',
				key:'userInfo-0501',
				id: '0501',
			},
		]
	},
	{
		title:'活动管理',
		path:'/MOA',
		key: 'moa-0600',
		id: '0600',
		children:[
			{
				title:"活动入口",
				path:"/MOA/entrance",
				key: 'moaEntrance-0601',
				id: '0601',
			},
			{
				title:"活动设置",
				path:"/MOA/set",
				key: 'moaSet-0602',
				id: '0602',
			},
		]
	},
	{
		title:'分销管理',
		path:'/retail',
		key: 'retail-1100',
		id: '1100',
		children:[
			{
				title:"团长列表",
				path:"/retail/teamLeader",
				key: 'teamLeader-1101',
				id: '1101'
			},
			{
				title:"提现申请列表",
				path:"/retail/application",
				key: 'application-1102',
				id: '1102'
			},
			{
				title:"提现设置",
				path:"/retail/setting",
				key: 'withdrawSetting-1103',
				id: '1103'
			},
		],
	},
	{
		title: '运营管理',
		path: '/operation',
		key:'operate-0700',
		id: '0700',
		children: [
			{
				title: '素材库',
				path: '/operation/material',
				key: 'material-0701',
				id: '0701',
			},
			/*{
				title: '小程序模板消息',
				path: '/operation/applets',
				key: 'applets-0702',
				id: '0702',
			},*/
			{
				title: '意见反馈',
				path: '/operation/feedback',
				key: 'feedback-0703',
				id: '0703',
			},
		]
	},
	{
		title: '交易查询',
		path: '/order',
		key: 'order-0800',
		id: '0800',
		children: [
			{
				title: '加油订单',
				path: '/order/oilOrder',
				key: 'oilOrder-0801',
				id: '0801',
			},

			{
				title: '服务订单',
				path: '/order/serviceOrder',
				key: 'serviceOrder-0802',
				id: '0802',
			},
			{
				title: '兑换记录',
				path: '/order/goodsOrder',
				key: 'goodsOrder-0803',
				id: '0803',
			},
			{
				title: '保险订单',
				key: 'insureOrder-0804',
				path: '/order/insureOrder',
				id: '0804',
			},
			{
				title: '分销订单',
				key: 'distributionOrder-0805',
				path: '/order/distributionOrder',
				id: '0805',
			},
		],
	},
	/*{
		title: '保险模块',
		path: '/insure',
		key: 'insure-0900',
		id: '0900',
		children: [
			{
				path: '/insure/agent',
				title: '代理人信息',
				key: 'agent-0901',
				id: '0901'
			}
		]
	},*/
	{
		title: '系统设置',
		path: '/system',
		key: 'system-1000',
		id: '1000',
		children: [
			{
				title: '权限设置',
				path: '/system/role',
				key: 'role-1001',
				id: '1001',
			},
			{
				title: '管理员设置',
				path: '/system/admin',
				key: 'admin-1002',
				id: '1002',
			},
			/*{
				title: '操作日志',
				path: '/system/log',
				key: 'log-1003',
				id: '1003',
			},*/
		],
	},
];

const layout = {
	labelCol: { span: 8 },
  	wrapperCol: { span: 16 },
};
const tailLayout = {
  	wrapperCol: { offset: 4, span: 16 },
};
const formItemLayout = {
  	labelCol: {
	    xs: { span: 24 },
	    sm: { span: 8 },
  	},
  	wrapperCol: {
	    xs: { span: 24 },
	    sm: { span: 12 },
  	},
};

const fillCode = (code) => {
	if (code.length < 4){
		return '0'+code
	}
	return code
}

const SaveRole = props => {
	const {
		location,
		current,
		updateRole,
		createRole
	} = props;

	const { type, id } = location.query

	const [ form ] = useForm();
	const { validateFields, resetFields, setFieldsValue } = form;

	const initialValues = { roleName: '', description:'' };

	const authorizeObj = [[],[]];

	const [expandedKeys, setExpandedKeys] = useState();
	const [checkedKeys, setCheckedKeys] = useState([[],[]]);
	const [autoExpandParent, setAutoExpandParent] = useState(true);

	const saveRole = useCallback(async () => {
		try {
			const formFields = await validateFields();
			const submitFields = { ...formFields };
			if (id) {
				submitFields.id = id;
			} else {
				submitFields.status = 1;
			}
			const allKeys = checkedKeys.flat();
			const limit = allKeys.map(key=>{
				const arr = key.split('-');
				return{
					code: arr[0],
					privId: arr[1]
				}
			})
			submitFields.authorizeList = limit;
			if ( type === 'edit' ) {
				return updateRole(submitFields)
			} else {
				return createRole(submitFields)
			}
		} catch (e) {
			// console.log(e);
		}
	}, [id, checkedKeys]);

	useEffect(() => {
		if ( current ) {
			let { authorizeList, roleName, description } = current
			if (authorizeList) {
				authorizeList.forEach(item=>{
					if ( item && item.privId ) {
						let key = `${item.code}-${fillCode(item.privId)}`
						if ( item.privId == 100 || item.privId%100 !== 0 ) {
							// 一级页面
							authorizeObj[0].push(key)
						} else {
							// 整除100 为模块
							authorizeObj[1].push(key)
						}
					}
				})
				setCheckedKeys(authorizeObj)
			}
			setFieldsValue({
				roleName,
				description
			})
		}
	},[current]);

	const onExpand = expandedKeys => {
		setExpandedKeys(expandedKeys);
		setAutoExpandParent(false);
	};

	const onCheck = (checkedKeys, node) => {
		const { halfCheckedKeys } = node;
		
		setCheckedKeys([checkedKeys, halfCheckedKeys]);
	};

	const submitRoleForm = useCallback(async fieldsValue => {
		const res = await saveRole(fieldsValue);
		if (res) {
			message.success(
				`${type==='edit'?'编辑':'新建'}成功`,
				2,
				()=>{history.push('/system/role')}
			);
		}
	}, [checkedKeys]);

	return (
		<PageHeaderWrapper
			title={`${type==='edit'?'编辑':'新建'}权限`}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={initialValues}
				onFinish={submitRoleForm}
				{...formItemLayout}
			>
				<Card 
					title='基本信息'
				>
					<Item
						label="角色名称"
						name="roleName"
						rules={[
							{
								required: true,
								message: '请输入角色名称！',
								whitespace: true,
							},
						]}
					>
						<Input placeholder="请输入" />
					</Item>
					<Item
						label="角色描述"
						name="description"
						rules={[
							{
								required: true,
								message: '请输入角色描述！',
								whitespace: true,
							},
						]}
					>
						<TextArea placeholder="请输入" />
					</Item>
				</Card>
				<Card 
					title="角色权限">
					<Item
						name="authorizeList"
						rules={[
							{
								validator: (rules, value, callback) => {
									if ( checkedKeys[0].length === 0 ) {
										callback('权限不能为空！')
									}
									callback()
								}
							}
						]}
					>
						<Tree
							checkable
							onExpand={onExpand}
							expandedKeys={expandedKeys}
							autoExpandParent={autoExpandParent}
							onCheck={onCheck}
							checkedKeys={checkedKeys[0]}
							// onSelect={onSelect}
							treeData={treeData}
							// checkStrictly={true}
						/>
					</Item>
					<Item {...tailLayout}>
			            <Button htmlType="submit" type="primary">
			              提交
			            </Button>
			            <Button htmlType="button" style={{ margin: '0 30px' }} onClick={()=>{history.push('/system/role')}}>
			              取消
			            </Button>
			        </Item>
				</Card>
			</Form>
		</PageHeaderWrapper>
	);
};

export default connect(
	({ loading, role }) => ({
		current: role.current
	}),
	dispatch => ({

		async createRole(payload) {
			return dispatch({
				type: 'role/createRole',
				payload,
			});
		},

		async updateRole(payload) {
			return dispatch({
				type: 'role/updateRole',
				payload,
			});
		},
	}),
)(
	SaveRole,
);
