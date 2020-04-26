import React from "react";
import {Button, Card,Row,Col,} from "antd";
import Request from "../../api"
import queryString from "querystring";
import moment from "moment";
export default class Homework extends React.Component{
    constructor(props) {
        super(props);
        this.classId = queryString.parse(props.location.search.slice(1)).classId;
        this.state={
            homeworkData:[],
        };
    }
    loadHomeworkPublishes=async ()=>{
        try{
            const result = await Request.getHomeworkPublishesWithSubmitByClassId(this.classId);
            console.log(result);
            this.setState({homeworkData:result})
        }catch (e) {
            console.log(e)
        }
    };
    componentDidMount() {
        this.loadHomeworkPublishes();
    };
    goToFinishHomeworkPage=(item)=>{
        let query=`homeworkPublishId=${item.ID}&homeworkLibId=${item.homeworkLibId}`;
        this.props.history.push({pathname:"/doHomework",search:query});
    };
    goToViewHomeworkPage=(item)=>{
        let query=`homeworkPublishId=${item.ID}&homeworkLibId=${item.homeworkLibId}`;
        this.props.history.push({pathname:"/viewHomework",search:query});
    };
    getSubmitStatus=(item)=>{
        let beginTime=new Date(item.beginTime).getTime();
        let endTime=new Date(item.endTime).getTime();
        let now = new Date().getTime();
        if(now<beginTime){
            return '未开始';
        }else{
            if(item.submitRecord.ID===0){//未提交
                if(now>endTime) return '已过期';
                if(now<endTime) return '待完成';
            }else{
                if(item.submitRecord.mark===0){//未批阅
                    return '待批阅';
                }else if(item.submitRecord.mark===1){
                    return '已完成';
                }
            }
        }
    };
    render() {
        return (
            <Card title="作业列表" bodyStyle={{padding:20}} style={{width:"80%",height:"100%",
                marginLeft:"auto",marginRight:"auto"}}>
                <div>
                    <Row gutter={16}>
                    {
                        this.state.homeworkData.map((item)=>{
                            let status=this.getSubmitStatus(item);
                            return (<Col span={8} key={item.ID}>
                                    <Card title={item.homeworkLib.name} actions={[
                                        <div style={{display:"flex",justifyContent:"space-between",paddingLeft:20,paddingRight:20}}>
                                            {status==="已完成"?<span><span style={{color:"red",fontSize:20}}>{item.submitRecord.totalScore}</span> 分</span>:<div/>}
                                            {( ()=>{
                                                if(status==="未开始"){
                                                    return <Button disabled={true}>编辑</Button>
                                                }else if(status==="已完成"||status==="已过期"){
                                                    return <Button onClick={()=>this.goToViewHomeworkPage(item)}>查看</Button>
                                                }else if(status==="待批阅"){
                                                    return <Button onClick={()=>this.goToFinishHomeworkPage(item)}>重新编辑</Button>
                                                }else if(status==="待完成"){
                                                    return <Button onClick={()=>this.goToFinishHomeworkPage(item)}>编辑</Button>
                                                }
                                            })()
                                            }
                                        </div>]
                                    }>
                                        <div>开始时间:{moment(item.beginTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                        <div>结束时间:{moment(item.endTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                        <div>总分:{item.homeworkLib.totalScore}分</div>
                                        <div>状态:{status}</div>
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