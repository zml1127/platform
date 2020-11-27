/* eslint-disable consistent-return */
/* eslint-disable default-case */
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { message,Select } from 'antd';
import moment from 'moment';
import { doGetExChangeList } from '@/pages/market/coupon/service.js';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
// export const isAntDesignPro = () => {
//   if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
//     return true;
//   }

//   return window.location.hostname === 'preview.pro.ant.design';
// }; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

// export const isAntDesignProOrDev = () => {
//   const { NODE_ENV } = process.env;

//   if (NODE_ENV === 'development') {
//     return true;
//   }

//   return isAntDesignPro();
// };
const {Option}=Select;
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

// 获取当前route全部数据
export const getAuthorityFromRouter = (router = [], pathname) => {
	const authority = router.find(
		({ routes, path = '/', target = '_self' }) =>
			(path && target !== '_blank' && pathRegexp(path).exec(pathname)) ||
			(routes && getAuthorityFromRouter(routes, pathname)),
	);
	if (authority) return authority;
	return undefined;
};

// 获取当前route 的authority字段
export const getRouteAuthority = (path, routeData) => {
	let authorities;
	routeData.forEach(route => {
		// match prefix
		if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
			if (route.authority) {
				authorities = route.authority;
			} // exact match

			if (route.path === path) {
				authorities = route.authority || authorities;
			} // get children authority recursively

			if (route.routes) {
				authorities = getRouteAuthority(path, route.routes) || authorities;
			}
		}
	});
	return authorities;
};

export const getRouteFromKey = (path, routeData, key) => {
	let value;
	routeData.forEach(route => {
		// match prefix
		if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
			if (route[key]) {
				value = route[key];
			} // exact match

			if (route.path === path) {
				value = route[key] || value;
			} // get children authority recursively

			if (route.routes) {
				value = getRouteFromKey(path, route.routes, key) || value;
			}
		}
	});
	return value;
};
export const getAddressByPid=(position,{a,b,c})=>{
	const provinceIdData=position.filter(item=>(item.id===a));
	if(provinceIdData.length!==0){

		const  cityIdData=provinceIdData[0].children&&provinceIdData[0].children.filter(item=>(item.id===b))
		const  districtIdData=cityIdData&&cityIdData[0].children&&cityIdData[0].children.filter(item=>(item.id===c))
		const  addressName=(provinceIdData[0].name)+(cityIdData&&cityIdData[0].name)+(districtIdData&&districtIdData[0].name);

		return addressName;
	}
	
}
export const regionalConversion = target => {
	const searchValueTemp = {}
	if (target[0]) {
		// eslint-disable-next-line prefer-destructuring
		searchValueTemp.provinceId = Number(target[0]);
		if (target[1]) {
			// eslint-disable-next-line prefer-destructuring
			searchValueTemp.cityId = Number(target[1]);
			if (target[2]) {
				// eslint-disable-next-line prefer-destructuring
				searchValueTemp.districtId = Number(target[2]);
			}
		}
	}
	return searchValueTemp;
}
// 判断图片是否小于2MB
export const photoIsNoTwoMB = file => {
	const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
	const isLt2M = file.size / 1024 / 1024 < 2;
	if (!isJpgOrPng) {
		message.error('You can only upload JPG/PNG file!');
	}
	if (!isLt2M) {
		message.error('Image must smaller than 2MB!');
	}
	return isJpgOrPng && isLt2M;
}

// 下载模板表
export const downloadCsv = (linkId, header, content, fileName) => {
	if (!linkId || !header || !content) {
		// console.log("downloadCsv 参数 error");
		return false;
	}

	const downloadLink = document.getElementById(linkId);
	let context = `${header.join(',')}\n`;
	for (let i = 0; i < content.length; i++) {
		const item = content[i];
		item.forEach((item, index, list) => {
			context = `${context + item},`;
		});
		context += '\n';
	}

	// console.log('---------------拼接的字符串---------------\n' + context)
	// let context = "col1," + "反反\r复复" + ",col3\nvalue1,value2,value3"
	context = encodeURIComponent(context);
	downloadLink.download = `${fileName}.csv`; // 下载的文件名称
	downloadLink.href = `data:text/csv;charset=utf-8,\ufeff${context}`; // 加上 \ufeff BOM 头
	downloadLink.addEventListener(
		'click',
		function (e) {
			e.stopPropagation();
		},
		false,
	); // 阻止冒泡事件
	downloadLink.click();
};

// 复制文本 value：要复制的内容，msg：复制成功的提示信息
export const copyValue = (value, msg = "复制成功") => {
	const el = document.createElement('textarea');
	el.value = value;
	el.setAttribute('readonly', '');
	el.style.contain = 'strict';
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	el.style.fontSize = '12pt';
	const selection = getSelection();
	let originalRange = false;
	if (selection.rangeCount > 0) {
		originalRange = selection.getRangeAt(0);
	}
	document.body.appendChild(el);
	el.select();
	let success = false;
	try {
		success = document.execCommand('copy');
		message.success(msg)
	} catch (err) {

	};
	document.body.removeChild(el);
	if (originalRange) {
		selection.removeAllRanges();
		selection.addRange(originalRange);
	}
	return success;
}

// 下载图片  url:图片链接   filename:图片名字
export const downloadImg = (url, filename) => {
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')

	const aLink = document.createElement('a')
	aLink.download = filename
	aLink.style.display = 'none'
	const img = new Image;
	// 设置跨域
	img.setAttribute('crossOrigin', 'anonymous')
	img.src = url
	img.onload = function () {
		canvas.width = img.width
		canvas.height = img.height
		context.drawImage(img, 0, 0);
		aLink.href = canvas.toDataURL('image/jpeg')
		// 触发点击
		document.body.appendChild(aLink)
		aLink.click();
		// 然后移除
		document.body.removeChild(aLink)
	}
}

export const mobileReg = /^1[0-9]{10}$/;

export const OssUrlPreFix = /(http|https):\/\/sk-oss.shangkehy.com/;
export const activityContent = async (row) => {
	let str = '--'
	switch (row.couponType) {
		case 1:  // 满减券
			if (row.useCondition === 0) { // 无门槛
				str = `优惠券-满减券-${'无门槛' + '减'}${row.faceValue}元`
			} else {
				str = `优惠券-满减券-满${row.matchAmount}减${row.faceValue}元`
			}
			break;
		case 2: // 折扣券
			if (row.useCondition === 0) { // 无门槛
				str = `优惠券-折扣券-${'无门槛' + '打'}${row.faceValue}折`
			} else {
				str = `优惠券-折扣券-满${row.matchAmount}打${row.faceValue}折`
			}
			break;
		case 3: // 商品兑换券
			const res = await doGetExChangeList();
			const goodsName = res.data.find((item) => {
				return item.id === row.goodsId
			})
			if ( goodsName && goodsName.name ) {
				str = `优惠券-兑换券-${goodsName.name}`;
			}
			break;

	}
	return str
}
export const MOAactivity = async (resxxx,setSelectRow) => {
	const acData = resxxx.data;
	const acType = resxxx.data.type;

	switch (acType) {
		case 1:
			const typeName = '优惠券'
			const detail = await activityContent(resxxx.data.coupon);
			const { maxNum, remainNumStr } = resxxx.data.actActivityCouponMap;
			setSelectRow([{ ...resxxx.data, typeName, detail, remainNum: remainNumStr, maxNum }])
			break;
		case 2:
			const typeName2 = "异业券";


			setSelectRow([{ ...resxxx.data, typeName: typeName2 }])
			break;
		case 3:
			const typeName3 = "外部链接";
			const detail3 = `URL:${acData.url}`;

			setSelectRow([{ ...resxxx.data, typeName: typeName3, detail: detail3 }])
			break;
		default:
			break;
	}
}
export const optionData=["平台banner","平台胶囊位","我的胶囊位","首页新人礼弹窗","商户端胶囊位","支付完成页","福利中心"]
export const optionDataDom=()=>{
	return optionData.map((item,index)=>{
		return  <Option value={Number(index)+1} key={index}>{item}</Option>
	})
}
// 时间转换器
export const timeConverter=(target,index)=>{

	
	if(index===1){
		return `${String(moment(target[1]).format("YYYY-MM-DD "))}23:59:59`;
	}
	return `${String(moment(target[0]).format("YYYY-MM-DD "))}00:00:00`;


}

export const spaceDisappear=(data)=>{
	return JSON.parse(JSON.stringify(data).replace(/\[\]/g,null))
}