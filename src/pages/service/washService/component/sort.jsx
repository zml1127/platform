/* eslint-disable no-param-reassign */
import React from 'react';
import { Table,Radio } from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import {doGetMerchantId,doGetSorting,doGetTag} from '@/services/washService';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const columns = [
  {
    title: 'Sort',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
  },
  {
    title: '服务名称',
    dataIndex: 'name',
    className: 'drag-visible',
  },
  {
    title: '服务类型',
    dataIndex: 'serviceCateName',
  },
  {
    title: '原价',
    dataIndex: 'oriPrice',
  },
  {
    title: '优惠价格',
    dataIndex: 'price',
  },
  {
    title: '生成订单数',
    dataIndex: 'saleCnt',
  },
  {
    title: '关联优惠',
    dataIndex: 'preferential',
  },
  {
    title: '添加服务时间',
    dataIndex: 'createTime',
    
  },
];


const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class SortableTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      mode: '1',
      tagsService:[]
    };
  }

  

  componentDidMount(){
    const {id}=this.props.location.query;
    doGetTag({merchantId:id}).then((res)=>{
      console.log(res,"res");
      if(res.code==='0000'){
        this.setState({
          tagsService:res.data,
          mode:res.data[0].id,
        },()=>{
          console.log(111);
          this.onReq(res.data[0].id);
        })
      }
    })
  }

  
  onReq=(serviceCate2Id)=>{
    const {id}=this.props.location.query;
    doGetMerchantId({merchantId:id,serviceCate2Id}).then((res)=>{
      console.log(res,"res");
      if(res.code==="0000"){
        const dataTemp=res.data.map((item,index)=>{
          item.key=index+1;
          return item;
        })
        this.setState({
          dataSource:dataTemp
        })
      }
    })
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { dataSource } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      this.setState({ dataSource: newData });
      const ids=newData.map((item)=>(item.id))
      console.log("index",dataSource,ids);
      doGetSorting(ids).then((res)=>{
        console.log(res,"res");
      })
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { dataSource } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(x => x.key === restProps['data-row-key']);
  
    return <SortableItem index={index} {...restProps} />;
  };

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode },()=>{
      this.onReq(mode)
    });
    
  };

  render() {
    const { dataSource,mode,tagsService } = this.state;
    const DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );
    return (
        <PageHeaderWrapper>
                <Radio.Group onChange={this.handleModeChange} value={mode} style={{ marginBottom: 8 }}>
                    {
                      tagsService.map((item)=>{
                        return  <Radio.Button value={item.id}>{item.name}</Radio.Button>
                      })
                    }
                </Radio.Group>
                <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="key"
                    components={{
                    body: {
                        wrapper: DraggableContainer,
                        row: this.DraggableBodyRow,
                    },
                    }}
                />
      </PageHeaderWrapper>
    );
  }
}
export default SortableTable;