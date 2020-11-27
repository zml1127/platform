import React, { Component, useDispatch, useRef, createRef,  } from 'react'
import {
	message,
	Table,
	Row, Menu, Dropdown,
	Col, Breadcrumb, Tabs,
} from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import './index.less'

const { TabPane } = Tabs;

const DragHandle = sortableHandle(() => (
	<MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));

const columns = [
	{
		title: 'Sort',
		dataIndex: 'sort',
		width: 80,
		className: 'drag-visible',
		render: () => <DragHandle />,
	},
	{
		title: '油品号',
		dataIndex: 'oilName',
		className: 'drag-visible',
	},
	{
		title: '油枪号',
		dataIndex: 'gunNo',
	},
	{
		title: '官方指导价',
		dataIndex: 'guidePrice',
	},
	{
		title: '站内价格',
		dataIndex: 'price',
		hideInSearch: true,
		width: 100,
		ellipsis: true, // 是否自动缩略
	},
	{
		title: '定额优惠',
		dataIndex: 'discountFixed',
		render: (_, row)=>{
			return row.discountFixed ? row.discountFixed : '--'
		}
	},
	{
		title: '优惠折扣',
		dataIndex: 'discountPercent',
		render: (value, row) => {
			return (row.discountPercent&&row.discountPercent!==100) ? row.discountPercent+'折' : '--'
		},
	},
	{
		title: '优惠价格',
		dataIndex: 'privilegePrice',
		render: (_, row)=>{
			return row.privilegePrice ? row.privilegePrice : '--'
		}
	},
	{
		title: '状态',
		dataIndex: 'status',
		render: (value, row)=>{
			return row.status==1 ? '上架' : '下架'
		}
	},
	{
		title: '添加服务时间',
		dataIndex: 'createTime',
	},
];

const refuelNum = localStorage.getItem('refuelNum') //油品号
const oilId = localStorage.getItem('oilId') //油品号ID
const merchantId = localStorage.getItem('gasServiceMerchantId')

const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class gasSort extends Component {
	constructor(props){ 
		super(props) 
	}
	state = {
		dataSource: [],
	};	

	componentDidMount(){
		const { getCityList, getMerchantOilSorting } = this.props
		
		// console.log('this.props==', this.props)
		// 获取排序列表
		getMerchantOilSorting({ oilId: oilId, merchantId: merchantId }).then(res=>{
			// console.log('res==', res)
			this.setState({ dataSource: res })
		})
		// getCityList().then(res=>{
		// 	console.log('啦啦啦啦res==', res)
		// })
	}

	onSortEnd = ({ oldIndex, newIndex }) => {
		const { dataSource } = this.state;
		if (oldIndex !== newIndex) {
			const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
			console.log('Sorted items: ', newData);
			let newArr = []
			newData.map(v=>{
				newArr.push(v.id)
			})
			console.log('newArrrr', newArr)
			this.props.sorting({ ids: newArr }).then(res=>{
				// console.log('排序返回结果res==', res)
				if(res){ //排序成功，刷新列表
					this.props.getMerchantOilSorting({ oilId: oilId, merchantId: merchantId }).then(res=>{
						// console.log('res==', res)
						this.setState({ dataSource: res })
					})
				}
			})
			// console.log('newArr==', newArr)
			// this.setState({ dataSource: newData });
		}
	};

	DraggableBodyRow = ({ className, style, ...restProps }) => {
		const { dataSource } = this.state;
		// function findIndex base on Table rowKey props and should always be a right array index
		const id = dataSource.findIndex(x => x.id === restProps['data-row-key']);
		return <SortableItem index={id} {...restProps} />;
	};

	render() {
		const { dataSource } = this.state;
		const DraggableContainer = props => (
			<SortableContainer
				useDragHandle
				helperClass="row-dragging"
				onSortEnd={this.onSortEnd}
				{...props}
			/>
		);

		return (
			<PageHeaderWrapper title={this.props.location.query.merchantName}>
				<Tabs defaultActiveKey="1"
				// onChange={val=>{ console.log('val==', val) }}
				>
					<TabPane tab="油品" key="1">
						<Table
							pagination={false}
							dataSource={dataSource}
							columns={columns}
							rowKey="id"
							components={{
								body: {
									wrapper: DraggableContainer,
									row: this.DraggableBodyRow,
								},
							}}
						/>
					</TabPane>
					{/* <TabPane tab="洗美" key="2">
						啦啦啦222
					</TabPane> */}
				</Tabs>

			</PageHeaderWrapper>
		)
	}
}


// export default gasSort;
export default connect(
	({ gasService, global, }) => ({
		cityList: global.cityList, //省市区列表
	}),
	dispatch => ({
		async getCityList(payload) {
			return dispatch({
				type: 'global/getCityList',
				payload,
			});
		},
		// 获取排序列表
		async getMerchantOilSorting(payload) {
			return dispatch({
				type: 'gasService/getMerchantOilSorting',
				payload,
			});
		},
		// 排序 
		async sorting(payload) {
			return dispatch({
				type: 'gasService/sorting',
				payload,
			});
		},
	}),
)(gasSort);
