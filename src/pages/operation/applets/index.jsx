import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {SearchOutlined,PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Input,
	Tabs,
	Popconfirm,
	Typography
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import style from './index.less';
const { TabPane } = Tabs;
const { Text } = Typography;

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
	const infoTypeMap = {
		"1":"优惠券促销",
		"2":"活动推广"
	}
    useEffect(()=>{
		
	},[])
	
	const actionRef = useRef();
	//查看详情
	const showDetailForm = useCallback((row, type) => {
		setCurrentRow(row);
		setModalType(type);
		toggleDetailModalVisible(true);
	}, []);

		
	 // 表格搜索函数
	const beforeSearchSubmit = search => {
		const { createTime, payTime, area, orderStatus, serviceTypeId } = search;
		return search;
	};
	const columns = useMemo(
		() => [
				{
					title: '模版消息名称',
					dataIndex: 'temName',
					renderFormItem: (_item, { value, onChange }) => (
						<Input
							value={value}
							allowClear
							placeholder="请输入名称"
							onChange={onChange}
							suffix={<SearchOutlined style={{fontSize:"20px",color:"#d9d9d9"}}/>}
							style={{ width: '100%' }}
						/>
					),
				},
				{
					title: '消息类型',
					dataIndex: 'infoType',
					filters: false,
					hideInSearch: true,
					renderText:(_, row) => row.infoType ? infoTypeMap[row.infoType]:""
				},
				// {
				// 	title: '推送周期',
				// 	dataIndex: 'week',
				// 	hideInSearch: true
				// },
				// {
				// 	title: '推送频率',
				// 	dataIndex: 'remark',
				// 	hideInSearch: true
				// },
				{
					title: '模板消息内容',
					dataIndex: 'templateCon',
					hideInSearch: true
				},
				{
					title: '操作',
					key: 'option',
					width: 200,
					valueType: 'option',
					fixed:"right",
					render: (_,row) => [
					<a key="edit" onClick={
						()=>{
							localStorage.setItem("appletsItem",JSON.stringify({...row}))
							history.push({
								pathname: '/operation/applets/detail',
								query: {
									id: row.id,
									type:"edit"
								},
							})
						}
					}>编辑</a>,
					<Popconfirm
							title={'确定要删除吗？'}
							okType={'danger'}
							okText={'确定'}
							key="delete"
							onConfirm={() => {
							  console.log("row",row)
							}}
						>
							<a key="delete">
								<Text type="danger">删除</Text>
							</a>
					</Popconfirm>
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
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					pagination={{
						showSizeChanger: true,
					}}
					request={(params)=>getAppletsList(params)}
					columns={columns}
					search={{
						collapsed: false,
						// optionRender: ({ searchText, resetText }, { form }) => (
						// 	<></>
						// ),
					}}
					toolBarRender={() => [
						<Button type="primary"  className={style.add_btn} icon={<PlusOutlined />} onClick={()=>{
							history.push({
								pathname: '/operation/applets/detail',
								query: {
									type: "add",
								},
							})
						}}>
						  新建模板信息
						</Button>,
					  ]}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
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
				type: 'operation/getAppletsList',
				payload:{
					...params,
				}
			});
		},
	}),
)(UserInfo);
