import React from "react";
import {Button, Card, Row, Col, message,} from "antd";
import Request from "../../api"
import queryString from "querystring";
import moment from "moment";
export default class Exam extends React.Component{
    constructor(props) {
        super(props);
        this.classId = queryString.parse(props.location.search.slice(1)).classId;
        this.state={
            examData:[],
        };
    }
    loadExamPublishes=async ()=>{
        try{
            const result = await Request.getExamPublishesWithSubmitByClassId(this.classId);
            this.setState({examData:result})
        }catch (e) {
            console.log(e)
        }
    };
    componentDidMount() {
        this.loadExamPublishes();
    };
    getSubmitStatus=(item)=>{
        let now =moment();
        let beginTime=moment(item.beginTime);
        let endTime=moment(item.endTime);
        if(now.isBefore(beginTime)){
            return '未开始';
        }
        if(item.submitRecord.ID===0){//未点击开始考试
            if(now.isAfter(endTime)) return '已过期';
            if(now.isBefore(endTime)) return '待完成';
        }else{
            if(item.submitRecord.mark===1){
                return '已完成';
            }
            if(item.submitRecord.finishTime){//未手动提交
                let startTime=moment(item.submitRecord.startTime);
                let stopTime=startTime.add(item.duration,'minutes');
                if(stopTime.isAfter(now)){
                    return '待完成';
                }else{
                    return '考试结束';
                }
            }
            if(item.submitRecord.mark===0){//未批阅
                    return '待批阅';
            }
        }
    };
    goToDoExamPage=async (item)=>{
        let query=`examPublishId=${item.ID}&examLibId=${item.examLibId}`;
        this.props.history.push({pathname:"/doExam",search:query});
    };
    render() {
        return (
            <Card title="考试列表" bodyStyle={{padding:20}} style={{width:"80%",height:"100%",
                marginLeft:"auto",marginRight:"auto"}}>
                <div>
                    <Row gutter={16}>
                        {
                            this.state.examData.map((item)=>{
                                let status=this.getSubmitStatus(item);
                                return (<Col span={8} key={item.ID}>
                                    <Card title={item.examLib.name} actions={[
                                        <div style={{display:"flex",justifyContent:"space-between",paddingLeft:20,paddingRight:20}}>
                                            {status==="已完成"?<span><span style={{color:"red",fontSize:20}}>{item.submitRecord.totalScore}</span> 分</span>:<div/>}
                                            {( ()=>{
                                                if(status==="待完成"){
                                                    return <Button onClick={()=>this.goToDoExamPage(item)}>开始考试</Button>
                                                }else{
                                                    return <Button disabled={true}>{status}</Button>
                                                }
                                            })()
                                            }
                                        </div>]
                                    }>
                                        <div>开始时间:{moment(item.beginTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                        <div>结束时间:{moment(item.endTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                        <div>考试时间:{item.duration}分钟</div>
                                        <div>总分:{item.examLib.totalScore}分</div>
                                    </Card>
                                </Col>)
                            })
                        }
                    </Row>
                </div>
            </Card>
        )
    }
}