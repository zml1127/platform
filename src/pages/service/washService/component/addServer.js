import { Input, Modal, Form, Row, Col, DatePicker,Button } from 'antd';
import React, { useCallback, memo, useEffect, useMemo, useState, useRef } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import ProTable from '@ant-design/pro-table';

const { useForm } = Form;
export default memo(props => {
	//onSearch表格搜索事件 singleServiceList编辑回显的服务数据，setSingleServiceList设置选择的数据,serverList服务列表总数据
	const { modalVisible, onCancle, onSearch,singleServiceList,setSingleServiceList,serverList,setFieldsValue,validateFields } = props;
	const actionRef = useRef();
	const [selectedRowKeys,setSelectedRowKeys] = useState()

	useEffect(()=>{
		setSelectedRowKeys(singleServiceList.map(item=>item.id))
	},[singleServiceList])

	const onSelectChange = selectedRowKeys=>{
		setSelectedRowKeys(selectedRowKeys)
	}

	const rowSelection = {
		selectedRowKeys,
		onChange:onSelectChange,
	}

	// 提交选择数据
	const handleSelect = ()=>{
		const selectData = [].concat( serverList.filter(item=>selectedRowKeys.includes(item.id)) )
		
		selectData.forEach(item=>{
			item.countNum = item.countNum ? item.countNum :1
			
		})

		setSingleServiceList(selectData)
		validateFields()
		onCancle(false)

	}
	const beforeSearchSubmit = params => {

		const { name } = params
		delete params.name
		return {
			...params,
			search:name
		}
	};


	const columns = useMemo(() => [
		{
			title: '服务名称',
			dataIndex: 'name',
			ellipsis: true,
			renderFormItem: (_item, { value, onChange }) => <Input placeholder="请输入" style={{width:"200px"}}/>
		},
		{
			title: '服务类型',
			dataIndex: 'serviceCateName',
			ellipsis: true,
			hideInSearch: true,
			render:(_, row) => {
				const  serviceCate2Name = row.serviceCate2Name ? row.serviceCate2Name : " "
				const  serviceCateName = row.serviceCateName ? `-${row.serviceCateName}`: " "
				return serviceCate2Name+serviceCateName
			}
		},
		{
			title: '原价',
			dataIndex: 'oriPrice',
			ellipsis: true,
			hideInSearch: true,
		},
		{
			title: '优惠价',
			dataIndex: 'price',
			hideInSearch: true,
		},
		{
			title: '订单数',
			dataIndex: 'totalNum',
			hideInSearch: true,
		},
		{
			title: '添加服务时间',
			dataIndex: 'createTime',
			hideInSearch: true,
		},

	]);
	return (
		<Modal
			width={1300}
			destroyOnClose
			title={`选择服务`}
			visible={ modalVisible }
			onCancel={ onCancle }
			onOk={ handleSelect }
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
				rowSelection = { rowSelection }
				search={{
					collapsed: true,
					optionRender: ({ searchText, resetText }, { form }) => (
						<>
							<Button
								type="primary"
								onClick={() => {
									form.submit()
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
				beforeSearchSubmit={ searchProps => beforeSearchSubmit(searchProps) }
				request={ (params)=>onSearch({...params,merchantId:sessionStorage.getItem("washMerchantId")}) }
				columns={columns}
				options={{ fullScreen: false, reload: false, density: false, setting: false } }

			/>
		</Modal>
	);
});


