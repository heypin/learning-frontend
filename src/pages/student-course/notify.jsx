import React from "react";
import {List, message, Card} from 'antd';
import Request from '../../api';
import moment from "moment";
import queryString from "querystring";
export default class Notify extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = queryString.parse(props.location.search.slice(1)).courseId;
        this.state = {
            notifyData:[],
        };
    };
    loadNotifyData=async ()=>{
        try{
            const result = await Request.getNotifyByCourseId(this.courseId);
            this.setState({notifyData:result});
        }catch (e) {
            message.error("获取通知失败");
        }
    };
    componentDidMount() {
        this.loadNotifyData();
    };
    render() {
        return (
            <Card title="通知" bodyStyle={{padding:20}}
                  style={{width:"80%",marginLeft:"auto",marginRight:"auto"}}>
                <List itemLayout="horizontal" dataSource={this.state.notifyData}
                    renderItem={item => (
                        <List.Item extra={moment(item.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                            <List.Item.Meta title={item.title} description={item.content}/>
                        </List.Item>
                    )}
                />
            </Card>
        )
    }
}