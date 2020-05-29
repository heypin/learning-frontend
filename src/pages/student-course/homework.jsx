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
        let now =moment();
        let beginTime=moment(item.beginTime);
        let endTime=moment(item.endTime);
        if(now.isBefore(beginTime)){
            return '未开始';
        }
        if(item.submitRecord.ID===0){//已开始但没有提交记录
            if(now.isAfter(endTime)) {
                return '已过期';
            } else {
                return '待完成';
            }
        }else{
            if(item.submitRecord.mark===1){//已开始已做且被批改
                return '已完成';
            }else{//已开始已做未被批改
                if(now.isBefore(endTime) && item.resubmit===1) {//未到截止日期且允许重复提交
                    return '可重新编辑';
                }else{
                    return "待批阅"
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
                                                if(status==="未开始"||status==="待批阅"){
                                                    return <Button disabled={true}>{status}</Button>
                                                }else if(status==="已完成"||status==="已过期"){
                                                    return <Button onClick={()=>this.goToViewHomeworkPage(item)}>查看</Button>
                                                }else if(status==="可重新编辑"){
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