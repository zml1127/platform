import React, { memo, useEffect, } from 'react';
import {message} from 'antd';

const { AMap } = window;

export default memo(props => {
	const { 
		data,
		setFieldsValue,
		city,
		height,
		setareaUpData,
		position,
		initCity,
		row
	} = props;

    
	// useEffect(()=>{
	// 	setFieldsValue({ bdLng: String(lnglatInit[0]), bdLat: String(lnglatInit[1]) });
	// },[])

		
	// 地址解析器 // Geocoder

	useEffect(() => {
	
		const bmap = new AMap.Map('Allmap',{
			resizeEnable: true,
			center: row.lng?[row.lng,row.lat]:null,
			
		});
		
		const myGeo = new AMap.Geocoder({});
		const marker = new AMap.Marker();
		const d=data.area?data.area.join(""):"";
		const tempCity=`${city||d}${data.address}`;
		
		if(!(row.lng)){
			bmap.setCity(tempCity)			
		}
		
		// const placeSearch = new AMap.PlaceSearch({})
		bmap.on('click',e=>{		
			 const { lnglat } = e;
			 const { lng, lat } = lnglat;
			 setFieldsValue({ lng: String(lng), lat: String(lat) });
			 marker.setPosition(lnglat);
					bmap.add(marker);
					bmap.setFitView(marker);
			myGeo.getAddress(lnglat, (status,result)=>{
				if (status === 'complete'&&result.regeocode) {		
					const address =result.regeocode.formattedAddress;
					const addComp = result.regeocode.addressComponent;
					const tCity=addComp.city===""?(addComp.province+addComp.district):addComp.city;
					setFieldsValue({area:[addComp.province,tCity,addComp.district]});
					const provinceIdData = position.find(item=>addComp.province.indexOf(item.shortname)!==-1)
					if(provinceIdData){

						const  cityIdData=provinceIdData.children&&provinceIdData.children.find(item=>tCity.indexOf(item.shortname)!==-1)
						const  districtIdData=cityIdData&&cityIdData.children&&cityIdData.children.find(item=>addComp.district.indexOf(item.shortname)!==-1)
						setTimeout(()=>{
								const addressIds={provinceId:provinceIdData.id};
								if(cityIdData){
										addressIds.cityId=cityIdData.id
										if(districtIdData){
												addressIds.districtId=districtIdData.id
											}
										}
										setareaUpData(addressIds);
										setFieldsValue({address:addComp.district?address.split(addComp.district)[1]:address});
						})
					}
				}else{
					message.error('根据经纬度查询地址失败')
				}
			});
		});
		
		if(initCity){
			myGeo.getLocation(tempCity, function(status, result){
				
				if (status === 'complete'&&result.geocodes.length) {
					const lnglat = result.geocodes[0].location
					setFieldsValue({ lng: String(lnglat.lng), lat: String(lnglat.lat) });
					marker.setPosition(lnglat);
					bmap.add(marker);
					bmap.setFitView(marker);
				}else{
					// message.error('根据地址查询位置失败');
				}

			},);
		}
		if(!initCity){
			if(row.lng){
			const lnglatInit=[row.lng,row.lat]
			myGeo.getAddress(lnglatInit, (status,result)=>{
				marker.setPosition(lnglatInit);
				bmap.add(marker);
				bmap.setFitView(marker);
				if (status === 'complete'&&result.regeocode) {		
					// const address =result.regeocode.formattedAddress;
					const addComp = result.regeocode.addressComponent;
					const tCity=addComp.city===""?(addComp.province+addComp.district):addComp.city;
					// setFieldsValue({area:[addComp.province,tCity,addComp.district]});
					const provinceIdData = position.find(item=>addComp.province.indexOf(item.shortname)!==-1)
					const cityIdData = provinceIdData && provinceIdData.children&&provinceIdData.children.find(item=>tCity.indexOf(item.shortname)!==-1)
					const districtIdData = cityIdData && cityIdData.children&&cityIdData.children.find(item=>addComp.district.indexOf(item.shortname)!==-1)
					setTimeout(()=>{
						const addressIds={provinceId:provinceIdData.id};
						if(cityIdData){
							addressIds.cityId=cityIdData.id
							if(districtIdData){
								addressIds.districtId=districtIdData.id
							}
						}
						setareaUpData(addressIds);
						// setFieldsValue({address:address.split(addComp.district)[1]});
					})
				}else{
					// message.error('根据经纬度查询地址失败')
				}
			});
			}

		}
	}, [city,data.address,row.lng]);


	
	return <div id="Allmap" style={{ width: '100%', height: height || 400 }} />;
});
