import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Tabs, Cascader, Select, Modal, } from 'antd';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { connect } from 'dva';
import { divide } from 'lodash';

const PartShopModal = memo(props => {
	const { visible, setVisible, getShopList, idName, } = props
    
    const columns = useMemo(()=>[
		{
			title: '店铺所在区域',
			dataIndex: 'area',
			hideInSearch: true,
			width: 200,
			ellipsis: true, // 是否自动缩略
			// render: (value, row) => row.refuelNum ? row.refuelNum : '--',
        },
        {
			title: '店铺名称',
			dataIndex: 'name',
			hideInSearch: true,
			width: 200,
			ellipsis: true, // 是否自动缩略
			// render: (value, row) => row.refuelNum ? row.refuelNum : '--',
		},
    ],[ ])
    
    return (
        <Modal 
            visible={visible}
            onCancel={()=>{ setVisible(false) }}
            footer={false}
            title={idName.name}
			width={1000}
			destroyOnClose
        >
		    <ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				columns={columns}
				search={false}
                request={ params=>{ return getShopList({ ...params, ...{ groupTplId : idName.id, pubType: 1 } }) } }
				rowKey="id"
				key="id"
				options={{ fullScreen: false, reload: false, density: false, setting: false }}
				pagination={{
					showSizeChanger: true,
				}}
				toolBarRender={false}
			/>
      	</Modal>
    );
});

export default connect(
	({ makeGroup, coupon, }) => ({
		
	}),
	dispatch => ({
		async getShopList(payload, type) {
			return dispatch({
				type: 'coupon/getShopList',
				payload
			});
		},
	}),
)(PartShopModal);
