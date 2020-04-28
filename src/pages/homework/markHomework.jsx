import React from "react";
import queryString from "querystring";
import {Button, Card, message} from "antd";
import Request from "../../api";
import Subject from "../../components/subject/subject";

export default class MarkHomework extends React.Component{
    constructor(props) {
        super(props);
        let query=queryString.parse(props.location.search.slice(1));
        this.homeworkSubmitId=parseInt(query.homeworkSubmitId.toString());
        this.homeworkPublish={};
        this.submitData={//要提交的数据
            id:this.homeworkSubmitId,
            submitItems:[],
        };
        this.state={
            homeworkLibData:{name:"",items:[]},
            homeworkUserSubmit:{submitItems:[]},
        }
    }
    loadHomeworkLib=async ()=>{
        try {
            await this.loadHomeworkUserSubmit();
            const result=await Request.getHomeworkLibWithItemsById(this.homeworkPublish.homeworkLibId,"true");
            this.submitData.submitItems=new Array(result.items.length).fill({});
            this.setState({homeworkLibData:result});
        }catch (e) {
            message.error("获取题目失败");
        }
    };
    loadHomeworkUserSubmit=async ()=>{
        try{
            let homeworkSubmit=await Request.getHomeworkSubmitById(this.homeworkSubmitId);
            this.homeworkPublish=await Request.getHomeworkPublishById(homeworkSubmit.homeworkPublishId);
            const result=await Request.getHomeworkUserSubmitWithItems(homeworkSubmit.homeworkPublishId,homeworkSubmit.userId);
            this.submitData.id=result.ID;
            this.setState({homeworkUserSubmit:result});
        }catch (e) {
            console.log(e);
        }
    };
    submitHomeworkMark=async ()=>{
        try{
            await Request.updateHomeworkSubmitItemsScore(this.submitData);
            message.success("操作成功");
        }  catch (e) {
            message.error("操作失败");
        }
    };
    getInputValue=(value)=>{
        this.submitData.submitItems[value.sequenceNumber-1]={
            id:value.record.ID,
            homeworkLibItemId:value.dataSource.ID,
            score:value.record.score,
        };
    };
    componentDidMount() {
        this.loadHomeworkLib();
    }
    render() {
        return (
            <Card title={this.state.homeworkLibData.name}  extra={<Button onClick={this.submitHomeworkMark}>提交</Button>}>
                <div style={{width:"70%",marginLeft:"auto",marginRight:"auto"}}>
                    {
                        this.state.homeworkLibData.items.map((item,index)=>{
                            let record={answer:""};
                            this.state.homeworkUserSubmit.submitItems.forEach((submitItem)=>{
                                if(submitItem.homeworkLibItemId===item.ID){
                                    record=submitItem;
                                }
                            });
                            return (
                                <Subject key={item.ID} record={record} sequenceNumber={index+1} inputVisible={true} answerVisible={true}
                                         type={item.type} dataSource={item} getInputValue={this.getInputValue}/>
                            )
                        })
                    }
                </div>
            </Card>
        )
    }
}