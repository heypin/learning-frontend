import React from "react";
import queryString from "querystring";
import {Card, message,Button} from "antd";
import Request from "../../api";
import Subject from "../../components/subject/subject";
export default class DoHomework extends React.Component{
    constructor(props) {
        super(props);
        let query=queryString.parse(props.location.search.slice(1));
        this.homeworkPublishId = parseInt(query.homeworkPublishId.toString());
        this.homeworkLibId=parseInt(query.homeworkLibId.toString());
        this.submitData={//要提交的数据
            homeworkPublishId:this.homeworkPublishId,
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
            const result=await Request.getHomeworkLibWithItemsById(this.homeworkLibId);
            this.submitData.submitItems=new Array(result.items.length).fill({});
            this.setState({homeworkLibData:result});
        }catch (e) {
            message.error("获取题目失败");
        }
    };
    getValues=(value)=>{
        this.submitData.submitItems[value.sequenceNumber-1]={
            id:value.record.ID,
            homeworkLibItemId:value.dataSource.ID,
            answer:value.record.answer,
        };
    };
    loadHomeworkUserSubmit=async ()=>{
      try{
          const result=await Request.getHomeworkUserSubmitWithItems(this.homeworkPublishId);
          this.submitData.id=result.ID;
          this.setState({homeworkUserSubmit:result});
      }catch (e) {
          console.log(e);
      }
    };
    submitHomework=async ()=>{
      try{
          await Request.submitHomeworkWithItems(this.submitData);
          message.success("提交成功");
      }  catch (e) {
          message.error("提交失败");
      }
    };
    componentDidMount() {
        this.loadHomeworkLib();
    }
    render() {
        return (
            <Card title={this.state.homeworkLibData.name}  extra={<Button onClick={this.submitHomework}>提交</Button>}>
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
                              <Subject key={item.ID} record={record} sequenceNumber={index+1}
                                       type={item.type} dataSource={item} getValues={this.getValues}/>
                          )
                        })
                    }
                </div>
            </Card>
        )
    }
}