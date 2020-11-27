import React, { useState,useEffect  } from 'react';
import styled from 'styled-components';
import {Modal,Select, Radio,Row,Col,Divider,message} from 'antd';
import ProTable from '@ant-design/pro-table';

const {Option}=Select;
const AcModalSet=props => {
const {setAcState,width="auto",setSelectRow,postActivityPage,acSelectId,
setacSelectId
}=props;
const [currentRow,setcurrentRow]=useState([]);
const [currentKey,setcurrentKey]=useState([])
useEffect(()=>{
  if(acSelectId){
    setcurrentKey([acSelectId]);
  }
},[acSelectId])
console.log(props,"xxyyzz")
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'ID',
    hideInSearch:true,
  },
  {
    title: '活动名称',
    dataIndex: 'activityName',
    key: 'activityName',
  },
  {
    title: '活动内容',
    dataIndex: 'typeName',
    key: 'typeName',
    hideInSearch:true,
  },
  {
      title: '明细',
      dataIndex: 'detail',
      key: 'address',
    hideInSearch:true,

    },
  {
      title: '库存',
      dataIndex: 'maxNum',
      key: 'totalNum',
      hideInSearch:true,
      render:(item,record)=>{
      return <div>{record.remainNum}/{item}</div>
      }

  },
  {
      title: '有效期',
      dataIndex: 'startLimitFlag',
      key: 'startLimitFlag',
      hideInSearch:true,
      render:(item,record)=>{
      return <div>{item===1?"开始长期":record.startTime}-
      {record.endLimitFlag===1?"结束长期":record.endTime}</div>
      }

  },
  {
      title: '状态',
      dataIndex: 'activityStatus',
      key: 'activityStatus',
      hideInSearch:true,
      renderFormItem: (_item, { value, onChange }) => (
          <Select defaultValue={value} onChange={onChange}>
              <Option value={1} key="1">
                  进行中
              </Option>
              <Option value={2} key="2">
                  未开始
              </Option>
              <Option value={0} key="3">
                  已失效
              </Option>
          </Select>
      ),
      render:(text)=>{
          switch (text) {
              case 1:
                  
                  return <div>进行中</div>
              case 2:
                  return <div>未开始</div>
              case 0:
                  return <div>已失效</div>
              default:
                  return <div>--</div>
          }
      }
  },
  ];



const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    setcurrentRow(selectedRows)
    setcurrentKey(selectedRowKeys)
    
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
return (


    <Modal visible 
      onCancel={()=>{setAcState(false)}}
      closable={false}
      width={width}
      onOk={()=>{
        if(currentKey.length!==0){
          setSelectRow(currentRow)
          setAcState(false)
        }else{
          message.warning("请选择一个活动")
        }
        const ids=currentRow.map((item)=>(item.id))
        console.log(ids,"currentRow");
        if(ids[0]){

          setacSelectId(ids[0]);
        }
       
      }}
    >
     <Row>
      <Col span="3">
        <Radio.Group>
           <Radio.Button>
             平台活动
           </Radio.Button>
        </Radio.Group>
      </Col>
      <Divider type="vertical" style={{height:"50vh"}}/>
      <Col span="20" >
        <Wraph4>

        <b>选择活动</b>
        <Divider/>
        </Wraph4>

        <Wdiv>
        <Radio.Group>
           <Radio.Button>
             活动设置
           </Radio.Button>
        </Radio.Group>
        <WrapProTable 
        request={postActivityPage}
        pagination={{pageSize:10}}
        // dataSource={dataSource} 
        columns={columns} 
        rowKey="id"
        rowSelection={{...rowSelection,type:"radio",selectedRowKeys:currentKey}}

        options={{fullScreen:false,reload:false,density:false,setting:false,search:false}}
        />
        </Wdiv>
        </Col>
      </Row>
    </Modal>


);
}
export default AcModalSet;

const WrapProTable=styled(ProTable)`
  .ant-pro-table-search{
    padding:0;
    margin:0;

  }
  .ant-pro-table-toolbar{
    padding:0px;
    display:none;
  }
  .ant-pro-table-search .ant-col>.ant-form-item{
    .ant-form-item-control-input{
      position:absolute;
    min-width:180px;
    }
  }
  .ant-pro-table-search .ant-form-item{
    /* width:100px; */
    padding:0;
    margin:0;
  .ant-input-affix-wrapper{
    padding:4px;
  }
  }
  .ant-row-start{
    width:70%;
    padding-left:36%;
  }
  .ant-card-body .ant-pro-table-toolbar{
    padding:0px;
    display:none !important;
  }
`;

const Wraph4=styled.h4`

.ant-divider-horizontal{
  margin:10px 0;
}
`;

const Wdiv=styled.div`
  .ant-radio-group{
    position: absolute;
    line-height: 54px;
    height: 60px;
  }

`;