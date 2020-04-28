import React from "react";
import {withRouter} from "react-router";
import {Button, Card, Col, DatePicker, Form, InputNumber, message, Modal, Row, Select, Space, Table} from "antd";
import moment from "moment";
import Request from "../../../api";
import {ArrowLeftOutlined, DownloadOutlined} from "@ant-design/icons";
import queryString from "querystring";
const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
class ExamComponent extends React.Component{
    columns=[
        {title: '帐号', dataIndex: ['user','email'],width:"20%",align:'center'},
        {title: '姓名', dataIndex: ['user','realName'],width:"10%",align:'center'},
        {title:'学号',dataIndex:['user','number'],width:"10%",align:'center'},
        {title:'总分',dataIndex:'totalScore',width:"10%",align:'center'},
        {title:'开考时间',dataIndex:'startTime',width:"20%",align:'center',
            render:(text)=>{
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {title:'完成时间',dataIndex:'finishTime',width:"20%",align:'center',
            render:(text)=>{
                if(text==null) return "截止时间";
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {title:'状态',dataIndex:'mark',width:"10%",align:'center',
            render:(text)=>{
                if(text===0) return <span style={{color:"red"}}>未批阅</span>;
                else if(text===1) return <span>已批阅</span>
            }
        },
        {title:'操作',key:'action',width:"20%",align:'center',
            render: (text,record) => {
                    return (
                        <Button style={{padding:0}} type="link"
                                onClick={()=>this.goToMarkExam(record)}>
                            {record.mark===0?"批阅":"重新批阅"}
                        </Button>
                    )
            },
        }
    ];
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.updatedExamPublish={};//要更新的发布数据
        this.state={
            examPublishData:[],
            examSubmitData:[],
            classData:[],//有哪些班级
            selectedValue:undefined,//选择的班级
            republishExamModal:false,
            submitRecordVisible:false,
        }
    }
    goToMarkExam=(record)=>{
        this.props.history.push({
            pathname:"/markExam",
            search:`examSubmitId=${record.ID}`,
        });
    };
    setExamPublishId=()=>{
        let search = this.props.location.search;
        if(search!=="") {
            this.examPublishId = queryString.parse(search.slice(1)).examPublishId;
            return this.examPublishId
        }
    };
    onRepublishFormFinish=async (values)=>{
        let publish={
            id:this.updatedExamPublish.ID,
            duration:values.duration,
            beginTime:values.range[0].format(),
            endTime:values.range[1].format(),
        };
        try{
            await Request.updateExamPublishById(publish);
            this.cancelRepublishExamModal();
            this.loadExamPublishData(this.state.selectedValue);
            message.success("更新成功")
        }catch (e) {
            message.error("更新失败");
        }

    };
    showRepublishExamModal=(record)=>{
        let range=new Array(2);
        range[0]=moment(record.beginTime);
        range[1]=moment(record.endTime);
        this.updatedExamPublish={...record,range:range};
        this.setState({republishExamModal:true});
    };
    cancelRepublishExamModal=()=>{
        this.setState({republishExamModal:false});
    };
    loadClassData=async ()=>{
        try{
            const result = await Request.getClassesByCourseId(this.courseId);
            if(result.length!==0){

                this.setState({classData:result,selectedValue:result[0].ID});
                this.loadExamPublishData(result[0].ID);
            }
        }catch (e) {
            console.log(e);
        }
    };
    loadExamPublishData=async (classId)=>{
        try{
            const result=await Request.getExamPublishesByClassId(classId);
            this.setState({examPublishData:result})
        }catch (e) {
            console.log(e);
        }
    };
    loadExamSubmitData=async (examPublishId)=>{
        try{
            const result = await Request.getExamSubmitsByPublishId(examPublishId);
            this.setState({examSubmitData:result});
        }catch (e) {
            console.log(e);
        }
    };
    showExamSubmitRecord=(examPublish)=>{
        this.props.history.push({pathname:"exam",search:`examPublishId=${examPublish.ID}`});
    };
    cancelExamSubmitRecord=()=>{
        this.props.history.push({pathname:"exam"});
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.location !== prevProps.location){//根据路由变化决定显示发布的作业数据页面还是具体的提交数据页面
            this.setSubmitRecordVisible();
        }
    }
    componentDidMount() {
        this.loadClassData();
        this.setSubmitRecordVisible();
    }
    setSubmitRecordVisible=()=>{//提交的作业记录表格是否可见
        if(this.setExamPublishId()){
            this.setState({submitRecordVisible:true});
            this.loadExamSubmitData(this.examPublishId);
        }else{
            this.setState({submitRecordVisible:false});
        }
    };
    onSelectChange=(value)=>{
        this.loadExamPublishData(value);
    };
    downloadExamExcel=async ()=>{
      try{
          await Request.exportExamToExcel(this.examPublishId)
      }catch (e) {
          message.error("下载出错");
      }
    };
    getSummary=(pageData)=>{
        if(pageData.length===0)return null;
        let scoreArr=[];
        pageData.forEach(({totalScore})=>{
            scoreArr.push(totalScore);
        });
        let min=scoreArr[0];let max=scoreArr[0];let average=0;
        scoreArr.forEach((item)=>{
            min=Math.min(min,item);
            max=Math.max(max,item);
            average=average+item;
        });
        average=average/scoreArr.length;
        return (
            <React.Fragment>
                <tr>
                    <th>统计</th>
                    <td>最低分</td>
                    <td>{min}分</td>
                    <td>最高分</td>
                    <td>{max}分</td>
                    <td>平均分</td>
                    <td>{average}分</td>
                    <td/>
                </tr>
            </React.Fragment>
        )
    };
    render() {
        const examPublishList=(
            <div>
                <Modal title="重设发放" onCancel={this.cancelRepublishExamModal} destroyOnClose={true}
                       visible={this.state.republishExamModal} footer={null}>
                    <Form initialValues={this.updatedExamPublish} name="republish-examLib" onFinish={this.onRepublishFormFinish} {...formItemLayout}>
                        <Form.Item name="duration" label="考试时间" rules={[{required: true,message: '请输入时间'},]}>
                            <InputNumber min={10} />
                        </Form.Item>
                        <Form.Item label="起止时间" name="range" rules={[{ type: 'array', required: true, message: '请选择时间'}]}>
                            <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <div style={{marginBottom:10}}>
                    <Select placeholder="请选择班级" style={{width:150}} value={this.state.selectedValue}  onChange={this.onSelectChange}>
                        {
                            this.state.classData.map((item)=>{
                                return (
                                    <Select.Option key={item.ID} value={item.ID}>{item.className}</Select.Option>
                                )
                            })
                        }
                    </Select>
                </div>
                <Row gutter={16}>
                    {
                        this.state.examPublishData.map((item)=>{
                            return (<Col span={8} key={item.ID}>
                                <Card title={item.examLib.name} actions={[
                                    <div style={{display:"flex",justifyContent:"space-between",paddingLeft:20,paddingRight:20}}>
                                        <span><span style={{fontSize:20,color:"red"}}>{item.unMarkCount}</span>份待批</span>
                                        <Space>
                                            <Button onClick={()=>this.showRepublishExamModal(item)}>重设发放</Button>
                                            <Button onClick={()=>this.showExamSubmitRecord(item)}>查看</Button>
                                        </Space>
                                    </div>]
                                }>
                                    <div>开始时间:{moment(item.beginTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                    <div>结束时间:{moment(item.endTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                    <div>考试时间:{item.duration}分钟</div>
                                    <div>提交人数:{item.submitCount}人</div>
                                </Card>
                            </Col>)
                        })
                    }
                </Row>
            </div>
        );
        const examSubmitRecord=(
            <div>
                <div style={{marginBottom:10}}>
                    <Button type="link" icon={<ArrowLeftOutlined/>} onClick={this.cancelExamSubmitRecord}>返回</Button>
                    <Button type="primary" icon={<DownloadOutlined/>} onClick={this.downloadExamExcel}>导出成绩到Excel</Button>
                </div>
                <Table bordered  columns={this.columns} dataSource={this.state.examSubmitData}
                       summary={this.getSummary}  pagination={false} rowKey={record=>record.ID}
                />
            </div>
        );
        return (
            this.state.submitRecordVisible?examSubmitRecord:examPublishList
        )
    }
}
export default withRouter(ExamComponent)