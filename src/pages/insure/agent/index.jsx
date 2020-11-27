import { connect } from 'dva';
import { Cascader, Input, Tooltip, Select, DatePicker, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import EditModal from './EditModal';
import {downloadCsv} from '@/utils/utils';
import { useToggle } from 'react-use';

import { getObjectFromArrayWithDic } from '@/utils/utils'; //用于获取下拉选项的枚举对象

const { Option } = Select;
const { RangePicker } = DatePicker;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const Agent = memo(props => {
		const {
			getAgentList,
			getWhiteList,
			getBankList,
			getCityList,
			getCardInfo,
			editBankCard,
			agentList,
			whiteList,
			bankList,
			cityList,
			currentCard
		} = props;

		const [ searchDate, setSearchDate ] = useState({});
		const [ editModalVisible, toggleEditModalVisible ] = useToggle(false);
		const actionRef = useRef();

		useEffect(()=>{
			// getWhiteList();
			// getBankList();
			// getCityList();
		},[])

		/**
		 *编辑
		 */
		const showEditForm = useCallback(async userId => {
			await getCardInfo(userId);
			toggleEditModalVisible(true);
		}, [currentCard]);

		const whiteMap = useMemo(()=>{
			let map = {'0': '全部'}
			whiteList.forEach((item)=>{
				let { merchantId, merchantName } = item
				map[merchantId] = merchantName
			})
			return map
		},[whiteList])


		/**
		 * 表格搜索函数
		 * @param {object} param0 搜索字段
		 */
		const beforeSearchSubmit = (search) => {
			let { merchant_id } = search;

			if ( merchant_id === '0') {
				delete search.merchant_id;
			}
			delete search._timestamp;
			setSearchDate(search)
			return search;
		};

		//导出数据
	    const exportParams = () => {
	        getAgentList({...searchDate, current:1, page_size:10000}).then((res)=>{
	        	if(!(res && res.data)) {
	        		message.error('导出失败');return
	        	}
		        let currentTime = moment(new Date()).format(DATE_FORMAT);
		        // console.log(currentTime);
		        let fileName = "订单导出" + currentTime;
		        let linkId = "download-link";
		        let header = [];
	        	columns.forEach(item=>{
		        	if ( !item.hideInTable && item.dataIndex !== 'option') {
		        		header.push(item.title)
		        	}
		        })
		        let content = [];
		        res.data.forEach((item) => {
		            let rowContent = [];
		        	columns.forEach(data=>{
			        	if ( !data.hideInTable && data.dataIndex !== 'option') {
			        		if ( data.renderText ) {
			        			rowContent.push(data.renderText(item[data.dataIndex], item))
		        			} else if ( data.valueEnum ) {
		        				rowContent.push(data.valueEnum[item[data.dataIndex]])
			        		} else {
			        			rowContent.push(item[data.dataIndex])
			        		}
			        	}
		        	})
		            content.push(rowContent);
		        });

		        // console.log(JSON.stringify(content));
		        // console.log('downloadCsv', downloadCsv)
		        downloadCsv(linkId, header, content, fileName);
		        message.success("导出成功")
	        },(req)=>{message.error('导出失败')})
	    };

		/**
		 * 提交新增、编辑商户表单
		 * @param {object} fieldsValue 新增、编辑商户信息
		 */
		const submitEdit = useCallback(
			async fieldsValue => {
				const res = await editBankCard(fieldsValue);
				if (res) {
					message.success(`${fieldsValue.type==1?'添加':'编辑'}成功！`);
					toggleEditModalVisible(false);
					// noinspection JSUnresolvedFunction
					// actionRef.current.reload();
				}
			}
		);

		const columns = useMemo(
			() => [
				{
					title: '序号',
					dataIndex: 'id',
					hideInSearch: true
				},
				{
					title: '手机号',
					dataIndex: 'mobile',
					hideInTable: true
				},
				{
					title: '代理人手机号',
					dataIndex: 'agentMobile',
					hideInSearch: true
				},
				{
					title: '白名单店铺',
					dataIndex: 'merchant_id',
					hideInTable: true,
					valueEnum: whiteMap,
				},
				{
					title: '授权白名单店铺',
					dataIndex: 'authMerchantId',
					hideInSearch: true,
					valueEnum: whiteMap,
					filters: false,
				},
				{
					title: '操作',
					dataIndex: 'option',
					valueType: 'option',
					render: (_, row) => <a onClick={() => showEditForm(row.userId)}>银行卡</a>
				},
			],
			[whiteMap],
		);

		return (
			<PageHeaderWrapper>
				<ProTable
					scroll={{ x: 'max-content' }}
					tableClassName="pro-table-padding"
					actionRef={actionRef}
					rowKey="id"
					beforeSearchSubmit={beforeSearchSubmit}
					toolBarRender={() => [
						<Button onClick={exportParams}>
							导出订单
						</Button>,
					]}
					pagination={{
						showSizeChanger: true,
					}}
					request={getAgentList}
					columns={columns}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
					search={{
						collapsed: false,
						collapseRender: null
					}}
				/>
					<EditModal
						onSubmit={submitEdit}
						onCancel={() => toggleEditModalVisible(false)}
						cityList={cityList}
						modalVisible={editModalVisible}
						bankList={bankList}
						currentCard={currentCard}
					/>
                    <a id="download-link" style={{display: 'none'}}>export</a>
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ insure }) => ({
		agentList: insure.agentList,
		whiteList: insure.whiteList,
		bankList: insure.bankList,
		cityList: insure.cityList,
		currentCard: insure.currentCard
	}),
	dispatch => ({
		async getAgentList(payload) {
			return dispatch({
				type: 'insure/getAgentList',
				payload
			});
		},
		async editBankCard(payload){
			return dispatch({
				type: 'insure/editBankCard',
				payload
			});		
		},
		async getWhiteList(){
			return dispatch({
				type: 'insure/getWhiteList',
				payload:{}
			});		
		},
		async getBankList(){
			return dispatch({
				type: 'insure/getBankList',
				payload:{}
			});		
		},
		async getCardInfo(userId){
			return dispatch({
				type: 'insure/getCardInfo',
				payload:{
					user_id: userId
				}
			});		
		},
		async getCityList(){
			return dispatch({
				type: 'insure/getCityList',
			});		
		},

	}),
)(Agent);
