import { Input, Modal, Form, Row, Col, DatePicker } from 'antd';
import React, { useCallback, memo, useEffect, useMemo, useState, useRef } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import ProTable from '@ant-design/pro-table';

export default memo(props => {
	const { modalVisible, onCancle, currentRow, onSearch } = props;
	const actionRef = useRef();
	/**
	 * 表格搜索函数
	 * @param {object} param0 搜索字段
	 */
	const beforeSearchSubmit = params => {
		
	};
	const setRangePicter = value => {
		return moment(value[0]._d).format('YYYY-MM-DD');
	};

	const columns = useMemo(() => [
		{
			title: '店铺所在区域',
			dataIndex: 'area',
			copyable: false,
			ellipsis: true,
			hideInSearch: true,
			width:500,
		},
		{
			title: '店铺名称',
			dataIndex: 'name',
			ellipsis: true,
			hideInSearch: true,
			width:200,
		}
	]);
	return (
		<Modal
			width={800}
			destroyOnClose
			title={``}
			visible={ modalVisible }
			onCancel={ onCancle }
			footer={null}
			maskClosable={false}
		>
			<ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				actionRef={actionRef}
				rowKey="id"
				key="id"
				pagination={{
					showSizeChanger: true,
				}}
				beforeSearchSubmit={ searchProps => beforeSearchSubmit(searchProps) }
				request={ ()=>onSearch({extendCouponId:currentRow.id})}
				columns={columns}
				options={{ fullScreen: false, reload: false, density: false, setting: false }}
				search={false}
			/>
		</Modal>
	);
});
