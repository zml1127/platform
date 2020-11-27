
import React, {memo,useMemo, useEffect,useState} from 'react';
import { Switch,Button, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { PlusOutlined} from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import {spaceDisappear} from '@/utils/utils'
import {postUp,postDown,doGetserviceList} from '@/services/washService';
// import { queryRule, updateRule, addRule, removeRule } from './service';

export default (
	memo(props => {
	 	const [treeData,setTreeData]=useState();
		useEffect(()=>{
    		fetchComment();
  		},[])
  	async function fetchComment(){
    const res = await doGetserviceList();
    	if(res.code==="0000"){
	        setTreeData(spaceDisappear(res.data))
    	}
  	}
  const changeSwitch=(e,row)=>{
    console.log(e,row,"row");
    if(e){
        postUp(row.id).then((res)=>{
          if(res){
            fetchComment()
            if(res.code==="0000"){
              message.success("上线成功")
            }else{
              message.warning("上线失败")
            }
          }
        })
    
    }else{
        postDown(row.id).then((res)=>{
          if(res){
            fetchComment()
            if(res.code==="0000"){
              message.success("下线成功")
            }else{
              message.warning("下线失败")
            }
          }
        })
    }
  }



  const columns = useMemo(
    () => [
        {
            title: '服务类型',
            dataIndex: 'name',
            width:260,
            hideInSearch: true,
        },
         {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true,
            width: 140,
        },
        {
            title: '服务已关联店铺数量',
            dataIndex: 'merchantNum',
            hideInSearch: true,
            width: 180,
        },
       	{
			title: '上线状态',
			dataIndex: 'status',
			hideInSearch: true,
			width: 200,
			render: (_, row) => {
				return (
					<Switch
						size="large"
						loading={false}
						checkedChildren="在线"
						unCheckedChildren="下线"
						defaultChecked={_ === 1}
						onChange={e => changeSwitch(e, row)}
					/>
				);
			},
		},
       
        {
            title: '操作',
            dataIndex: 'id',
            valueType: 'options',
            hideInSearch: true,
            width: 200,
            render: (text,record) => {
               
                return (
                    <div style={{ display: 'flex', justfyContent: 'space-between' }}>
                     <a  key="查看" style={{ marginRight: '10px' }} 
                                onClick={() => {
									// merchantManage/merchant/edit
                  					props.history.push(`washService/list?id=${text}`);
                                  	sessionStorage.setItem("washTName",record.name)
                                }}
                                >
                            查看
                        </a>
                        {/* <a  key="删除" style={{ marginRight: '10px' }} 
                                onClick={() => {
									console.log("shanchu");
                                }}
                                >
                            删除
                        </a> */}
                       
                    </div>
                );
            },
        },
    
    ],
);
  return (
    <PageHeaderWrapper  extra={[
       
        <Button key="2">批量导入</Button>,
        <Button key="1">
          模板表下载
        </Button>,
      ]}>
        <ProTable
        //   request={getMerchantList}
          columns={columns}
          dataSource={treeData}
          rowKey="id"
          search={false}
        //    toolBarRender={() => [
                
        //         <Button
        //             icon={<PlusOutlined />}
        //             type="dashed"
        //             onClick={() => {
        //                 // merchantManage/merchant/edit
        //                 props.history.push(`merchant/edit`)
        //             }}
        //         >
        //             新增服务
        //         </Button>
        //     ]}
        />
    </PageHeaderWrapper>
  );
}));

