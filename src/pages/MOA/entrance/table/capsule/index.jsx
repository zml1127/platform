import { connect } from 'dva';
import React, { memo,useState} from 'react';
import { Radio } from 'antd';
import PlatCap from './PlatCap';
import MyCap from './MyCap';
import Mecl from './MECL';

// 胶囊位
export default connect(
() => ({}),
)(
memo(props => {
console.log(props)
const [active,setActive]=useState(sessionStorage.getItem("MOAState2")||"1");
const {getEntranceListPlat,getPageForMerchant}=props;
const handleActive=(key)=>{
    switch (key) {
        case "1":
            
            return <PlatCap {...props} getEntranceListPlat={getEntranceListPlat} currentState={2}/>
        case "2":
            
            return <MyCap {...props} getEntranceListPlat={getEntranceListPlat} currentState={3}/>
        case "3":
            
            return <Mecl {...props} getPageForMerchant={getPageForMerchant} currentState={5}/>
        default:
            return <PlatCap {...props} getEntranceListPlat={getEntranceListPlat} currentState={2}/>

    }
}
return (
<div>
    <Radio.Group onChange={(e)=>{setActive(e.target.value)
    sessionStorage.setItem("MOAState2",e.target.value)
    }} defaultValue={active}>
         <Radio.Button value="1">
             平台胶囊位
         </Radio.Button>
         <Radio.Button value="2">
         &apos;我的&apos;胶囊位
         </Radio.Button>
         <Radio.Button value="3">
           商户端胶囊位
         </Radio.Button>
       
    </Radio.Group>
    
    {handleActive(active)}

</div>
);
}),
);