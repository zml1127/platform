import React, { useState, useRef } from 'react';
import { Space, Modal, Switch } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { doPostDel, doGetUStatus } from '@/services/activity';
import moment from 'moment';

const { confirm } = Modal;
const PlatformTable = (props) => {
  const { getPageForMerchant } = props;
  const onReq = (payload) => getPageForMerchant({ ...payload, type: 5 })
  const actionRef = useRef();
  const [photourl, setPhotoUrl] = useState()


  const showConfirm = (text) => {
    confirm({
      title: '你确定要删除本条目吗?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        doPostDel(text).then((res) => {
          console.log(res, "retexts");
          if (res.code === "0000") {
            actionRef.current.reload();
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const columns = [
    {
      title: '预览图',
      dataIndex: 'pic',
      key: 'imgsrc',
      render: (text) => {
        return (<div onDoubleClick={() => {
          const ul = text.split(",");
          const ulTemp = ul.map((item) => {
            return item;
          })
          setPhotoUrl(ulTemp)
        }}>
          <img src={text.split(",")[0]} style={{ width: "100px", height: "100px" }} alt="图片" />
        </div>)
      }
    },
    {
      title: '店铺名称',
      dataIndex: 'actMerchantGetAndPageForEntranceRsp',
      key: 'age',
      render: (text) => {
        return (<div>{text.name}</div>)
      }

    },
    {
      title: '所在区域',
      dataIndex: 'area',
      key: 'area',
      render:(_,record)=>{
      return(<div>{record.actMerchantGetAndPageForEntranceRsp?record.actMerchantGetAndPageForEntranceRsp.area:
      "-"}</div>)
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
        return <div>{item === 1 ? "开始长期" : moment(record.startTime).format("YYYY-MM-DD 00:00:00")}-
          {record.endLimitFlag === 1 ? "结束长期" : moment(record.endTime).format("YYYY-MM-DD 23:59:59")}</div>
      }
    },
    {
      title: '状态',
      dataIndex: "status",
      key: 'status',
      render: (status, record) => {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={status === 1}
        checked={!!record.status}
          onClick={() => {
          
            doGetUStatus(record.id).then((res)=>{
              if(res){
                
                actionRef.current.reload()
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
                  sessionStorage.setItem("MOAState","2")
                  sessionStorage.setItem("MOAState2","3")

                  props.history.push(`entrance/edit?type=edit&tabspane=5&id=${text}`)
                }}
              >编辑</span>
              <span style={{ color: "#008dff", cursor: "pointer" }}
                onClick={() => showConfirm(text)}
              >删除</span>
            </Space>
          </div>
        )
      }
    },
  ];
  return (
    <div>

      <ProTable
        request={onReq}
        columns={columns} pagination={false}
        // onChange={handleChange}
        search={false}
        actionRef={actionRef}
      />
      {photourl ?
        <Modal visible footer={null} width={500} onCancel={() => { setPhotoUrl() }}>
          {
            photourl.map((item, index) => (<img key={index} src={item} alt="图片" width={200} />))
          }


        </Modal> : null
      }
    </div>
  )
}
export default PlatformTable;