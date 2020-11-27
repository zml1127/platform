const getUrl = () => {
	const { host } = window.location
	if ( host.includes('pre') ) {
		return 'http://api.pre.shangkehy.com/api'
	} if ( host.includes('plat.shangkehy.com') ) {
		return 'https://api.shangkehy.com/v2/api'
	}
    return 'http://api.pre.shangkehy.com/api'
} 

export default {
    // 先不用改 目前所有环境都走线上数据
	URL: getUrl()
};
