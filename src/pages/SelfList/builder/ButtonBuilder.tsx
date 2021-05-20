import { Button } from 'antd';

const ButtonBuilder = (actionsList: selfListAPI.Action[] | undefined) => {
    return (actionsList || []).map((item: any) => {
        return <Button type={item.type}> {item.text} </Button>
    })
}

export default ButtonBuilder;