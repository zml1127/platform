/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import React,{useState,useEffect,useRef} from 'react';
import { Space, Modal,Switch} from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import {doGetpageForPop,doGetpageSort,doPostDel,doGetUStatus} from '@/services/activity';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));


const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);
const {confirm}=Modal;
export const FirstModal=(props)=>{

  // const { currentState } = props;
  const actionRef=useRef();
  const [dataSource,setDataSource]=useState([])
  const fetchData=(payload)=>{

    doGetpageForPop({...payload,type:4}).then((res)=>{
      console.log(res,"resqqwwee");
      if(res.code==="0000"){
        const dataCurrent=res.data.map((item,index)=>{
          item.key=index+1;
          return item;
        })
        setDataSource(dataCurrent);
        // this.setState({
        //   dataSource:dataCurrent
        // })
      }
    })
  }
  useEffect(()=>{
    fetchData();
  },[])


//   const [photourl,setPhoroUrl]=useState();
  const onSortEnd = ({ oldIndex, newIndex }) => {
    // const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      // this.setState({ dataSource: newData });
      setDataSource(newData);
      const ids=newData.map((item)=>(item.id))
      console.log("index",dataSource,ids);
      doGetpageSort({ids,type:4}).then((res)=>{
        console.log(res,"res");
      })
    
    }
  };
 
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.key === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

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
            // actionRef.current.reload();
            fetchData();
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
    const typeData=(key)=>{
      switch (key) {
        case 1:
          return '优惠券';
        case 2:
          return '异业劵';
        case 3:
          return '外部链接';
        default:
          break;
      }
    }
    const [sea,setSea]=useState();
    const beforeSearchSubmit=(search)=>{
      console.log(search,"search");
      setSea(search)
      fetchData(search);
    } 
    const columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      hideInSearch:true,

      render: () => <DragHandle />,
    },

    {
        title: 'ID',
        dataIndex: 'id',
        key: 'address',
        hideInSearch:true
    },
    {
        title: '名称',
        dataIndex: 'searchName',
        key: 'searchName',
        hideInTable:true
    },
    {
        title: '活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        hideInSearch:true,

        render:(_,record)=>{
          return (
          <div>{record.actActivityGetAndPageForEntranceRsp?record.actActivityGetAndPageForEntranceRsp.activityName:
            ""}</div>
          )
        }
    },
    {
        title: '活动内容',
        dataIndex: 'actActivityGetAndPageForEntranceRsp',
        key: 'actActivityContent',
        hideInSearch:true,

        render:(text)=>{
          return (
          <div>{text?typeData(text.type):""}</div>
          )
        }
    },
    {
        title: '明细',
        dataIndex: 'actActivityGetAndPageForEntranceRsp',
        key: 'detail',
        hideInSearch:true,

        render:(text)=>{
        return(<div>{text.detail?text.detail:"--"}</div>)
        }
    },
    {
        title: '库存',
        dataIndex: 'actActivityGetAndPageForEntranceRsp',
        key: 'stock',
        hideInSearch:true,

        render:(text)=>{
          return(<div>{text.stock?text.stock:"--"}</div>)
          }
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'address',
        hideInSearch:true,

        render: (status, record) => {
          return <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={status === 1}
            checked={!!record.status} 
            onClick={(e) => {
              console.log(e, "eee");
              doGetUStatus(record.id).then((res)=>{
                  if(res){
                    fetchData(sea);
                  }
              })
            }}
          />
        }
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
                                props.history.push(`entrance/edit?type=edit&id=${text}&tabspane=4`)
                            }}
                        >
                            编辑</span>
                        <span style={{color:"#008dff",cursor:"pointer"}}
                          
                        onClick={()=>{showConfirm(text)}}
                        >删除</span>
                    </Space>
                </div>
            )
        }
    },
  ];
    const DraggableContainer = propsx => (
      <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={onSortEnd}
        {...propsx}
      />
    );
    return (
        <div style={{background:"white",padding:"0 10px",position:"relative"}}>
       
       {/* <div style={{position:"absolute",right:"150px",top:"-58px"}}>
                <Input.Search placeholder="搜索名称"/>
            </div> */}
      <ProTable
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        actionRef={actionRef}
        rowKey="key"
        beforeSearchSubmit={beforeSearchSubmit}
        // search={false}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
       
         </div>
    );
  
}