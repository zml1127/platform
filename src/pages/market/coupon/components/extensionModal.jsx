import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Input, Tabs, Cascader, Select, Modal, Radio, Typography, notification } from 'antd';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback, } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { connect } from 'dva';
import { visible } from 'chalk';
import { copyValue, downloadImg } from '@/utils/utils'
import html2canvas from "html2canvas"
// import QRCode from 'qrcode.react';
import tgBg from '../../../../assets/tgBg.png'


const ExtensionModal = memo(props => {
    const { visible, setVisible, } = props
    const [radioValue, setRadioValue] = useState(1) //默认1分享链接，2小程序码
    const [inpValue, setInpValue] = useState('') //输入框内容
    
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const radioChange = useCallback(e=>{
        setRadioValue(e.target.value)
    },[])

    // 分享链接输入框
    const inpChange = useCallback(e=>{
        setInpValue(e.target.value)
    },[])

    
    return (
        <Modal 
            visible={visible}
            // visible={true}
            onCancel={()=>{ setVisible(false) }}
            footer={false}
            title="分享推广"
            width={500}
        >
            <div style={{display:'flex'}}>
                <Radio.Group 
                    onChange={radioChange} 
                    value={radioValue}
                >
                    <Radio style={radioStyle} value={1}>分享链接</Radio>
                    <Radio style={radioStyle} value={2}>小程序码</Radio>
                </Radio.Group>
               
                <div style={{flex:1,borderLeft:'1px solid #999', paddingLeft:'18px'}}>
                     {/* 海报内容 */}
                    <div>
                        {/* <Typography.Text copyable editable>啊啊啊</Typography.Text> */}
                        <Input 
                            placeholder={radioValue == 1 ? '分享链接' : '微信小程序分享链接'}
                            onChange={inpChange}
                        />
                        <div style={{textAlign:'center'}}>
                            <Button 
                                style={{marginTop:'10px',width:'160px',borderRadius:'6px',marginBottom:'16px'}}
                                onClick={()=>{copyValue(inpValue)}}
                            >复制</Button>
                        </div>
                        <div id="toCanvasImg" style={{borderRadius:'16px',border:'none'}}>
                            <div style={{padding:'10px',background: `url(${tgBg})`,backgroundSize:'cover'}}>
                                <div style={{color:'#fff',marginBottom:'10px'}}>
                                    <div>{'许某某'}</div>
                                    <div>为你挑选了一个好物</div>
                                </div>
                                <div style={{padding:'10px',background:"#fff",borderRadius:'6px'}}>
                                    <div style={{width:'100%',height:'260px',borderRadius:'6px',padding:'10px 0 0 10px',color:'#fff',backgroundImage:'url(https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=151472226,3497652000&fm=26&gp=0.jpg)',backgroundSize:'cover'}}>标准洗车</div>
                                    <div style={{fontSize:'16px',color:'#ec543d',fontWeight:'500',marginTop:'10px'}}>
                                        <span>拼团价：</span>
                                        <span style={{padding:'0 10px 0 6px'}}>￥0.01</span>
                                        <span style={{fontSize:'10px',background:'#f7b6b6',borderRadius:'6px'}}>22人拼团价</span>
                                    </div>
                                    <div style={{display:'flex',justifyContent:'space-between',paddingTop:'16px'}}>
                                    <div>
                                        <div style={{textDecoration:'line-through',color:'#aba6a7'}}>￥1.00</div>
                                        <div style={{color:'#e82f30'}}>快来领取吧~</div>
                                    </div>
                                    <div style={{width:'80px',height:'80px'}}>
                                        <img style={{width:'100%',height:'100%'}} src={'https://dss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab'}/>
                                        {/* <QRCode
                                            className="qrid"
                                            value={`http://wx.shangkehy.com?merchantId=${11111}&type=${123123123}`} // value参数为生成二维码的链接
                                            size={100} // 二维码的宽高尺寸
                                            fgColor="#000000" // 二维码的颜色
                                        /> */}
                                    </div>
                                </div>
                                </div>
                                

                            </div>
                        </div>
                    </div>
                    {/* 海报内容尾部 */}
                    <div style={{textAlign:'center',marginTop:'16px'}}>
                        <Button onClick={()=>{
                            html2canvas(document.getElementById('toCanvasImg'), { useCORS: true, logging: true, scale: 1 })
                            .then(async function (canvas) {
                                let dataUrl = canvas.toDataURL(); //得到文件base64
                                downloadImg(dataUrl, '图片名字啊啊啊')
                            });
                        }}>下载海报</Button>
                    </div>
                </div>
            </div>
            
            
            
      	</Modal>
    );
});

export default connect(
	({ makeGroup, coupon, }) => ({
		
	}),
	dispatch => ({
		// async getShopList(payload, type) {
		// 	return dispatch({
		// 		type: 'coupon/getShopList',
		// 		payload
		// 	});
		// },
	}),
)(ExtensionModal);
