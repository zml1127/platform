import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import React from 'react';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';

const UserLayout = (props) => {
	const {
		route = {
			routes: [],
		},
	} = props;
	const { routes = [] } = route;
	const {
		children,
		location = {
			pathname: '',
		},
	} = props;
	const {} = useIntl();
	const { breadcrumb } = getMenuData(routes);
	const title = getPageTitle({
		pathname: location.pathname,
		breadcrumb,
		...props,
	});
	return (
		<HelmetProvider>
			<Helmet>
				<title>{title}</title>
				<meta name="description" content={title} />
			</Helmet>

			<div className={styles.container}>

				<div className={styles.content}>
					<div className={styles.top}>
						<div className={styles.header}>
							<Link to="/">
								<img alt="logo" className={styles.logo} src={logo} />
								<span className={styles.title}>尚客平台管理系统</span>
							</Link>
						</div>
						<div className={styles.desc}></div>
					</div>
					{children}
				</div>
				<DefaultFooter />
			</div>
		</HelmetProvider>
	);
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
