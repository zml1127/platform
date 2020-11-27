/* eslint-disable default-case */
/* eslint-disable no-useless-concat */
/* eslint-disable eqeqeq */
/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
import { connect } from 'dva';
import React, { memo, useState,useEffect,useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Input, Select, Space, Button, Row, Col, DatePicker,
   Checkbox,InputNumber,message,Upload } from 'antd';
// import styled from 'styled-components';
// import RichEditorSk from '@/utils/RichEditorSk';
import { PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import {doPostActivityEdit,doGetByIdDetail} from '@/services/activity';
import moment from 'moment';
import { photoIsNoTwoMB,OssUrlPreFix } from '@/utils/utils';
import OSS from 'ali-oss';

import AcModalSet from './Form/AcModalSet';
// 活动弹框 
const { Option } = Select;
const { Item } = Form;
export default connect(
  () => ({}),
  dispatch=>({
    async getCouponActivityList(payload) {
      const params = { ...payload };
        return dispatch({
            type: 'activitylist/getCouponActivityList',
            payload: {
                ...params,
            },
        });
    }, 
    async getStsToken() { // 获取用于oss的token
			return dispatch({
				type: 'global/getStsToken'
			})
	  },
  
  })
)(
  memo(props => {
    const [form] = Form.useForm();
    const { ossToken,getCouponActivityList,getStsToken } = props;
    const [ossTokencurrent, setossToken] = useState(ossToken);
    const getStsTokenFn = useCallback(async () => {
      const res = await getStsToken();
      if (res) {
        setossToken(res.data)
      }
    }

    , [ossTokencurrent])
    useEffect(() => {
      getStsTokenFn();
    }, []);
    const {id}=props.location.query;
    const [active, setActive] = useState(1);

    const [acState, setAcState] = useState(false);
    //
    const [selectRow, setSelectRow] = useState([]);
    // 库存
    const [num,setNum]=useState(1);
    // 详情
   //
   const [imgUrlOnly, setImgUrlOnly] = useState(''); // 头图

   //
   const [startDis,setsDis]=useState(false)
   const [endDis,seteDis]=useState(false)
   //
   useEffect(()=>{
    const a=form.getFieldValue('startLimitFlag')
    setsDis(a===1||a===true)
},[form.getFieldValue('startLimitFlag')])
useEffect(()=>{
    const b=form.getFieldValue('endLimitFlag')
    seteDis(b===1||b===true)
},[form.getFieldValue('endLimitFlag')])

   const [clicked,setclicked]=useState(true);
   // 优惠券 显隐 编辑时
  const [conponT,setConponT]=useState(false)
   // 活动 选择 ID
   const [acSelectId,setacSelectId]=useState();// 活动设置的回显ID

    useEffect(()=>{
      fetchComment()
    },[])
    async function fetchComment(){
      
        if(!id){
            form.setFieldsValue({type:1})
        }else{
          const formatD="YYYY-MM-DD"
          const res=await doGetByIdDetail(id);
          if(res.code==="0000"){
            setActive(res.data.type);// 设置类型
            setImgUrlOnly(res.data.info)// 设置详情
            if(res.data.type===1){
              if(res.data.coupon){
                const idx=res.data.coupon.id;
                setacSelectId(idx)
              }
              setSelectRow([{...res.data.actActivityCouponMap,...res.data.coupon}]);
              form.setFieldsValue({...res.data,"startTime":null,
              "endTime":null})
              setConponT(res.data.activityStatus===1);
            }else{
              form.setFieldsValue({...res.data,
                "startTime":res.data.startTime ? moment(res.data.startTime) : null,
                "endTime":res.data.endTime ? moment(res.data.endTime) : null
              })
              
            }
          }
        }
    }
    const beforeVaild=(vaildValue)=>{
       if(Number(vaildValue.startLimitFlag)!==1&&Number(vaildValue.endLimitFlag)!==1){

         if(vaildValue.endTime&&vaildValue.startTime){
           const s=moment(vaildValue.startTime).valueOf();
           const e=moment(vaildValue.endTime).valueOf();
           
           if(s>=e){
             message.warning("有效期开始时间应小于有效期结束时间");
             return false
            }
            return true;
          }
        }
        switch (vaildValue.type) {
          case 1:
            if(selectRow.length===0){
              message.warning("请点击添加活动按钮,添加活动")
              return false
            }
            return true
         
          default:
            return true
        }
    }

    const beforeSubmit=(tempObj)=>{
      const result={...tempObj};
      const  headPicTemp=result.info||imgUrlOnly
	    
      switch (tempObj.type) {
        case 1:
          const ids=selectRow.map((item)=>(item.id))[0]
          // result.couponId=ids;
          return {...result,num,couponId:ids,info:headPicTemp.replace(OssUrlPreFix, "")};
        case 2:
        case 3:
          if(result.startLimitFlag){
            delete result.startTime
            result.startLimitFlag=1
        }else{
            delete result.startLimitFlag
            result.startTime=moment(result.startTime).format("YYYY-MM-DD 00:00:00")
        }

        if(result.endLimitFlag){
            delete result.endTime
            result.endLimitFlag=1
          }else{
            delete result.endLimitFlag
            result.endTime=moment(result.endTime).format("YYYY-MM-DD 23:59:59")
            // .format("YYYY-MM-DD HH:mm:SS")
            
          }
          return {...result,info:headPicTemp.replace(OssUrlPreFix, "")};
        default:
          break;
      }
    }
    const onFinish=(value)=>{
      if(beforeVaild(value)){
          const r=beforeSubmit({...value})
          const param=id?{...r,id}:r;// 有ID 传 id
          doPostActivityEdit(param).then((res)=>{

            if(res.code==="0000"){
              
              props.history.goBack();
              message.success(`${id?"编辑":"新建"}成功`);
            }else{
              message.warn("操作失败");
            }

          })
      }
    }
    const handleOption = (key) => {
      switch (key) {
        case 1:
          const columns = [
            {
              title: 'ID',
              dataIndex: 'id',
              key: 'id',
              hideInSearch:true
            },
            {
              title: '优惠券名称',
              dataIndex: 'name',
              key: 'name',
              hideInSearch:true
            },
            {
              title: '优惠券类型',
              dataIndex: 'couponType',
              key: 'couponType',
              hideInSearch:true,
              render:(coupontype)=>{
                  switch (coupontype) {
                    case 1:
                      
                      return <div>满减券</div>
                    case 2:
                      
                      return <div>折扣券</div>
                    case 3:
                      
                      return <div>商品兑换券</div>
                  
                    default:
                      break;
                  }
              }
            },
            {
              title:"优惠券内容",
              dataIndex:"goodsName",
              key:"goodsName",
              hideInSearch:true,
              render: (value, row) => {
                let str = '--'
                switch (row.couponType){
                  case 1:  // 满减券
                    if(row.useCondition==0){ // 无门槛
                      str = `${'无门槛'+'减'}${row.faceValue}元`
                    }else{
                      str = `满${row.matchAmount}减${row.faceValue}元`
                    }
                    break;
                  case 2: // 折扣券
                  if(row.useCondition==0){ // 无门槛
                    str = `${'无门槛'+'打'}${row.faceValue}折`
                  }else{
                    str = `满${row.matchAmount}打${row.faceValue}折`
                  }
                    break;
                  case 3: // 商品兑换券
                    str = row.goodsName
                  break;  
                }
                return str
              },
            },
            {
              title:"库存",
              dataIndex:"totalNum",
              key:"totalNum",
              hideInSearch:true,
              render:(text,row)=>{
                const update=text===-1?"无限":text-row.receiveNum;
                const edit=row.maxNum;
                const totalNum=(id&&clicked)?edit:update;
                const editInitNum=Number(row.remainNumStr);// 编辑时候初始化的值
                const updataInitNum=row.num; // 每次点击之后的值
                const currentNum=(id&&clicked)?editInitNum:updataInitNum;
                
                return (
                <div  onClick={(e)=>{e.stopPropagation()}}><InputNumber defaultValue={currentNum} min={1} max={totalNum==="无限"?99999999:totalNum}
                onClick={(e)=>{e.stopPropagation();
                }}
                  onChange={(e)=>{
                   
                    setNum(e)
                    return false;
                  }}
                  disabled={(!!id)&&conponT}
                />
                  {`/${totalNum}`}</div>
                )
              }
            },
           
 
          ];
          return (
            <div>
              <Row>
                <Col span="20" offset={2}>
                  {Array.from(selectRow).length !== 0 &&
                    <div onClick={(e)=>{
                      if(!conponT){

                        setAcState(true)}} 
                      }
                      >
                    <ProTable 
                    
                    columns={columns} dataSource={selectRow}  pagination={false}
                    search={false}
                    options={{fullScreen:false,reload:false,density:false,setting:false,search:false}}
                    /></div>
                  }

                </Col>


              </Row>

            </div>
          )
        case 2:
          return(
            <div className="fairyDragon">
            <Row >
              <Col span={8} >

                <Item label="有效期" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} name="startTime">
                  <DatePicker placeholder="请输入开始时间" format="YYYY-MM-DD 00:00:00" disabled={startDis}/>
                </Item>
              </Col>
              <div style={{ "line-height": "32px" }}>
                <Item name="startLimitFlag" wrapperCol={{ span: 24 }}
                  valuePropName="checked"
                >
               
                  <Checkbox onChange={(e)=>{setsDis(e.target.checked)}} value={1}>不限</Checkbox>
                  
                </Item>
              </div>
            </Row>
            <Row>
              <Col span={8} >
                <Item name="endTime" wrapperCol={{ span: 12, offset: 6 }}>
                  <DatePicker placeholder="请输入结束时间" format="YYYY-MM-DD 23:59:59" disabled={endDis}/>
                </Item>
              </Col>
              <div style={{ "line-height": "32px" }} >
                <Item name="endLimitFlag" wrapperCol={{ span: 24 }}
                  valuePropName="checked"
                >
                  <Checkbox onChange={(e)=>{seteDis(e.target.checked)}} value={1}>不限</Checkbox>
                </Item>
              </div>
            </Row>
          </div>
          )
        case 3:
          return (
            <div>
               <div className="fairyDragon">
                <Row >
                  <Col span={8} >

                    <Item label="有效期" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} name="startTime">
                      <DatePicker placeholder="请输入开始时间" format="YYYY-MM-DD 00:00:00" disabled={startDis}/>
                    </Item>
                  </Col>
                  <div style={{ "line-height": "32px" }}>
                    <Item name="startLimitFlag" wrapperCol={{ span: 24 }} 
                       valuePropName="checked"
                    >
                      <Checkbox onChange={(e)=>setsDis(e.target.checked)} value={1}>不限</Checkbox>
                    </Item>
                  </div>
                </Row>
                <Row>
                  <Col span={8} >
                    <Item name="endTime" wrapperCol={{ span: 12, offset: 6 }}>
                      <DatePicker placeholder="请输入结束时间" format="YYYY-MM-DD 23:59:59" disabled={endDis}/>
                    </Item>
                  </Col>
                  <div style={{ "line-height": "32px" }} >
                    <Item name="endLimitFlag" wrapperCol={{ span: 24 }}
                       valuePropName="checked"
                    >
                      <Checkbox onChange={(e)=>seteDis(e.target.checked)} value={1}>不限</Checkbox>
                    </Item>
                  </div>
                </Row>
              </div>
              <Form.Item name="url" label="URL"
                rules={[{
                  required:true,
                  message:"请添加URL"
                },{
                  pattern:/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
                  message:"请输入正确的URL"
                }
              ]}
              >
                <Input />
              </Form.Item>
            </div>
          )

        default:
          break;
      }
    }
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 4 },
    };
 
    const getUrl = useCallback(async (file,type) => {
      if (ossTokencurrent && JSON.stringify(ossTokencurrent) !== "{}") {
          if (ossTokencurrent.expiration > Date.now()) { // 没有过期
              const client = new OSS({
                  region: ossTokencurrent.region,
                  accessKeyId: ossTokencurrent.accesKeyId,//
                  accessKeySecret: ossTokencurrent.accesKeySecret,//
                  stsToken: ossTokencurrent.securityToken, //
                  bucket: ossTokencurrent.bucket, //
              })
                  const rl = await client.put(`/ptd/merchantImgShow${Date.now()}`, file);
                  if (rl) {
                    return rl.url.replace("http://sk-business.oss-cn-zhangjiakou.aliyuncs.com","http://sk-oss.shangkehy.com")
                  }
          }
          else {
              getStsToken().then(res => {
                  if (res.msg === "ok") {
                      getUrl(file,type)
                  }
              })
          }
      }
  }, [ossTokencurrent])
    const beforeUploadthumb = useCallback(
      async file => {
          // 上传文件之前的钩子
          if (photoIsNoTwoMB(file)) {
              const res = await getUrl(file, 'info');
              // return resData
              form.setFieldsValue({ info:res});
              setImgUrlOnly(res);
          }
      },
      [ossTokencurrent, imgUrlOnly, form.getFieldValue('info')],
  );
  
    return (
      <PageHeaderWrapper  title={id ? "编辑活动设置" : "新建活动设置"}>
        <div style={{ background: 'white' }}>

          <Form form={form} {...formItemLayout} onFinish={onFinish}>
            <Form.Item name="activityName" label="活动名称">
              <Input />
            </Form.Item>
            <Form.Item name="type" label="活动内容"
              rules={[{
                required:true,
                message:"请选择活动内容"
              }]}
            >
              <Select 
                onChange={(value) => { setActive(value);
                  
                }}
                disabled={(!!id)&&conponT}
              >
                <Option value={1} key="1">优惠券</Option>
                <Option value={2} key="2">异业劵</Option>
                <Option value={3} key="3">外部链接</Option>
              </Select>
            </Form.Item>
            {
              Array.from(selectRow).length === 0 &&active===1&&
              <Form.Item name="add" label="添加活动">
                <Button onClick={() => { setAcState(true);}}>
                  <PlusOutlined />点击配置
                </Button>
              </Form.Item>
            }
            {handleOption(active)}
            <Item
              label="详情"
              name="info"
              // rules={[
              //   {
              //     required: true,
              //   },
              // ]}
              wrapperCol={{span:20}}
            >

              {/* <RichEditorSk setFieldsValue={setFieldsValue} 
                 disabled={(!!id)&&conponT}
                infoData={currentInfo}
                form={form}
                ossTokencurrent={ossTokencurrent} /> */}

            <div>
								<Upload
									beforeUpload={beforeUploadthumb}
									name="file"
									showUploadList={false}
									customRequest={() => false}
								>
									{imgUrlOnly ? (
										<img
											src={imgUrlOnly}
											alt="avatar"
											style={{ width: '150px', height: '150px' }}
										/>
									) : (
										<div
                      style={{
                        width: '150px',
                        height: '150px',
                        border: '1px dashed rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        lineHeight: '150px',
                        background:'rgb(250,250,250)'
                      }}
										>
											<PlusOutlined style={{ fontSize: '36px' }} />
											{/* <div className="ant-upload-text">点击上传</div> */}
										</div>
									)}
								</Upload>
							</div>
            </Item>
         
            

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Space>

                <Button type="primary" htmlType="submit" key="sub">提交</Button>
                <Button onClick={() => { props.history.goBack() }} key="cancel">取消</Button>
              </Space>
            </div>
          </Form>
          
              <AcModalSet setAcState={setAcState} acState={acState} width={888} setSelectRow={setSelectRow} 
              acSelectId={acSelectId} setacSelectId={setacSelectId}
              getCouponActivityList={getCouponActivityList} setclicked={setclicked}/>
          
        </div>
      </PageHeaderWrapper>
    )
  })
);
