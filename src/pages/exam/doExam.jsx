import React from "react";
import queryString from "querystring";
import {Card, message, Button, Layout, Menu, Space, Popconfirm} from "antd";
import Request from "../../api";
import Subject from "../../components/subject/subject";
import moment from "moment";
import Timer from "../../components/Timer";
const {Sider,Content}= Layout;
export default class DoExam extends React.Component{
    constructor(props) {
        super(props);
        let query=queryString.parse(props.location.search.slice(1));
        this.examPublishId = parseInt(query.examPublishId.toString());
        this.examLibId=parseInt(query.examLibId.toString());
        this.submitData={//要提交的数据
            examPublishId:this.examPublishId,
            submitItems:[],
        };
        this.state={
            selectedSequence:0,//选择的题号
            examLibData:{name:"",items:[]},
            examUserSubmit:{submitItems:[]},
            allowExam:false,//是否允许考试
            countDown:0,//倒计时多少秒，计时器
        }
    }
    loadExamLib=async ()=>{
        try {
            this.loadExamUserSubmit();
            const result=await Request.getExamLibWithItemsById(this.examLibId);
            this.submitData.submitItems=new Array(result.items.length).fill({});
            this.setState({examLibData:result});
        }catch (e) {
            message.error("获取题目失败");
        }
    };
    getValues=(value)=>{
        this.submitData.submitItems[value.sequenceNumber-1]={
            id:value.record.ID,
            examLibItemId:value.dataSource.ID,
            answer:value.record.answer,
        };
    };
    loadExamUserSubmit=async ()=>{
        try{
            const result=await Request.getExamUserSubmitWithItems(this.examPublishId);
            this.submitData.id=result.ID;
            this.setState({examUserSubmit:result});
        }catch (e) {
            console.log(e);
        }
    };
    submitExam=async ()=>{//提交所有题
        try{
            await Request.submitExamItem(this.submitData);
            await Request.finishExam({id:this.userSubmitRecord.ID});//修改考试结束时间
            message.success("提交成功");
        }  catch (e) {
            message.error("提交失败,考试结束");
        }
    };
    startExam=async ()=>{
      try{
          this.examPublish= await Request.getExamPublishById(this.examPublishId);
          let now =moment();
          let beginTime=moment(this.examPublish.beginTime);
          let endTime=moment(this.examPublish.endTime);
          if(now.isBefore(beginTime)||now.isAfter(endTime)){
              message.error("未在考试时间范围内");
              return
          }
          this.userSubmitRecord = await Request.startExam({examPublishId:this.examPublishId});
          let startTime=moment(this.userSubmitRecord.startTime);
          let stopTime=startTime.add(this.examPublish.duration,'minutes');
          if(this.userSubmitRecord.finishTime||
              stopTime.isBefore(now)){
              message.error("考试已结束");
              return
          }
          if(stopTime.isAfter(endTime)){
              stopTime=endTime
          }
          let countDown=stopTime.diff(now,'seconds');

          this.setState({allowExam:true,countDown:countDown});
      }catch (e) {
          console.log(e)
      }
    };
    submitExamItem=async (sequence)=>{//仅提交一道题
        try{
            let values={
                id:this.submitData.id,
                examPublishId:this.examPublishId,
                submitItems:[this.submitData.submitItems[sequence-1]],
            };
            console.log(values);
            await Request.submitExamItem(values);
            this.loadExamUserSubmit();
            message.success("已保存");
        }  catch (e) {
            message.error("保存失败");
        }
    };
    onMenuItemClick=({item})=>{
        this.setState({selectedSequence:item.props.sequence});
        console.log(this.state.selectedSequence)
    };
    componentDidMount() {
        this.startExam();
        this.loadExamLib();
    }
    render() {
        if (!this.state.allowExam) return null;
        const cardExtra=(
            <Space size="large">
                <Timer style={{fontSize:30}} seconds={this.state.countDown}/>
                <Popconfirm placement="bottomRight" title="确定提交?提交后不可再进入" onConfirm={()=>this.submitExam()}>
                    <Button type="primary">提交</Button>
                </Popconfirm>
            </Space>
        );
        return (
            <Card bodyStyle={{padding:0,height:"100%"}} style={{height:"100%"}} title={this.state.examLibData.name}  extra={cardExtra}>
                <Layout style={{backgroundColor:"white",height:"100%"}}>
                    <Sider  className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                        <Menu style={{height:"100%",}} theme="light"  onClick={this.onMenuItemClick}>
                            {this.state.examLibData.items.map((item,index)=>{
                                let isSave=false;
                                this.state.examUserSubmit.submitItems.forEach((submitItem,index)=>{
                                    if(submitItem.examLibItemId===item.ID){
                                        isSave=true;
                                    }
                                });
                                return (
                                <Menu.Item key={item.ID} record={item} sequence={index+1}>
                                    <span>{index+1}.</span>
                                    <span>{item.type}</span>
                                    <span>({item.score}分)</span>
                                    <span style={{color:"green"}}>{isSave?"[已保存]":null}</span>
                                </Menu.Item>
                            )})}
                        </Menu>
                    </Sider>
                    <Content style={{height:"100%",padding:30}}>
                        <div style={{marginLeft:"auto",marginRight:"auto"}}>
                            {(()=> {
                                let sequence =this.state.selectedSequence;
                                if (sequence===0) return null;
                                let item = this.state.examLibData.items[sequence-1];
                                let record={answer:""};
                                this.state.examUserSubmit.submitItems.forEach((submitItem,index)=>{
                                    if(submitItem.examLibItemId===item.ID){
                                        record=submitItem;
                                    }
                                });
                                return (
                                    <React.Fragment>
                                        <Subject key={item.ID} record={record} sequenceNumber={sequence}
                                                 type={item.type} dataSource={item} getValues={this.getValues}/>
                                        <div style={{padding:10}}>
                                            <Button type="primary" onClick={()=>{this.submitExamItem(sequence)}}>保存</Button>
                                        </div>
                                    </React.Fragment>
                                )
                            })()}
                        </div>
                    </Content>
                </Layout>
            </Card>
        )
    }
}