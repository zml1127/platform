import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Button,
	Cascader
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';

const userMap = {
	'1': '新用户',
	'2': '普通用户',
	'3': '活跃用户',
	'4': '沉默用户',
};

const UserInfo = memo(props => {
	const {
		getUsertocmpList ,
		getCityList,
		cityList
	} = props;

    useEffect(()=>{
		getCityList()
	},[])
	const actionRef = useRef();
		
	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { city } = search;
		let provinceId = city&&city[0]?city[0]:null
		let cityId = city&&city[1]?city[1]:null
		let districtId =city&&city[2]?city[2]:null
		let params = {
			...search,
			provinceId,
			cityId,
			districtId,
		}
		delete params.city
		return params;
		
	};
	const columns = useMemo(
		() => [
				{
					title: '手机号',
					dataIndex: 'mobile',
					key:"mobile",
				},
				{
					title: '用户状态',
					dataIndex: 'state',
					filters: false,
					valueEnum: userMap,
					renderText:(_, row) => row.state ? userMap[row.state]:userMap[row.userStatus]
				},
				{
					title: '用户昵称',
					dataIndex: 'nickName',
					hideInSearch: true
				},
				{
					title: '常驻城市',
					dataIndex: 'city',
					ellipsis: true,
					renderFormItem: (_item, { value, onChange }) => (
						<Cascader
							options={cityList}
							showSearch
							allowClear
							style={{ width: '100%' }}
							fieldNames={{ label: 'name', value: 'id', children:'children'}} // 定义label/value/children对应字段
							value={value} // 指定选中项目
							onChange={onChange}
							style={{ width: '200px' }}
						/>
					),
				},
				{
					title: '注册时间',
					dataIndex: 'createTime',
					hideInSearch: true,
				},
				{
					title: '最近登陆时间',
					dataIndex: 'lastLoginTime',
					hideInSearch: true,
				},
				{
					title: '用户详情查看',
					key: 'option',
					width: 120,
					valueType: 'option',
					render: (_,row) => [
					<a key="see" onClick={
						()=>{
							history.push({
								pathname: '/userManagement/userInfo/detail',
								query: {
									id: row.id,
								},
							})
						}
					}>查看</a>
				   ]
				},
		],
		[cityList],
	);

		return (
			<PageHeaderWrapper>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					// pagination={{
					// 	showSizeChanger: true,
					// }}
					request={getUsertocmpList}
					columns={columns}
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
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
				/>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global, order }) => ({
		cityList: global.cityListUser, // 省市区数据
		orderList: order.orderList,
		serviceTypeContent: global.serviceTypeContent
	}),
	dispatch => ({
		async getUsertocmpList  (payload) {
			return dispatch({
				type: 'userManagement/getUsertocmpList',
				payload,
			});
		},
		async getCityList (payload) {
			return dispatch({
				type: 'global/getCityList',
				payload,
			});
		},
	}),
)(UserInfo);
