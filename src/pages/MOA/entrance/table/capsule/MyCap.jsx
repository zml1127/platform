/* eslint-disable no-param-reassign */
import React,{useRef,useState,useEffect }from 'react';
import {Space,Modal,Switch} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import {doPostDel,doGetUStatus} from '@/services/activity';

import moment from 'moment';

const {confirm}=Modal;
const PlatformTable=(props)=>{
    const {getEntranceListPlat}=props;
    // const onReq=(payload)=>getEntranceListPlat({...payload,type:3})
    const actionRef=useRef();
    const [photourl, setPhotoUrl] = useState()

     // 删除确认框
  const showConfirm=(text)=>{
    confirm({
      title: '你确定要删除本条目吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        doPostDel(text).then((res)=>{
          console.log(res,"retexts");
          if(res.code==="0000"){
            actionRef.current.reload();
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const [dataSource, setDataSource] = useState([]);

  const fetchData=()=>{
    getEntranceListPlat({ type: 3 }).then((res) => {
      console.log(res, "resqqwwee");
      if (res) {
        const dataCurrent = res.data.map((item, index) => {
          item.key = index + 1;
          return item;
        })
        setDataSource(dataCurrent)
        // this.setState({
        //   dataSource:dataCurrent
        // })
      }
    })
  }
  useEffect(() => {
    fetchData()
  }, [])

  const columns = [
    {
      title: '预览图',
      dataIndex: 'pic',
      key: 'pic',
      render: (text) => {
        return (<div onDoubleClick={() => { 
          const ul=text.split(",");
          const ulTemp=ul.map((item)=>{
            return item;
          })
          setPhotoUrl(ulTemp)
         }}>
          <img src={text.split(",")[0]} style={{ width: "100px", height: "100px" }} alt="图片" />
        </div>)
      }
    },
    {
      title: '跳转形式',
      dataIndex: 'jumpType',
      key: 'jumpType',
      render: (text) => {
        switch (text) {
          case 1:

            return <div>指定页面</div>
          case 2:

            return <div>小程序</div>
          case 3:
            return <div>链接</div>
          case 4:
            return <div>活动</div>
          default:
            return <div>不跳转</div>
        }
      }
    },
    {
      title: '跳转内容',
      dataIndex: 'actActivityGetAndPageForEntranceRsp',
      key: 'actActivityGetAndPageForEntranceRsp',
      render:(text,row)=>{

          switch(row.jumpType){
            case 1:  // 满减券
            case 2: // 折扣券
            case 3: // 商品兑换券
              return(
                <div>
                  <div>URL:{row.url}</div>
                  <div>参数:{row.param}</div>
                </div>
              )
            case 4:
              return text.detail
            default:
              return '--'
          
        
        }
      }
    },
    {
      title: '有效期',
      dataIndex: 'startLimitFlag',
      key: 'startLimitFlag',
      hideInSearch: true,
      render: (item, record) => {
        return <div>{item === 1 ? "开始长期" :  moment(record.startTime).format("YYYY-MM-DD 00:00:00")}-
        {record.endLimitFlag === 1 ? "结束长期" :  moment(record.endTime).format("YYYY-MM-DD 23:59:59")}</div>
      }

    },
    {
      title: '状态',
      dataIndex: "status",
      key: 'status',
      render: (status, record) => {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={!!record.status}
          
          onChange={() => {
            doGetUStatus(record.id).then((res)=>{
             
                  //  fetchData()
                  if(res){

                    fetchData()
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
      render: (text) => {
        return (
          <div>
            <Space>
              <span style={{ color: "#008dff", cursor: "pointer" }}

                onClick={() => {
                  props.history.push(`entrance/edit?type=edit&tabspane=3&id=${text}`)
                }}

              >编辑</span>
              <span style={{ color: "#008dff", cursor: "pointer" }}


                onClick={() => showConfirm(text)}

              >删除</span>
            </Space>
          </div>
        )
      }
    },[fetchData]
  ];
    return(
        <div>
           
        <ProTable  
          // request={onReq}
          dataSource={dataSource}
          columns={columns} 
          pagination={false}
          search={false}
          actionRef={actionRef}
        />
        {photourl?
         <Modal visible footer={null} width={500} onCancel={()=>{setPhotoUrl()}}>
            {
                photourl.map((item,index)=>(<img key={index} src={item} alt="图片" width={200}/>))
            }
    
            
        </Modal>:null
    }
        </div>
    )    
}
export default PlatformTable;