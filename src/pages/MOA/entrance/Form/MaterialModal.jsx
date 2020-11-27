/* eslint-disable consistent-return */
import React, { useState,useEffect,useCallback  } from 'react';
import styled from 'styled-components';
import {Modal,Button,Upload,Input} from 'antd';
import ProTable from '@ant-design/pro-table';
import { photoIsNoTwoMB } from '@/utils/utils';

import OSS from 'ali-oss';

const MaterialModal=props => {
const {setMaterState,getOpmaterialPage,materState,choosePhoto,form,ossToken,getStsToken}=props;
console.log(materState,"materState");
const beforeReq=(payload)=>getOpmaterialPage(payload,materState);
console.log(props,"xxyyzz")
const [p,sp]=useState();
const [ossTokencurrent, setossToken] = useState(ossToken);
// const 
const getStsTokenFn = useCallback(async () => {
  const res = await getStsToken();
  if (res) {
    console.log(res.data, "xxyyzz");
    setossToken(res.data)
  }
}

  , [ossTokencurrent])
useEffect(() => {
  getStsTokenFn();
}, []);
//
const getUrl = useCallback(async (file) => {


  if (ossTokencurrent && JSON.stringify(ossTokencurrent) !== "{}") {
    if (ossTokencurrent.expiration > Date.now()) { // 没有过期
      const client = new OSS({
        region: ossTokencurrent.region,
        accessKeyId: ossTokencurrent.accesKeyId,//
        accessKeySecret: ossTokencurrent.accesKeySecret,//
        stsToken: ossTokencurrent.securityToken, //
        bucket: ossTokencurrent.bucket, //
      })
        const rl = await client.put(`/ptd/MOAPic${Date.now()}`, file)
        if (rl) {
          console.log(rl, "r1r1r1r1");
          return rl.url.replace("http://sk-business.oss-cn-zhangjiakou.aliyuncs.com","http://sk-oss.shangkehy.com")
        }

    }
    else {
      getStsToken().then(res => {

        if (res.msg === "ok") {
          getUrl(file)
        }
      })
    }
  }
}, [ossTokencurrent])
//
const beforeUploadheadPic = useCallback(async file => {  // 上传文件之前的钩子
  if (photoIsNoTwoMB(file)) {
    const res = await getUrl(file)
    if (res) {

      form.setFieldsValue({ pic: res.replace("http://sk-oss.shangkehy.com","") })
      choosePhoto(res);
      setMaterState(0)
    }
  }
}, [ossTokencurrent])
const rowSelection = {
  type:"radio",
  checkStrictly:true,  // checkable 状态下节点选择完全受控（父子数据选中状态不再关联）
  // selectedRowKeys: choosedId, //默认选中项
  onChange: (selectedRowKeys, selectedRows) => {
    if (selectedRows[0]) {
      sp(selectedRows[0].imgUrl);
    } else {
      sp('')
    }
  }
};
const columns = [
    {
      title: '预览图',
      dataIndex: 'imgUrl',
      key: 'name',
      hideInSearch: true,
      render: (text,row) => [
        <div >

          <img src={`${row.imgUrl}`} key="img" style={{width:"120px",height:"120px"}}
          alt="图片"
          />
         </div>
      ]
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      renderFormItem: (_item, { value, onChange }) => (
        <Input style={{width:"100%"}} value={value} allowClear placeholder="ID/名称" onChange={onChange} />
      ),
    },
    {
      title: '规格',
      dataIndex: 'spec',
      key: 'spec',
      hideInSearch: true,
    },
  ];

return (


    <Modal visible footer={[<Button onClick={()=>{setMaterState(0)}}>取消</Button>,<Button onClick={()=>{
      const urlPhoto=`${p}`;
      // console.log(urlPhoto,"urlPhoto");
      choosePhoto(urlPhoto);
      form.setFieldsValue({"pic":`${p}`})
      setMaterState(0)
    }}>确定</Button>,<UploadCom customRequest={false} showUploadList={false}
      beforeUpload={beforeUploadheadPic}
    ><Button>直接上传</Button></UploadCom>]}
    
      closable={false}
    >
     
        <WrapProTable  columns={columns} 
          request={beforeReq}
          rowKey="id"
          pagination={{pageSize:10}}
          rowSelection={rowSelection}
          options={{fullScreen:false,reload:false,density:false,setting:false}}
        />
    </Modal>


);
}
export default MaterialModal;
const UploadCom=styled(Upload)`

  display:inline-block;

`;
const WrapProTable=styled(ProTable)`

  .ant-pro-table-toolbar{
    padding:0px;
    display:none;
  }
  .ant-pro-table-search .ant-form-item{
    min-width:200px;

  }
  .ant-row-start{
    width:70%;
  }
`;