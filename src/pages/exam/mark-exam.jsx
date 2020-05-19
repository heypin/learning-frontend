import React from "react";
import queryString from "querystring";
import {Button, Card, message} from "antd";
import Request from "../../api";
import Subject from "../../components/subject/subject";

export default class MarkExam extends React.Component{
    constructor(props) {
        super(props);
        let query=queryString.parse(props.location.search.slice(1));
        this.examSubmitId=parseInt(query.examSubmitId.toString());
        this.examPublish={};
        this.submitData={//要提交的数据
            id:this.examSubmitId,
            submitItems:[],
        };
        this.state={
            examLibData:{name:"",items:[]},
            examUserSubmit:{submitItems:[]},
        }
    }
    loadExamLib=async ()=>{
        try {
            await this.loadExamUserSubmit();
            const result=await Request.getExamLibWithItemsById(this.examPublish.examLibId,"true");
            this.submitData.submitItems=new Array(result.items.length).fill({});
            this.setState({examLibData:result});
        }catch (e) {
            message.error("获取题目失败");
        }
    };
    loadExamUserSubmit=async ()=>{
        try{
            let examSubmit=await Request.getExamSubmitById(this.examSubmitId);
            this.examPublish=await Request.getExamPublishById(examSubmit.examPublishId);
            const result=await Request.getExamUserSubmitWithItems(examSubmit.examPublishId,examSubmit.userId);
            this.submitData.id=result.ID;
            this.setState({examUserSubmit:result});
        }catch (e) {
            console.log(e);
        }
    };
    submitExamMark=async ()=>{//提交批阅结果
        try{
            await Request.updateExamSubmitItemsScore(this.submitData);
            message.success("操作成功");
        }  catch (e) {
            message.error("操作失败");
        }
    };
    getInputValue=(value)=>{
        this.submitData.submitItems[value.sequenceNumber-1]={
            id:value.record.ID,
            examLibItemId:value.dataSource.ID,
            score:value.record.score,
        };
    };
    componentDidMount() {
        this.loadExamLib();
    }
    render() {
        return (
            <Card title={this.state.examLibData.name}  extra={<Button onClick={this.submitExamMark}>提交</Button>}>
                <div style={{width:"70%",marginLeft:"auto",marginRight:"auto"}}>
                    {
                        this.state.examLibData.items.map((item,index)=>{
                            let record={answer:""};
                            this.state.examUserSubmit.submitItems.forEach((submitItem)=>{
                                if(submitItem.examLibItemId===item.ID){
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