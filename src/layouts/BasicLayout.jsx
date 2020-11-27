/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, useIntl, connect, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getRouteAuthority, getRouteFromKey } from '@/utils/utils';
import logo from '../assets/logo.png';

import 'moment/locale/zh-cn';

const noMatch = (
	<Result
		status={403}
		title="403"
		subTitle="Sorry, you are not authorized to access this page."
		extra={
			<Button type="primary">
				<Link to="/user/login">Go Login</Link>
			</Button>
		}
	/>
);
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList) =>
	menuList.map((item) => {
		const localItem = {
			...item,
			children: item.children ? menuDataRender(item.children) : undefined,
		};
		return Authorized.check(item.authority, localItem, null);
	});

const defaultFooterDom = (
	<DefaultFooter
		copyright="2020"
		links={[
			{
				key: '尚客平台管理系统',
				title: '尚客平台管理系统',
				blankTarget: true,
			},
		]}
	/>
);

const BasicLayout = (props) => {
	const {
		dispatch,
		children,
		settings,
		location = {
			pathname: '/',
		},
		authorizeList,
		loading
	} = props;
	/**
	 * constructor
	 */

	useEffect(() => {
		

	}, []);
	/**
	 * init variables
	 */

	const handleMenuCollapse = (payload) => {
		if (dispatch) {
			dispatch({
				type: 'global/changeLayoutCollapsed',
				payload,
			});
		}
	}; // get children authority

	const authorized = getRouteAuthority(location.pathname || '/', props.route.routes);

	const {} = useIntl();
	return (
			<ProLayout
				logo={logo}
				siderWidth={256}
				onCollapse={handleMenuCollapse}
				onMenuHeaderClick={() => history.push('/')}
				menuItemRender={(menuItemProps, defaultDom) => {
					// console.log('menuItemProps', menuItemProps, defaultDom)
					if (menuItemProps.isUrl || !menuItemProps.path) {
						return defaultDom;
					}

					return <Link to={menuItemProps.path}>{defaultDom}</Link>;
				}}
				breadcrumbRender={(routers = []) => [
					...routers,
				]}
				itemRender={(route, params, routes, paths) => {
					const curd = getRouteFromKey(route.path, props.route.routes, 'curd')
					const curdD = getRouteFromKey(route.path, props.route.routes, 'curdD')
					const parentText = getRouteFromKey(route.path, props.route.routes, 'parentText')
					// console.log('route', route, params, routes, paths, history, curd)
					const first = routes.indexOf(route) === 0;
					const last = routes.indexOf(route) === routes.length-1;
					const curdType = history.location.query.type || 'add';
					const curdMap = {
						add: '新增',
						edit: '编辑',
						delete: '删除',
						seeE: '查看详情',
						look: '查看'
					}
					const curdContent = curd && last && !curdD ? curdMap[curdType] : ''
					return first || last ? (
						<span>{curdContent + route.breadcrumbName}</span>
					) : (
						<Link to={route.path}>{curdContent + route.breadcrumbName == " "?parentText:route.breadcrumbName}</Link>
					);
				}}
				// footerRender={() => defaultFooterDom}
				menuDataRender={menuDataRender}
				rightContentRender={() => <RightContent />}
				{...props}
				{...settings}
			>
				{
					!loading &&
					<Authorized authority={authorized} noMatch={noMatch}>
						{children}
					</Authorized>
				}
			</ProLayout>
	);
};

export default connect(({ global, settings, user }) => ({
	collapsed: global.collapsed,
	settings,
	authorizeList: user.currentUser.authorizeList
}))(BasicLayout);
