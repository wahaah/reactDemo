import React , { useState , useEffect } from 'react';
import Style from './index.less';

import { Table, Space, Row , Col , Pagination , Card } from 'antd';      // 现在背景是灰色的 要变成白色的 引入Card
import ColumnBuilder from './builder/ColumnBuilder';
import ButtonBuilder from './builder/ButtonBuilder';


// 现在不用臃肿的 dva 而用 hooks
import  { useRequest } from 'umi';

// 为了与其他的保持一致 有个头部   引入PageContainer
import { PageContainer } from '@ant-design/pro-layout';

const SelfList = () => {
    // 使用 useState 来初始化
    // const [state, setstate] = useState(initialState)
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    // hook省去很多判断和异常处理
    // const res = useRequest("https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd");
    // 加上数据的声明 <{data:selfListAPI.Data}> 后 就会自动提示
    const res = useRequest<{data: selfListAPI.Data}>(`https://public-api-v2.aspirantzhang.com/api/admins?X-API-KEY=antd&page=${page}&per_page=${perPage}`);
    console.log(res);

    // 当page和perpage发生变化时 调用res.run()
    useEffect(() => {
        res.run();
    }, [page,perPage])
    
    const SearchLayout = ()=>{
        return(
            <div>search</div>
        )
    };
    const BeforeLayout = ()=>{
        return (
            <Row>
                
                <Col xs={12} sm={12}>
                    ...
                </Col>
                <Col className={Style.tableToolbar} xs={12} sm={12}>
                    <Space>
                        {/* <Button type="primary">Add</Button>
                        <Button type="primary">Delate</Button> */}
                        { ButtonBuilder(res?.data?.layout?.tableToolBar) }
                    </Space>
                </Col>
            </Row>
        );
    };
    const onChangeHandler = (_page: any, _perPage: any)=>{
        // 给前面 加 — 是为了区分和全局的useState 的page he perpage作区分
        setPage(_page);
        setPerPage(_perPage);
        // console.log(_page, _perPage);
        // 此处的页码都是正确的，但数据未变化是因为 没有再次做数据请求 用run()方法再次请求
        // res.run();
        // 此时结果： 数据也发生了变化，但数据不对每次都请求的是上次的数据
        /**
         * 此时需要注意 useState()的执行是 异步的 并不是按照当前所写的顺序执行 res.run()在设置值前边已经执行
         * 用useEffect来解决异步的问题
         */

    }
    const AfterLayout = () => {
        return (
            <Row >
                <Col xs={12} sm={12}>
                    ...
                </Col>
                <Col className={Style.tableToolbar} xs={12} sm={12}>
                    {/* 实现分页请求 */}
                    <Pagination
                        // 加 ？号就不用额外判断为空  当没有结果为 undefined 时就需要设置默认值
                       defaultCurrent = {res?.data?.meta?.page || 1}
                       total = {res?.data?.meta?.total || 0} 
                       pageSize = {res?.data?.meta?.per_page || 10}
                       onChange={onChangeHandler}
                    />
                </Col>
            </Row>
        )
    };
    const BatchToolbar = () => {
        return (
            <Space>
                 { ButtonBuilder(res?.data?.layout?.batchToolBar) }
            </Space>
        )
    }
    // const columnBuilder  = ()=>{

    //     // return [{title: 'Id',dataIndex: 'id',key: 'id'}].concat( res?.data?.layout?.tableColumn.filter((item)=>{return item?.hideInColumn !== true}) || [] )

    //     // ———————————————————————————————————————— 方式1 （if条件来判断）————————————————————————————————————————
    //     // 此时因为要处理datetime格式 和 hideInColumns  所以先用forEach来处理
    //     // const newColumn: any[] = [];
    //     // (res?.data?.layout?.tableColumn || []).forEach( column => {
    //     //     // 调整时间的格式
    //     //     // if(column.type === 'datetime'){
    //     //     //     // 对特殊的列做处理时， 相当于给column加一个render属性 此时会有错误的提示 在data.d.ts中对tableColumn加 [key: string] : any;
    //     //     //     column.render = (value: any) => {
    //     //     //         return moment(value).format('YYYY-MM-DD HH:mm:ss');
    //     //     //     }
    //     //     // }
    //     //     if(column.hideInColumn !== true) {
    //     //         if(column.type === 'datetime'){
    //     //             // 对特殊的列做处理时， 相当于给column加一个render属性 此时会有错误的提示 在data.d.ts中对tableColumn加 [key: string] : any;
    //     //             column.render = (value: any) => {
    //     //                 return moment(value).format('YYYY-MM-DD HH:mm:ss');
    //     //             }
    //     //         }
    //     //         if(column.type === 'switch'){
    //     //             column.render = (value: any)=>{
    //     //                 // console.log(value); //1
    //     //                 const option = (column.data || []).find(statusItem =>{
    //     //                     return statusItem.value === value;
    //     //                 });
    //     //                 return <Tag color={value===1?"blue":"red"}>{ option?.title }</Tag>
    //     //             }
    //     //         }
    //     //         newColumn.push(column)
    //     //     }
    //     // })
    //     // return newColumn;
    //     // ———————————————————————————————————————— 方式2 （switch来判断）当有多种相同情况的判断时用 switch更加合理 ————————————————————————————————————————
    //     const newColumn: any[] = [];
    //     (res?.data?.layout?.tableColumn || []).forEach( column => {
    //         if(column.hideInColumn !== true){
    //             switch (column.type) {
    //                 case 'datetime':
    //                     column.render = (value: any) => {
    //                         return moment(value).format('YYYY-MM-DD HH:mm:ss');
    //                     }
    //                     break;
    //                 case 'switch':
    //                     column.render = (statusItem: any) => {
    //                         // console.log(statusItem); // 1
    //                         const option = column.data.find(item => {
    //                             return item.value === statusItem;
    //                         });
    //                         return <Tag color = {statusItem === 1 ? 'blue' : 'red' }>{ option?.title }</Tag>
                            
    //                     }
    //                     break;
    //                 case 'actions':
    //                     column.render = () => {
    //                         return  <Space>{ ButtonBuilder(column.actions) }</Space>
                            
    //                     }
    //                     break;
    //                 default:
    //                     break;
    //             }
    //             newColumn.push(column);
    //         }
            
    //     })
    //     return newColumn;
    // };
    // const ButtonBuilder = (actionsList:selfListAPI.Action[] | undefined) => {
    //     return (actionsList || []).map((item:any) => {
    //         return <Button type={item.type}> {item.text} </Button>
    //     })
    // }
    return (
        <PageContainer>
            {SearchLayout()}
           <Card>
                { BeforeLayout() }
                {/* {JSON.stringify(res?.data?.dataSource)} */}
                    <Table 
                    dataSource={ res?.data?.dataSource } 
                    // 为了加上id字段，由于后端没有传递
                    columns ={ ColumnBuilder(res?.data?.layout?.tableColumn)}
                    // columns={res?.data?.layout?.tableColumn.filter((item)=>{return item?.hideInColumn === false})} //错误的
                    loading = {res.loading}
                    pagination={false} />
                { AfterLayout() }
                
                { BatchToolbar() }
           </Card>
        </PageContainer>
    )
}
export default SelfList;