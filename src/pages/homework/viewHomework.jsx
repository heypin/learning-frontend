import React from "react";
import queryString from "querystring";
import {Card, message} from "antd";
import Request from "../../api";
import Subject from "../../components/subject/subject";
export default class ViewHomework extends React.Component{
    constructor(props) {
        super(props);
        let query=queryString.parse(props.location.search.slice(1));
        this.homeworkPublishId = parseInt(query.homeworkPublishId.toString());
        this.homeworkLibId=parseInt(query.homeworkLibId.toString());
        this.state={
            homeworkLibData:{name:"",items:[]},
            homeworkUserSubmit:{submitItems:[]},
        }
    }
    loadHomeworkLib=async ()=>{
        try {
            this.loadHomeworkUserSubmit();
            const result=await Request.getHomeworkLibWithItemsById(this.homeworkLibId,"true");
            this.setState({homeworkLibData:result});
        }catch (e) {
            message.error("获取题目失败");
        }
    };
    loadHomeworkUserSubmit=async ()=>{
        try{
            const result=await Request.getHomeworkUserSubmitWithItems(this.homeworkPublishId);
            this.setState({homeworkUserSubmit:result});
            console.log(result);
        }catch (e) {
            console.log(e);
        }
    };
    componentDidMount() {
        this.loadHomeworkLib();
    }
    render() {
        return (
            <Card title={this.state.homeworkLibData.name} >
                <div style={{width:"70%",marginLeft:"auto",marginRight:"auto"}}>
                    {
                        this.state.homeworkLibData.items.map((item,index)=>{
                            let record={answer:""};
                            this.state.homeworkUserSubmit.submitItems.forEach((submitItem,index)=>{
                                if(submitItem.homeworkLibItemId===item.ID){
                                    record=submitItem;
                                }
                            });
                            return (
                                <Subject key={item.ID} record={record} sequenceNumber={index+1}
                                     answerVisible={true}  type={item.type} dataSource={item} getValues={this.getValues}/>
                            )
                        })
                    }
                </div>
            </Card>
        )
    }
}