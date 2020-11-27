import { connect } from 'dva';
import React, { useRef, useCallback, useMemo, memo,useEffect,useState} from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {SearchOutlined,PlusOutlined} from '@ant-design/icons';
import {
	Button,
	Tabs,
	Popconfirm,
	Typography,
	message,
	Cascader
} from 'antd';
import { history } from 'umi';
import style from './index.less';
const { TabPane } = Tabs;
const { Text } = Typography;
import LeaderList from './leaderList'
import ApplyList from './applyList'

const UserInfo = memo(props => {
	const {
		deleteOpmaterial,
		cityList
	} = props;
	const [type,SetType] = useState(1)
	const actionRef = useRef();

	const tabArr =[
		{
			key:1,
			value:"团长列表"
		},
		{
			key:2,
			value:"申请列表"
		}
	]

    useEffect(()=>{
	
	},[])
	return (
			<PageHeaderWrapper>
				<div className={style.team_leader}>
					<Tabs defaultActiveKey={String(type)} size="large" style={{width:"100%"}}  onChange={val=>{
						SetType(val)
					}}>
						{
							tabArr.map((item)=>{
								return (<TabPane tab={item.value} key={item.key}></TabPane>)
							})
						}
					</Tabs>
				</div>
				{
					type == 1 ?<LeaderList></LeaderList>:<ApplyList></ApplyList>
				}
			</PageHeaderWrapper>
		);
	})

export default connect(
	({ global, order }) => ({
		
	}),
	dispatch => ({
		
	}),
)(UserInfo);
