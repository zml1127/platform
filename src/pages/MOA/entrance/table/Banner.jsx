/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect,useRef } from 'react';
import { Space, Radio, Modal, Switch } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import ProTable from '@ant-design/pro-table';
import { doGetpageSort, doPostDel, doGetUStatus } from '@/services/activity';

import moment from 'moment';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));
const { confirm } = Modal;



const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

export const Banner = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [photourl, setPhotoUrl] = useState([])
  const { getEntranceListPlat,currentState } = props;

 const actionRef=useRef();

  const fetchData=()=>{
    getEntranceListPlat({ type: 1 }).then((res) => {
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
  }, [currentState])
  const onSortEnd = ({ oldIndex, newIndex }) => {

    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      // this.setState({ dataSource: newData });
      setDataSource(newData);
      const ids = newData.map((item) => (item.id))
      console.log("index", dataSource, ids);
      doGetpageSort({ ids, type: 1 }).then((res) => {
        console.log(res, "res");
      })

    }
  };

  const DraggableBodyRow = ({ className, style, ...restProps }) => {

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
            fetchData()
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
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      hideInSearch: true,
      render: () => <DragHandle />,
    },

    {
      title: '预览图',
      dataIndex: 'pic',
      className: 'drag-visible',
      hideInSearch: true,
      render: (text) => {
        return (
        <div onDoubleClick={() => {
          const ul=text.split(",");
          const ulTemp=ul.map((item)=>{
            return item;
          })
          setPhotoUrl(ulTemp)
            }
          }>
          <img src={text} style={{ width: "100px", height: "100px" }} alt="图片" />
        </div>)
      }
    },
    {
      title: '跳转形式',
      dataIndex: 'jumpType',
      key: 'jumpType',
      hideInSearch: true,
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
      hideInSearch: true,
      render:(text,row)=>{
          switch(row.jumpType){
            case 1:  // 满减券
            case 2: // 折扣券
            case 3: // 商品兑换券
              return(
                <div>
                  <div>URL:{row.url}</div>
                  <div>参数:{row.param||"-"}</div>
                </div>
              )
            case 4:
              return text.type === 1 ? text.detail : (text.type === 3 ? `--` : text.activityName)
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
      hideInSearch: true,
      render: (status, record) => {
        return <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={status === 1}
          onClick={() => {
            
            doGetUStatus(record.id).then((res)=>{
              if(res.code!=="0000"){
                fetchData();
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
      hideInSearch: true,
      render: (text) => {
        return (
          <div>
            <Space>
              <span style={{ color: "#008dff", cursor: "pointer" }}

                onClick={() => {
                  // 条  
               
                  props.history.push(`entrance/edit?type=edit&tabspane=1&id=${text}`)
                }}

              >编辑</span>
              <span style={{ color: "#008dff", cursor: "pointer" }}

                onClick={() => showConfirm(text)}

              >删除</span>
            </Space>
          </div>
        )
      }
    },[dataSource]
  ];
  const DraggableContainer = propsr => (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...propsr}
    />
  );

  return (
    <div style={{ background: "white", padding: "0 10px" }}>

      <Radio.Group>
        <Radio.Button>平台Banner</Radio.Button>
      </Radio.Group>
      <ProTable
        // pagination={{...pageInfo}}
        dataSource={dataSource}
        rowKey="key"
        columns={columns}
        actionRef={actionRef}
        
        // request={beforeReq}
        pagination={false}
        search={false}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
      {photourl.length !== 0 ?
        <Modal visible footer={null} width={500} onCancel={() => { setPhotoUrl([]) }}>
          {
            photourl.map((item, index) => (<img key={index} src={item} alt="图片" width={200} />))
          }


        </Modal> : null
      }
    </div>
  );

}