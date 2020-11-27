/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */

import React,{useCallback,useEffect, useState}from 'react';
import {Card,Row,Col,Tag } from 'antd'

import _ from 'lodash';

import {getAddressByPid} from '@/utils/utils';

const Basic=(props => {



	const { getMerchantListById, id, setOption, position, getMerchantserviceTag, typeMap } = props;
	const [ info, setInfoData ] = useState({
		serviceTag: "精致,精致,精致,精致",
		specialTag: "洗手间,支持预约,快速维修,快速保养",
		pic: "",
		merchantTypeId: 2,
		id: "100185"
	});


	const [ sesp,setSeSp ]=useState({serviceTag:null,specialTag:null})

	useEffect(() => {
		fetchComment();
	}, []);

	useEffect(()=>{
		// getMerchantserviceTag()
		fetchCommentTag2()
	},[])

	const fetchCommentTag2 = async()=>{
	   const res= await getMerchantserviceTag();
	   setSeSp({serviceTag:res.serviceTag,specialTag:res.specialTag})
	//    localStorage.setItem("serviceTag",JSON.stringify(res.service))
	//    localStorage.setItem("specialTag",JSON.stringify(res.special))
	}

	const fetchComment = async()=> {
		const Data = await getMerchantListById(id);

		if (Data) {
			const abc = getAddressByPid(
				position,
				{
					a: Data.provinceId,
					b: Data.cityId || null,
					c: Data.districtId || null
				}
			)
			setInfoData({...Data,address:(abc+Data.address)});
			setOption(Data.merchantTypeId)
		}
	}

	const downloadImage = useCallback((imgsrc,name) => {
		const image = new Image();
		// 解决跨域 Canvas 污染问题
		image.setAttribute("crossOrigin", "anonymous");
		image.onload = function() {
			const canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			const context = canvas.getContext("2d");
			context.drawImage(image, 0, 0, image.width, image.height);
			const url = canvas.toDataURL("image/png"); // 得到图片的base64编码数据
			const a = document.createElement("a"); // 生成一个a元素
			const event = new MouseEvent("click"); // 创建一个单击事件
			a.download = name || "photo"; // 设置图片名称
			a.href = url; // 将生成的URL设置为a.href属性
			a.dispatchEvent(event); // 触发a的单击事件
		};
		image.src = imgsrc;
	}, []);
	return (
		<div>
			<Row>
			<Col span="5">
			<Card
			 title="基础信息" >
				<p>店铺名称:{info.name || '--'}</p>
				<p>店铺类型:{typeMap[info.merchantTypeId]}</p>
				<p>建立时间:{info.createTime}</p>
				<p>详细地址:{info.address || '--'}</p>
			 </Card>
			 </Col>
			 <Col span="5" offset={1}>
			 <Card
			 title="账户信息" >
				<p>账户名:{info.username || '--'}</p>
				<p>负责人:{info.principal || '--'}</p>
				<p>店铺有效期:{info.validStartTime}-
				{info.validEndTime?info.validEndTime:"无限"}</p>
				<p>店铺状态:{info.status===1?"上线":"下线"}</p>
				<p>分账比例:{ info.disProportionPaySxf + '%'}</p>
			 </Card>
			 </Col>
			 <Col span="5" offset={1}>
				 {/* //TODO1212 */}
			 <Card
			 title="服务信息"  className="uniqueTag" >
				 
				 {
					info && info.serviceTag ?
					(info.serviceTag.split(",").map((item)=>{
						const serviceTag = JSON.parse(localStorage.getItem("serviceTag"))||[{"id":4,"name":"保养","sort":1,"status":1},{"id":2,"name":"洗车","sort":2,"status":1},{"id":3,"name":"美容","sort":3,"status":1},{"id":1,"name":"加油","sort":4,"status":1},{"id":5,"name":"维修","sort":5,"status":1}];
						
						const names=serviceTag.filter((i)=>(i.id===Number(item)))[0]
						if(names){
							return <Tag key={names.id}>{_.get(names,'name',"0")}</Tag>
						}
					})):null
				 }
			 </Card>
			 </Col>
			 <Col span="5" offset={1}>
				<Card
				title="特色标签"  className="uniqueTag">
					{
						info&&info.specialTag?
						(info.specialTag.split(",").map((item)=>{
							const specialTag = JSON.parse(localStorage.getItem("specialTag"))||[{"id":1,"name":"卫生间","sort":1,"status":1},{"id":2,"name":"便利店","sort":2,"status":1}];
							const names = specialTag.filter((i)=>(i.id === Number(item)))[0]
							
							if(names){
								return <Tag key={names.id}>{names.name || '0'}</Tag>
							}
						})) : null
					}
				</Card>
			  </Col>
			 </Row>
			 <Row>

				<Col span="10">
					<Card
					title="店铺展示图" >
						<Row justify="start" className="photoRow">
						  <Col span="10">
								<h3>店铺头图:</h3>
								{
									info&&info.headPic?
									<img src={info.headPic} width={300} alt="展示图"/>
									:<img src="https://sk-business.oss-cn-zhangjiakou.aliyuncs.com/identifier1595915564329" width={300} alt="展示图"/>
								}
						  </Col>
						  <Col span="10" offset="3">
							   <h3>店铺细节图:</h3>
							   {info&&info.pic?
							   
							   info.pic.split(",").map((item, i)=>{
								   return  <img src={item} width={70} key={i} alt="细节图"/>
							   }):null
							}
								
						  </Col>
						</Row>
				   
			
					</Card>
				</Col>
				<Col span="11" offset={2}>
					<Card
					title="店铺详情"  className="merchantDetail">
						<Row>

							<Col span={16}>
							<p>营业时间:{info&&info.openStartTime}-{info&&info.openEndTime}</p>
							<p>客服电话:{info&&info.tel}</p>
							<p>店铺介绍:{info&&info.intro}
							</p>
							</Col>
							{
								info&&info.qrcode?

							<Col span={6} offset="2">
								<div style={{ position: 'absolute', right: '50px', top: '0px' }}>
									<a
										id="aId"
										title="点我下载"
										key="下载二维码"
										download
										onClick={() => {
											downloadImage(info.qrcode,info.name);
										}}
										style={{ textAlign: 'center', display: 'inline-block' }}
									>
										<img id="qrid" src={info.qrcode} alt="二维码" width={100}/>
										<span style={{display:"block"}}>点击下载</span>
									</a>
								</div>
							</Col>:null
							}

						</Row>
						
			
					</Card>
				</Col>
			 </Row>
		</div>
	);
})

export default Basic;
