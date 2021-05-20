import { Space,  Tag } from 'antd';
import moment from 'moment';
import  ButtonBuilder from './ButtonBuilder';

const ColumnBuilder  = (columnList: selfListAPI.TableColumn [] | undefined)=>{

    // return [{title: 'Id',dataIndex: 'id',key: 'id'}].concat( res?.data?.layout?.tableColumn.filter((item)=>{return item?.hideInColumn !== true}) || [] )

    // ———————————————————————————————————————— 方式1 （if条件来判断）————————————————————————————————————————
    // 此时因为要处理datetime格式 和 hideInColumns  所以先用forEach来处理
    // const newColumn: any[] = [];
    // (res?.data?.layout?.tableColumn || []).forEach( column => {
    //     // 调整时间的格式
    //     // if(column.type === 'datetime'){
    //     //     // 对特殊的列做处理时， 相当于给column加一个render属性 此时会有错误的提示 在data.d.ts中对tableColumn加 [key: string] : any;
    //     //     column.render = (value: any) => {
    //     //         return moment(value).format('YYYY-MM-DD HH:mm:ss');
    //     //     }
    //     // }
    //     if(column.hideInColumn !== true) {
    //         if(column.type === 'datetime'){
    //             // 对特殊的列做处理时， 相当于给column加一个render属性 此时会有错误的提示 在data.d.ts中对tableColumn加 [key: string] : any;
    //             column.render = (value: any) => {
    //                 return moment(value).format('YYYY-MM-DD HH:mm:ss');
    //             }
    //         }
    //         if(column.type === 'switch'){
    //             column.render = (value: any)=>{
    //                 // console.log(value); //1
    //                 const option = (column.data || []).find(statusItem =>{
    //                     return statusItem.value === value;
    //                 });
    //                 return <Tag color={value===1?"blue":"red"}>{ option?.title }</Tag>
    //             }
    //         }
    //         newColumn.push(column)
    //     }
    // })
    // return newColumn;
    // ———————————————————————————————————————— 方式2 （switch来判断）当有多种相同情况的判断时用 switch更加合理 ————————————————————————————————————————
    const newColumn: selfListAPI.TableColumn[] = [];
    (columnList || []).forEach( _column => {
        const column  = _column;
        if(column.hideInColumn !== true){
            switch (column.type) {
                case 'datetime':
                    column.render = (value: any) => {
                        return moment(value).format('YYYY-MM-DD HH:mm:ss');
                    }
                    break;
                case 'switch':
                    column.render = (statusItem: any) => {
                        // console.log(statusItem); // 1
                        const option = column.data.find(item => {
                            return item.value === statusItem;
                        });
                        return <Tag color = {statusItem === 1 ? 'blue' : 'red' }>{ option?.title }</Tag>
                        
                    }
                    break;
                case 'actions':
                    column.render = () => {
                        return  <Space>{ ButtonBuilder(column.actions) }</Space>
                        
                    }
                    break;
                default:
                    break;
            }
            newColumn.push(column);
        }
        
    })
    return newColumn;
};
export default ColumnBuilder;