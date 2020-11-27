/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React,{useState,useEffect,useRef}from 'react';
import {Space,Modal,Switch} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {doGetpageForPay,doGetUStatus,doPostDel} from '@/services/activity';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';

const {confirm}=Modal;
const PlatformTable=(props)=>{
    const [dataObj,setDataObj]=useState({data:[]});
    const {currentState}=props;
    const actionRef=useRef();
    
    async function fetchComment(payload){
     
      doGetpageForPay({...payload,type:6})
            .then((res)=>{
                console.log(res,"res");
                if(res&&res.code==="0000"){
                  setDataObj(res)

                }
        })
        
    }

  useEffect(()=>{
        fetchComment();
  },[currentState])

     // 删除确认框
  const showConfirm = (text) => {
    confirm({
      title: '你确定要删除本条目吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        doPostDel(text).then((res) => {
          console.log(res, "retexts");
          if (res.code === "0000") {
            fetchComment();
            // actionRef.current.reload();
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const [sea,setSea]=useState();
  const beforeSearchSubmit=(search)=>{
    console.log(search,"search");
    setSea(search)
    fetchComment(search);
  } 
      const columns = [
        {
          title: '名称',
          dataIndex: 'bannerName',
          key: 'bannerName',
          hideInSearch:true,
          render:(text)=>{
            return <div>{text||"--"}</div>
            }
        },
        {
          title: '名称',
          dataIndex: 'searchName',
          key: 'searchName',
          hideInTable:true,
          render:(text)=>{
            return <div>{text||"--"}</div>
            }
        },
        {
          title: '参与条件',
          dataIndex: 'matchAmount',
          key: 'matchAmount',
          hideInSearch:true,
          render:(text)=>{
          return <div>{text===0?`不限制`:`支付订单满${text}元`}</div>
          }
        },
        {
            title: '活动内容',
            dataIndex: 'actActivityGetAndPageForEntranceRsp',
            key: 'activityName',
            hideInSearch:true,
            render:(text)=>{
            return<div>{text.activityName||"--"}</div>
            }
          },
          {
            title: '关联店铺数',
            dataIndex: 'relationMerchantNums',
            key: 'relationMerchantNums',
            hideInSearch:true,

          },
        {
            title: '有效期',
            dataIndex: 'startLimitFlag',
            key: 'startLimitFlag',
            hideInSearch:true,
            render:(item,record)=>{
            return <div>{item===1?"开始长期":moment(record.startTime).format("YYYY-MM-DD 00:00:00")}-
            {record.endLimitFlag===1?"结束长期":moment(record.endTime).format("YYYY-MM-DD 23:59:59")}</div>
            }
      
        },
        {
          title: '状态',
          dataIndex: "status",
          key: 'status',
          hideInSearch:true,
          render: (status, record) => {
            return <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={status === 1}
              onClick={(e) => {
                console.log(e, "eee");
                doGetUStatus(record.id).then((res)=>{
                  if(res.code!=="0000"){
                    fetchComment(sea)
                  }
                })
              }}
            />
          }
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'address',
            hideInSearch:true,
            render:(text)=>{
                return(
                    <div>
                        <Space>
                            <span style={{color:"#008dff",cursor:"pointer"}}
                                 onClick={()=>{
                                    props.history.push(`entrance/edit?type=edit&id=${text}&tabspane=6`)
                                }}
                            >编辑</span>
                            <span style={{color:"#008dff",cursor:"pointer"}}
                                
                                onClick={()=>showConfirm(text)}
                            >删除</span>
                        </Space>
                    </div>
                )
            }
        },
      ];
    return(
        <div style={{position:"relative"}}>

        <ProTable 
        dataSource={dataObj.data} 
        columns={columns} 
        pagination={false} 
          actionRef={actionRef}
         beforeSearchSubmit={beforeSearchSubmit}
          // search={false}
        />

        </div>
    )    
}
export default PlatformTable;