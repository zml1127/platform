import { PlusOutlined } from '@ant-design/icons';
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
	Statistic,
	Modal, // 弹框
	Form,
	Popover,Upload,
	Row,Menu,Dropdown,
	Col,Breadcrumb,
} from 'antd';
import React, { useRef, useCallback, useMemo, memo, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import {downloadCsv} from '@/utils/utils';
import { connect } from 'dva';

const gasService = memo(props => {
	const { getOilPageList, deleteOil, oilOffline, oilOnline, save, } = props
	const actionRef = useRef()
	const [currentRow, setCurrentRow] = useState({})
	const [addPopVisible, setAddPopVisible] = useState(false) //新建油品弹框
	const [oilAddNum, setOilAddNum] = useState('') //
	const [uploading, setuploading] = useState(false); //按钮载入状态
	const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
	
	const columns = useMemo(
		() => [
			{
				title: '油品号',
				dataIndex: 'name',
				hideInSearch: true,
				width: 160,
				ellipsis: true, // 是否自动缩略
				renderText: (value, row) => {
					return row.name ? row.name : '--'
				},
			},
			{
				title: '创建时间',
				dataIndex: 'createTime',
				hideInSearch: true,
				width: 180,
				ellipsis: true, // 是否自动缩略
				renderText: (value, row) => (row.createTime || row.createTime==0) ? row.createTime : '--',
			},
			{
				title: '服务关联店铺数量',
				dataIndex: 'merchantNum',
				hideInSearch: true,
				width: 160,
				ellipsis: true, // 是否自动缩略
				renderText: (value, row) => (row.merchantNum || row.merchantNum==0) ? row.merchantNum : '--',
			},
			{
				title: '状态',
				dataIndex: 'status',
				// hideInSearch: true,
				width: 160,
				ellipsis: true, // 是否自动缩略
				render: (value, row) => {
					return (
						<Popconfirm
							disabled={row.status==0?true:false}
							title="全部选择此服务的店铺,此服务都会下线,是否确认?"
							onConfirm={()=>{  //上架状态，点击下架了
								oilOffline({ id: row.id }).then(res=>{
									if(res){
										actionRef.current.reload()
									}
								})
							}}
							okText="是"
    						cancelText="否"
						>
							<Switch checkedChildren="上架" unCheckedChildren="下架" defaultChecked checked={row.status?true:false} onChange={()=>{
								// console.log('row.status==', row.status, row.status==0?'下架状态，该商家了' :'哦')
								if(row.status==0){
									oilOnline({ id: row.id }).then(res=>{
										if(res){
											actionRef.current.reload()
										}
									})
								}
							}}/>
						</Popconfirm>
						
					)
				},
				renderText: (_, row) => {
					return row.status ? '上架' : '下架'
				}
			},
			{
				title: '操作',
				dataIndex: 'option',
				hideInSearch: true,
				// valueType: 'option',
				width: 160,
				render: (value, row) => {
					return (
						<div>
							<a style={{paddingRight:'16px'}} onClick={async ()=>{
								await setCurrentRow(row)
								await localStorage.setItem('refuelNum', row.name)
								await localStorage.setItem('oilId', row.id)
								props.history.push(`/service/gasService/gasServiceList`)
							}}>查看</a>
							<Popconfirm
								// disabled={false?true:false}
								title="确定删除吗?"
								onConfirm={()=>{ 
									if(row.status){
										message.error('该油品暂未下架,请先将该油品下线')
										return
									}
									deleteOil({ id: row.id }).then(res=>{
										if(res){
											actionRef.current.reload()
										}
									})
								}}
								okText="是"
								cancelText="否"
							>
								<a>删除</a>	
							</Popconfirm>
							
						</div>
					)
				},
			},
		],
		[ ],
	);

	const addOil = useCallback(()=>{
		// console.log('添加的油品号为oilAddNum==', oilAddNum)
		const reg = /^[0-9]*$/
		if (!reg.test(oilAddNum)) {
			message.error('仅允许输入数字');
			return;
		}
		createOil({ name: oilAddNum.trim() }).then(res=>{
			if(res){
				setAddPopVisible(false)
				actionRef.current.reload()
				message.success('添加成功')
			}
		})
	},[ oilAddNum, ])

	// 批量导入
	const Uploadprops = {
		name: 'file', //发到后台的文件参数名
		action: `http://localhost:8001/service/import`, //上传的地址
		// accept: '.zip',
		accept: '.xlsx', //接受上传的文件类型
		headers: { //设置上传的请求头部，IE10 以上有效
			token: localStorage.getItem('manage_system_accessToken') || 111,
			authorization: 'authorization-text',
			client_type: 1,
			// platform: "manage_system"
		},
		onChange(info) { //上传文件改变时的状态
			console.log('info==', info)
			if (info.file.status === 'uploading') {
				setuploading(true);
			}
			if (info.file.status === 'done') {
				setuploading(false);
				message.success(`${info.file.name} 导入成功`);
			}
			if (info.file.status === 'error') {
				setuploading(false);
				message.error(`${info.file.name}导入失败.`);
			}
		},
	};

	// 导出模板表下载
	const exportMerchant=async ()=>{
		getOilPageList({ current:1, pageSize:10000 }).then(res=>{
			console.log('获取下载列表啊啊res==', res)
			if(!(res && res.data)){
				message.error('下载失败')
				return
			}
			let currentTime = moment(new Date()).format(DATE_FORMAT);
			let fileName = '订单导出' + currentTime
			let linkId = "download-link";
		    let header = [];
			columns.forEach(item=>{
				if(!item.hideInTable && item.dataIndex !== 'option'){
					header.push(item.title)  //标题
				}
			})
			let content = [];
			res.data.forEach(item=>{
				let rowContent = [];
				columns.forEach(data=>{
					if(!data.hideInTable && data.dataIndex !== 'option'){
						if(data.renderText){
							rowContent.push(data.renderText(item[data.dataIndex], item))
							console.log('data.render==', data.renderText(item[data.dataIndex], item) )
						}else{
							console.log('item[data.dataIndex]==', item[data.dataIndex], 'item==', item, 'data.dataIndex==', data.dataIndex)
							rowContent.push(item[data.dataIndex])
						}
					}
				})
				content.push(rowContent)
			})
			console.log('content===', content)
			downloadCsv(linkId, header, content, fileName)
		})
	}

    return (
	  <PageHeaderWrapper extra={<div style={{display:'flex'}}>
		  {/* <Upload showUploadList={false} {...Uploadprops}> */}
			  <Button loading={uploading} onClick={()=>{ console.log('点击批量导入了') }} style={{marginRight:'10px'}}>
				批量导入
			</Button>
		  {/* </Upload> */}
		  <Button 
		  	// onClick={exportMerchant}
		  >模板表下载</Button>
	  </div>}
	  >
		  <ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				// headerTitle={`${localStorage.getItem('currentOilService')}`}
				actionRef={actionRef}
				columns={columns}
				request={params => { return getOilPageList(params) }}
				rowKey="id"
				key="id"
				options={{ fullScreen: false, reload: true, density: true, setting: true }}
				pagination={{
					showSizeChanger: true,
				}}
				search={false}
			/>
			<a 
				id="download-link" 
				style={{display: 'none'}}
			>export</a>
      </PageHeaderWrapper>
    );
});


export default connect(
	({ gasService }) => ({
        aaa: gasService.aaa,
	}),
	dispatch => ({
		save(key, value) {
			return dispatch({
				type: 'gasService/save',
				payload: [key, value,],
			});
		},
		// 查询油品列表
		async getOilPageList(payload) {
			return dispatch({
				type: 'gasService/getOilPageList',
				payload,
			});
		},
		// 油品删除
		async deleteOil(payload) {
			return dispatch({
				type: 'gasService/deleteOil',
				payload,
			});
		},
		// 油品下架 
		async oilOffline(payload) {
			return dispatch({
				type: 'gasService/oilOffline',
				payload,
			});
		},
		// 油品上架 
		async oilOnline(payload) {
			return dispatch({
				type: 'gasService/oilOnline',
				payload,
			});
		},
	}),
)(gasService);
