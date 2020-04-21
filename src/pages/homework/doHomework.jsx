import React from "react";
import queryString from "querystring";
import {Card, message} from "antd";
import Request from "../../api";
import Subject from "../../components/subject/subject";
export default class DoHomework extends React.Component{
    constructor(props) {
        super(props);
        let query=queryString.parse(props.location.search.slice(1));
        this.homeworkPublishId = query.homeworkPublishId;
        this.homeworkLibId=query.homeworkLibId;
        this.state={
            homeworkLibData:{name:"",items:[]}
        }
    }
    loadHomeworkLib=async ()=>{
        try {
            const result=await Request.getHomeworkLibWithItemsById(this.homeworkLibId);
            this.setState({homeworkLibData:result});
            console.log(result);
        }catch (e) {
            message.error("获取题目失败");
        }
    };
    componentDidMount() {
        this.loadHomeworkLib();
    }
    render() {
        return (
            <Card title={this.state.homeworkLibData.name} style={{height:"100%"}}>
                <div style={{width:"70%",marginLeft:"auto",marginRight:"auto"}}>
                    {
                        this.state.homeworkLibData.items.map((item,index)=>{
                          return (
                              <Subject record={{answer:""}} sequenceNumber={index+1} type={item.type} dataSource={item}/>
                          )
                        })
                    }
                </div>
            </Card>
        )
    }
}