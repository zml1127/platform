import { connect } from 'dva';
import React, { useCallback, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Statistic, Card, Row, Col, Form, Input, Button, Cascader, Empty, Tabs } from 'antd';
import Platform from './Platform';
import Merchant from './Merchant';
import _ from 'lodash';

const { TabPane } = Tabs;

const Dashhoard = props => {
	const { getDashboardWashData, dashboardWashData, position, errorMsg } = props;

	useEffect(() => {
		getDashboardWashData();
	}, []);

	const [form] = Form.useForm();

	const getInfo = () => {
		if (dashboardWashData && dashboardWashData.merChantInfo) {
			const { name, zname, dname, cname, pname } = dashboardWashData.merChantInfo[0];
			return name || zname || `${dname}-${cname}-${pname}`;
		}
		return '全部 ';
	};

	return (
		<PageHeaderWrapper>
			<Card>
				<Tabs >
					<TabPane tab="平台" key="1">
				      	<Platform />
				    </TabPane>
				    <TabPane tab="店铺" key="2">
				    	<Merchant />
				    </TabPane>
				</Tabs>
			</Card>
		</PageHeaderWrapper>
	);
};

export default connect(
	({ dashboard, global }) => ({
		dashboardWashData: dashboard.dashboardWashData,
		position: global.position,
		errorMsg: dashboard.errorMsg,
	}),
	dispatch => ({
		async getDashboardWashData(payload) {
			return dispatch({
				type: 'dashboard/getDashboardWashData',
				payload,
			});
		},
	}),
)(Dashhoard);
