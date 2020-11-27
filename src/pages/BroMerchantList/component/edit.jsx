/* eslint-disable no-param-reassign */
import { connect } from 'dva';
import React, { memo,useState, useEffect} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card,Form, Button,Input,Row,Col,Select, message} from 'antd';
import styled from 'styled-components';
import ProtableSelect from '@/utils/merchantSelect';


const {Option}=Select;
const {Item}=Form;
export default connect(
        ({merchant}) => ({
            typeList: merchant.typeList
        }),
    dispatch => ({
    	async getStsToken() { // 获取用于oss的token
    			return dispatch({
    				type: 'service/getStsToken'
    			})
    	},
    	async getMerchantId(id) {
           
            return dispatch({
                type: 'broMerchant/getMerchantId',
                id
            });
        },
        async postMerchantCreate(payload) {
           
            return dispatch({
                type: 'broMerchant/postMerchantCreate',
                data:payload
            });
        },
        async postMerchantUpdate(payload) {
           
            return dispatch({
                type: 'broMerchant/postMerchantUpdate',
                data:payload
            });
        },


    })
)(
    memo(props => {
        const { getMerchantId, postMerchantCreate, postMerchantUpdate, typeList } = props;
        const [ row, setRow] = useState({})
        const [ selectKey, setSelectKey] = useState([]);
        
        const { id } = props.location.query;
        // row是请求的数据

        const [ form ] = Form.useForm();
        const { setFieldsValue } = form;


        useEffect(() => {
        	if(id){
        		// 编辑
        		fetchComment();
        	}else{
        		// x新增
        		form.setFieldsValue({merchantTypeId:1})
        	}
        }, [id])

        const fetchComment = async () => {
            // const resList=await doGetsubList(id);
            // const ids=await resList.data.map((item)=>(item.id))
            // setSelectKey(resList.data.map((item)=>(item.id)))
            const Data = await getMerchantId(id);
            if (Data) {
                setRow(Data);
                setFieldsValue(Data);
            }
            
        }

        const beforeSubmit=()=>{
            return (selectKey.length!==0)
        }

        const onFinish=(value)=>{
            if(beforeSubmit()){
                value.subIds=selectKey;
                if(row.id){
                    postMerchantUpdate({...value,id:row.id})
                    .then((res)=>{
                        if(res){
                            message.success("编辑成功")
                            props.history.push('/merchantManage/bromerchant');
                        }
                    })
                }else{
                    postMerchantCreate({...value})
                    .then((res)=>{
                        if(res){
                            message.success("新增成功")
                            props.history.push('/merchantManage/bromerchant');
                        }
                    })
                }
            }else{
                message.warning("关联店铺不能为空")
            }
        }



    	// 上传之前

        const formItemLayout = {
          labelCol: { span: 12 },
          wrapperCol: { span: 14 },
        };
        	


        // subIds  关联店铺集合 ids

        return (
            <PageHeaderWrapper title={id ? "编辑连锁店铺" : "新增连锁店铺"}>
                <div>
                <Form
                    onFinish={onFinish}
                    form={form} {...formItemLayout}
                    initialValues={row}
                >
                <Card title="基本信息">
                    <Row>
                        <Col span="7">
                            <Item
    							label="连锁店铺名称"
    							name="name"
    							rules={[
    								{
    									required: true,
    									message: '必须填写店铺名称',
    									whitespace: true,
    								},

    							]}
    						>
    							<Input placeholder="请输入"  />
    						</Item>
                            <Item
    							label="连锁店铺类型"
    							name="merchantTypeId"

    							rules={[
    								{
    									required: true,
                                        message: '必须选择店铺类型',
    								},

    							]}
    						>
    							<Select	
    							    disabled={!!id}
    							>
                                    {
                                        typeList.map((item)=>{
                                            return (
                								<Option key={item.id} value={item.id}>{item.name}</Option>
                                            )
                                        })
                                    }
    							</Select>
    						</Item>
                        </Col>
                    </Row>
                </Card>
                <Card title="账户信息" >
        		    <Row>
    				 	<Col span="7" >
    						<Item
    							label="账号"
    							name="username"	
    							rules={[
    								{
    									required: true,
    									message: '店铺账号',
    									whitespace: true,
    								},
    								{
    									pattern:  /^[0-9a-zA-z]{0,15}$/,
    									message: '请输入正确的商户名称！',
    								},

    							]}
    						>
    							<Input placeholder="请输入" disabled={!!id} />
    						</Item>
    					</Col>
    					<Col span="7" >
    						<Item
    							label="登录密码"
    							name="userpwd"
    							rules={[
    								{
    									required: true,
    									message: '登录密码',
    									whitespace: true,
    								},
    									{
    									pattern:  /^[0-9a-zA-z]{0,15}$/,
    									message: '请输入正确的密码格式！',
    								},
    							]}
    						>
    							<Input.Password placeholder="请输入"  />
    						</Item>
    					</Col>
        			</Row>
        		</Card>
                <Card title="关联信息">

                   <ProtableSelect setRowKeys={setSelectKey} selectKey={selectKey} parentId={id} broList/>

                </Card>

                <WrapFormDiv>

                    <Form.Item >
                        <Button htmlType="submit" type="primary" className="lButton">确定</Button>
                        <Button onClick={()=>{props.history.goBack()}}>取消</Button>
                    </Form.Item>
                </WrapFormDiv>
                </Form>
                </div>
            </PageHeaderWrapper>
        );
    }),
);


const WrapFormDiv=styled.div`
	padding-top: 24px;
	padding-bottom: 1px;
	background:white;
	.ant-form-item-control-input-content{
		display:flex;
		justify-content:center;
	}
	.lButton{
		margin-right:20px;
	}
`;