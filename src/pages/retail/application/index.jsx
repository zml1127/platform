import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {SearchOutlined,PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Select,
	Modal,
	Form,
	Input,
	Upload,
	message 
} from 'antd';
import { history } from 'umi';
import OSS from 'ali-oss';
import ProTable from '@ant-design/pro-table';
import style from './index.less'
import moment from 'moment';
const { useForm } = Form;
const { TextArea } = Input;

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
import { downloadCsv } from '@/utils/utils';

const UserInfo = memo(props => {
	const {
		getDistributionWithDrawPage,
		auditDistributionWithDraw,
		getStsToken,
		ossToken,
	} = props;

	const actionRef = useRef();
	const [form] = useForm();
	const { submit } = form;
	const { resetFields,setFieldsValue,getFieldValue,getFieldsValue,validateFields } = form;
	const [rejectVisable,setRejectVisable] = useState(false)
	const [evidenceVisible,setEvidenceVisible] = useState(false)
	const [imgUrl, setImgUrl] = useState("")
	const [currentRow,setCurrentRow] = useState({})
	const [ searchDate, setSearchDate] = useState({});
	
	const typeObj = {1:"微信",2:"银行卡"}
	const statusObj = {1:"申请中",2:"已打款",3:"已驳回"}
    useEffect(()=>{
		getStsToken()
	},[])
	 // 表格搜索函数
	const beforeSearchSubmit = search => {	
		setSearchDate(search)
		return search;
	};
	const handleReject = ({remark}) =>{
		const {id} = currentRow
		auditDistributionWithDraw({
			id,
			remark,
			type:3
		}).then(res=>{
			if(res.code=="0000"){
				setRejectVisable(false)
				actionRef.current.reload()
			}
		})
	}
	const getUrl = useCallback(
		(file, type) => {
				if (ossToken.expiration > Date.now()) {
					// 没有过期
					const client = new OSS({
						region: ossToken.region,
						accessKeyId: ossToken.accesKeyId, 
						accessKeySecret: ossToken.accesKeySecret, 
						stsToken: ossToken.securityToken, 
						bucket: ossToken.bucket, 
					});
					client.put(`/apply${Date.now()}`, file)
						.then(function(rl) {
							setImgUrl(rl.url);
							setFieldsValue({imgUrl:`/apply${rl.url.split('/apply')[1]}`})
						})
						.catch(err => {});
				} else {
					getStsToken().then(res => {
						if (res.code === '0000') {
							getUrl(file, type);
						}
					});
				}
		},[ossToken]
	);
	const beforeUpload = useCallback(
		(file, type) => {
			if (!['image/png','image/jpeg'].includes(file.type)) {
				message.error("请选择JPEG、JPG、PNG格式图片");
			}else{
				getUrl(file, type);
			}
		},
		[ossToken],
	);
	// 同意申请
	const handleApply = ({imgUrl})=>{
		const {id} = currentRow
		auditDistributionWithDraw({
			id,
			certUrl:imgUrl,
			type:2
		}).then(res=>{
			if(res.code=="0000"){
				setEvidenceVisible(false)
				actionRef.current.reload()
			}
		})
	}
	
	// 导出数据
    const exportParams = () => {
        getDistributionWithDrawPage({...searchDate, current:1, pageSize:99999}).then(res=>{
        	if(!(res && res.data)) {
        		message.error('导出失败');return
        	}
	        const currentTime = moment(new Date()).format(DATE_FORMAT);
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
	        downloadCsv(linkId, header, content, fileName);
	        message.success("导出成功")
        },req=>{message.error('导出失败')})
    };
	const columns = useMemo(
		() => [
				{
					title: '申请人手机号',
					key:"mobile",
					dataIndex: 'mobile',
					renderFormItem: (_item, { value, onChange }) => <Input placeholder="请输入申请人手机号"/>,
					filters: false,
				},
				{
					title: '申请人卡号',
					dataIndex: 'cardNum',
					key:"cardNum",
					filters: false,
					hideInSearch: true,
				},
				{
					title: '持卡人',
					dataIndex: 'cardholderName',
					hideInSearch: true,
				},
				{
					title: "凭证",
					dataIndex: 'certUrl',
					key:"certUrl",
					hideInSearch: true,
					render: (_,row) => [
						<img src={`${row.certUrl}`} key="img" style={{width:"100px",height:"100px"}}/>
					]
				},
				{
					title: '申请时间',
					dataIndex: 'createTime',
					hideInSearch: true,
				},
				{
					title: '处理时间',
					dataIndex: 'dealTime',
					hideInSearch: true,
				},
				{
					title: '提现方式',
					dataIndex: 'type',
					filters: false,
					renderText: (value, row) => typeObj[value],
					hideInSearch: true,
				},
				{
					title: '提现金额',
					dataIndex: 'money',
					hideInSearch: true,
				},
				{
					title: '驳回原因',
					dataIndex: 'remark',
					hideInSearch: true,
				},
				{
					title: '状态',
					dataIndex: 'status',
					renderText: (value, row) => statusObj[value],
					renderFormItem: (_item, { value, onChange }) => {
						return (
							<Select defaultValue="" onChange={onChange}>
								<Select.Option value="" key={0}>全部</Select.Option>
								<Select.Option value={1} value={1}>申请中</Select.Option>
								<Select.Option value={1} value={2}>已打款</Select.Option>
								<Select.Option value={2} value={3}>已驳回</Select.Option>
							</Select>
						);
					}
				},
				{
					title: '操作',
					key: 'option',
					width: 200,
					valueType: 'option',
					fixed: 'right',
					render: (_,row) => row.status == 1?[
					
						<a key="apply" onClick={()=>{
							setCurrentRow(row)
							setFieldsValue({imgUrl:""})
							setEvidenceVisible(true)
						}}>审核通过</a>,
						<a key="reject" onClick={()=>{
							setCurrentRow(row)
							setRejectVisable(true)
							setFieldsValue({"remark":""})
						}}>驳回</a>
				   ]:null
				  },
		],[],
	);
	return (
		<PageHeaderWrapper>
			<ProTable
				scroll={{ x: 'max-content' }}
				tableClassName="pro-table-padding"
				actionRef={actionRef}
				rowKey="id"
				beforeSearchSubmit={beforeSearchSubmit}
				pagination={{
					showSizeChanger: true,
				}}
				request={(params)=>getDistributionWithDrawPage(params)}
				columns={columns}
				toolBarRender={() => [
					<Button onClick={exportParams}>
						导出订单
					</Button>,
				]}
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
			<Modal width={800} destroyOnClose={true} title="" visible={evidenceVisible} width="30%" onOk={submit}
					onCancel={()=>{ setEvidenceVisible(false) }} maskClosable={false}>
					<div className={style.modelCon}>
						<Form name="basic" className={style.form_con} onFinish={handleApply} form={form}>	
							<div className={style.form_title}>确认要同意用户的提现申请吗?</div>
							<Form.Item name="imgUrl">
								<Upload beforeUpload={file => beforeUpload(file, 'banner')} name="file" showUploadList={false} listType="picture-card" style={{width:"auto"}}>		
									<div style={{ border: 'dashed 2px #eee', width: 100, height: 100}} className={style.img_con}>
										<div className={style.upStyle}>
											<PlusOutlined  className={style.plus}/>
										</div>
										{imgUrl ? <img src={imgUrl} style={{ width: 100, height: 100,}} /> : null}
									</div>
								</Upload>
								<div style={{color:"red",fontSize:"12px"}}>注：请选择JPEG、JPG、PNG格式图片</div>
							</Form.Item>
						</Form>
					</div>
				</Modal>
			<Modal width={600} destroyOnClose={true} title="" visible={rejectVisable} onOk={submit}
				onCancel={()=>{ setRejectVisable(false) }} maskClosable={false}>
					<div style={{fontSize:"16px",textAlign:"center",margin:"15px"}}>确认要驳回用户的提现申请吗？</div>
					<Form name="basic"  form={form}  onFinish={ handleReject }>	
						<Form.Item name="remark" label="" rules={[
							{ required: true,message: '请输入驳回原因' },
							{ max: 200,message: '最多输入200字' }
						]}>
							<TextArea rows={4} placeholder="请输入驳回原因（200字以内）"/>
						</Form.Item>
					</Form>
			</Modal>
			<a id="download-link" style={{display: 'none'}}>export</a>
		</PageHeaderWrapper>
	);
})

export default connect(
	({ global, order }) => ({
		ossToken: global.ossToken,
		orderList: order.orderList,
		serviceTypeContent: global.serviceTypeContent
	}),
	dispatch => ({
		async getDistributionWithDrawPage(params,type) {
			return dispatch({
				type: 'retail/getDistributionWithDrawPage',
				payload:{
					...params,
					type,
					queryType:1,
				}
			});
		},
		async exportDistributionWithDraw(payload) {
			return dispatch({
				type: 'retail/exportDistributionWithDraw',
				payload,
			});
		},
		async auditDistributionWithDraw(payload) {
			return dispatch({
				type: 'retail/auditDistributionWithDraw',
				payload,
			});
		},
		async getStsToken (){
			return dispatch({
				type: 'global/getStsToken',
			});
		}
		
	}),
)(UserInfo);
