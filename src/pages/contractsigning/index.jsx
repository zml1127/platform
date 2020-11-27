/* eslint-disable prefer-destructuring */
import { connect } from 'dva';
import { Button, message, Cascader, Popover } from 'antd';
import React, { useRef, useMemo, memo, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';

import {regionalConversion, timeConverter, copyValue} from '@/utils/utils';
// import style from './style.scss'

export default connect(
	({ global }) => ({
		position: global.cityList,
	}),
	dispatch => ({
		// 列表
		async getContractsigningList(payload) {
			const params = { ...payload };
			return dispatch({
				type: 'contractsigning/getContractsigningList',
				payload: {
					...params,
				},
			});
		},
		// 导出
		async getExportList(payload) {
			const params = { ...payload };
			return dispatch({
				type: 'contractsigning/getExportList',
				payload: {
					...params,
				},
			});
		},
		// 线下进行数据导出
		async getDataexport(payload) {
			const params = { ...payload };
			return dispatch({
				type: 'contractsigning/getDataexport',
				payload: {
					...params,
				},
			});
		},
	}),
)(
	memo(props => {
		const [searchValue, setSearchValue] = useState();
		const { position, getContractsigningList, getExportList, getDataexport } = props;
		// 导出
		const exportdata =  () => {
			getExportList(searchValue).then(res=>{

				console.log(res, 'res');
				if (res.data) {
					const a=document.getElementById("contractx");
					a.filename=`合同签约数据${new Date().getTime}.xlsx`
					
					a.href=res.data;
					a.addEventListener(("click"),e=>{
						e.stopPropagation()
					},false)
					a.click()
					// await window.open(res.data, '_blank');
				}	
			},()=>{
			
				message.warning('导出失败');
			
			})

		};
		// 线下导出
		const offlineexport = async () => {
			const res = await getDataexport(searchValue);
			if (res.data) {

				await window.open(res.data, '_blank');
			} else {
				message.warning('导出失败');
			}
		};
		const columns = useMemo(
			() => [
				{
					title: '公司名称',
					dataIndex: 'signName',
					hideInSearch: true,
				},
				{
					title: '店铺名称',
					dataIndex: 'shopName',
					hideInSearch: true,
				},
				{
					title: '店铺类型',
					dataIndex: 'serviceTypeName',
					hideInSearch: true,
				},
				{
					title: 'BD(工号/姓名)',
					dataIndex: 'signId',
					hideInSearch: true,
					renderText: (_, row) => {
						return `${row.signId}/${row.name}`
					}
				},
				{
					title: '合同签署时间',
					dataIndex: 'signTime',
					valueType: 'dateRange',
					enderText: (_, row) => {
						return _ ? moment(_).format("YYYY/MM/DD HH:mm") : '-'
					}
				},
				{
					title: '随行付进件时间',
					dataIndex: 'createTime',
					hideInSearch: true,
					renderText: (_, row) => {
						return _ ? moment(_).format("YYYY/MM/DD HH:mm") : '-'
					}
				},
				{
					title: '认证状态',
					dataIndex: 'processStatus',
					hideInSearch: true,
					render: (_, row) => {
						let content = null
						content = (
							<div>{row.message}</div>
						)
						if ( ['已驳回', '未进件'].includes(row.processStatus) && row.message ) {
							return(
								<Popover placement="top" content={content}>
							        <a onClick={()=>{
							        	copyValue(row.message, '原因已复制')
							        }}>{row.processStatus}</a>
						      	</Popover>
							)
						} else {
							return row.processStatus || '-'
						}
					}
				},
				{
					title: '省/市',
					dataIndex: 'provinceName',
					hideInSearch: true,
					renderText:(_, row) => {
						return `${row.provinceName}/${row.cityName}`
					}
				},
				{
					title: 'WX进件时间',
					dataIndex: 'wxIncomeTime',
					hideInSearch: true,
					renderText: (_, row) => {
						return _ ? moment(_).format("YYYY/MM/DD HH:mm") : '-'
					}
				},
				{
					title: 'WX进件状态',
					dataIndex: 'wxStatus',
					hideInSearch: true,
					valueEnum: {
						0: '终止未成功',
						1: '成功'
					}
				},
				{
					title: 'WX进件成功商编号',
					dataIndex: 'wxSubMchid',
					hideInSearch: true
				},
				{
					title: '区域',
					dataIndex: 'districtName',
					hideInTable: true,
					renderFormItem: (_item, { onChange }) => (
						<Cascader
							options={position}
							showSearch
							allowClear
							onChange={onChange}
							fieldNames={{ label: 'name', value: 'provinceCityCode', children: 'children' }}
						/>
					),
				},
			],
			[position],
		);
		const actionRef = useRef();
		const beforegetMerchantList = payload => getContractsigningList({ ...payload, ...searchValue });
		return (
			<PageHeaderWrapper
				key="100"
				content={[
					// <a id="qqq" key="1" onClick={offlineexport} className={style.PageHeaderWrapper}>
					// 	<Button type="primary">线下进行数据导出</Button>
					// </a>,
				]}
			>
				<ProTable
					rowKey="id"
					scroll={{ x: 'max-content' }}
					headerTitle="合同签约数据"
					toolBarRender={() => [
						<a id="xxx" key="2" onClick={exportdata} download>
							<Button type="primary">导出</Button>
						</a>,
					]}
					request={beforegetMerchantList}
					actionRef={actionRef}
					columns={columns}
					options={{ fullScreen: false, density: true, reload: true, setting: true }}
					search={{
						collapsed: false,
						optionRender: ({ searchText, resetText }, { form }) => (
							<>
								<Button
									onClick={() => {
										let data = form.getFieldsValue();
										Object.getOwnPropertyNames(data).forEach(function(key) {
											
											
											if (data[key] && data[key] !== '') {
												if (key === 'signTime') {
													data.startTime = timeConverter(data[key][0])
													data.endTime =  timeConverter(data[key][1])
													delete data[key];
												} else if (key === 'districtName') {
													const tempdata = { ...data[key] };
												
													if(tempdata&&JSON.stringify(tempdata)!=="{}"){

														data={...regionalConversion(tempdata),...data};
													}
													// data.districtCode = tempdata[2] || '';
													delete data[key];
												}
											} else {
												delete data[key];
											}
										});
										setSearchValue({ ...data });
										actionRef.current.reload();
									}}
								>
									{searchText}
								</Button>{' '}
								<Button
									type="primary"
									onClick={() => {
										setSearchValue({});
										form.resetFields();
										actionRef.current.reload();
									}}
								>
									{resetText}
								</Button>{' '}
							</>
						),
					}}
				/>
				<a id="contractx" style={{display:"none"}}>导出</a>
			</PageHeaderWrapper>
		);
	}),
);
