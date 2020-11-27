import { connect } from 'dva';

import React, { useRef, useCallback, useMemo, memo, useState } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
	Button,
	Input,
	message,
	Switch,
	Cascader,
	DatePicker,
	Tooltip,
	Select,
	Typography,
	Popconfirm,
	Row,
	Statistic,
} from 'antd';
import { Link } from 'umi';
import { useEffectOnce, useMountedState, useToggle } from 'react-use';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { downloadCsv } from '@/utils/utils';


const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const Order = props => {
	const {
		getOrderList,
		orderList,
		serviceTypeContent,
		columns,
		actionRef
	} = props;

	const [ searchDate, setSearchDate] = useState({});
	/**
	 * 表格搜索函数
	 * @param {object} param0 搜索字段
	 */
	const beforeSearchSubmit = search => {
		const {
			createTime,
			payTime,
			area,
			orderStatus,
			serviceTypeId,
			address,
		} = search;

		if ( createTime ) {
			search.createTimeStart = createTime[0].startOf('day').format(DATE_FORMAT)
			search.createTimeEnd = createTime[1].format("YYYY-MM-DD")+" 23:59:59";
			delete search.createTime;
		}
	
		if ( payTime ) {
			search.payStartTime = payTime[0].startOf('day').format(DATE_FORMAT)
			search.payEndTime = payTime[1].format("YYYY-MM-DD")+" 23:59:59";
			delete search.payTime;
		}
		if ( area ) {
			search.provinceId = area[0]
			search.cityId = area[1] 
			search.districtId = area[2]
			delete search.area;
			delete search.address;
		}
		if ( orderStatus === '0') {
			delete search.orderStatus;
		}
		if ( serviceTypeId === '0' ) {
			delete search.serviceTypeId;
		}
		setSearchDate(search)
		return search;
	};

	// 导出数据
    const exportParams = () => {
        getOrderList({...searchDate, current:1, pageSize:10000}).then(res=>{
        	if(!(res && res.data)) {
        		message.error('导出失败');return
        	}
	        const currentTime = moment(new Date()).format(DATE_FORMAT);
	        // console.log(currentTime);
	        const fileName = `订单导出${  currentTime}`;
	        const linkId = "download-link";
	        const header = [];
        	columns.forEach(item=>{
	        	if ( !item.hideInTable && item.dataIndex !== 'option') {
	        		header.push(item.title)
	        	}
	        })
	        const content = [];
	        res.data.forEach(item => {
	            const rowContent = [];
	        	columns.forEach(data=>{
		        	if ( !data.hideInTable && data.dataIndex !== 'option') {
		        		if ( data.renderText ) {
		        			rowContent.push(String(data.renderText(item[data.dataIndex], item)))
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
        },req=>{message.error('导出失败')})
    };

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
					// pagination={{
						// showSizeChanger: true,
					// }}
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
					request={getOrderList}
					columns={columns}
					options={{ fullScreen: false, reload: false, density: false, setting: false }}
				/>
					<a id="download-link" style={{display: 'none'}}>export</a>
			</PageHeaderWrapper>
		);
	}

export default Order;
