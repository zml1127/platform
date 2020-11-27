import ProTable from '@ant-design/pro-table';  // 封装Protable查询和重置
import React from 'react';
import {Button} from 'antd';

 export const PTable=(props)=>{
     return <ProTable 
     
     search={{
        collapsed: false,
        optionRender: ({ searchText, resetText }, { form }) => (
            <>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                        form.submit();
                    }}
                >
                    {searchText}
                </Button>{' '}
                <Button
                    onClick={() => {
                        form.resetFields();
                        form.submit();
                    }}
                >
                    {resetText}
                </Button>
            </>
        ),
    }}

     {...props}/>
 }