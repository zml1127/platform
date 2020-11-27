import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {SearchOutlined,PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Input,
	Tabs,
	Popconfirm,
	Typography,
	message
} from 'antd';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import style from './index.less';
const { TabPane } = Tabs;
const { Text } = Typography;
const baseUrl = "http://sk-business.oss-cn-zhangjiakou.aliyuncs.com"

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
		getOpmaterialPage,
		deleteOpmaterial,
		location
	} = props;
	const {detailType} = location.query
	const [type,SetType] = useState()
	const actionRef = useRef();

	const tabArr =[
		{
			key:1,
			value:"Banner"
		},
		{
			key:2,
			value:"胶囊图"
		},
		{
			key:3,
			value:"ICON"
		}
	]

    useEffect(()=>{
		SetType(detailType?detailType:tabArr[0]["key"])
	},[])

	// 切换胶囊 刷新列表
	useEffect(()=>{
		actionRef.current.reload()
	},[type])
		
	 // 表格搜索函数
	const beforeSearchSubmit = search => {	
		return search;
	};
	const columns = useMemo(
		() => [
				{
					title: "预览图",
					dataIndex: 'imgUrl',
					key:"imgUrl",
					hideInSearch: true,
					render: (_,row) => [
						<img src={`${row.imgUrl}`} key="img" style={{width:"120px",height:"120px"}}/>
					]
				},
				{
					title: '名称',
					dataIndex: 'name',
					width:200,
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
					title: '规格',
					dataIndex: 'spec',
					filters: false,
					hideInSearch: true,
				},
				{
					title: '创建时间',
					dataIndex: 'createTime',
					hideInSearch: true
				},
				{
					title: '备注',
					dataIndex: 'mark',
					hideInSearch: true,
					width:500,
				},
				{
					title: '操作',
					key: 'option',
					width: 200,
					valueType: 'option',
					fixed: 'right',
					render: (_,row) => [
					<a key="edit" onClick={
						()=>{
							history.push({
								pathname: '/operation/material/detail',
								query: {
									id: row.id,
									type:"edit",
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
								deleteOpmaterial({id:row.id}).then(res=>{
									if(res.code == "0000"){
										message.success('删除成功')
										actionRef.current.reload()
									}
								})
							  
							}}
					>
							<a key="delete">
								<Text type="danger">删除</Text>
							</a>
					</Popconfirm>
				   ]
				  },
		],[type],
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
					request={(params)=>getOpmaterialPage(params,type)}
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
					toolBarRender={() => [
						<Tabs defaultActiveKey={String(type)} size="large" style={{width:"100%"}} className={style.tab_style} onChange={val=>{
							SetType(val)
						}}>
							{
								tabArr.map((item)=>{
									return (<TabPane tab={item.value} key={item.key}></TabPane>)
								})
							}
						</Tabs>,
						<Button type="primary" className={style.add_btn} icon={<PlusOutlined />} onClick={()=>{
							history.push({
								pathname: '/operation/material/detail',
								query: {
									type: "add",
									bannerType:type,
								},
							})
						}}>
						  添加素材
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
		async getOpmaterialPage(params,type) {
			return dispatch({
				type: 'operation/getOpmaterialPage',
				payload:{
					...params,
					type
				}
			});
		},
		async deleteOpmaterial(payload) {
			return dispatch({
				type: 'operation/deleteOpmaterial',
				payload,
			});
		},
		
	}),
)(UserInfo);
