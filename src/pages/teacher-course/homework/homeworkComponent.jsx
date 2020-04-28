import React from "react";
import {withRouter} from "react-router";
import {Button, Card, Col, DatePicker, Form, message, Modal, Row, Select, Space, Switch, Table} from "antd";
import moment from "moment";
import Request from "../../../api";
import {ArrowLeftOutlined, DownloadOutlined} from "@ant-design/icons";
import queryString from "querystring";

const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
class HomeworkComponent extends React.Component{
    columns=[
        {title: '帐号', dataIndex: ['user','email'],width:"15%",align:'center'},
        {title: '姓名', dataIndex: ['user','realName'],width:"10%",align:'center'},
        {title:'学号',dataIndex:['user','number'],width:"15%",align:'center'},
        {title:'总分',dataIndex:'totalScore',width:"10%",align:'center'},
        {title:'首次提交时间',dataIndex:'CreatedAt',width:"15%",align:'center',
            render:(text)=>{
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {title:'更新时间',dataIndex:'UpdatedAt',width:"15%",align:'center',
            render:(text)=>{
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
                if (record.mark===0){
                    return (
                        <Button style={{padding:0}} type="link"
                                onClick={()=>this.goToMarkHomework(record)}>
                            批阅
                        </Button>
                    )
                }else{
                    return (
                        <Space size={2}>
                            <Button style={{padding:0}} type="link"
                                    onClick={()=>this.cancelMarkHomework(record)}>
                                打回
                            </Button>
                            <Button style={{padding:0}} type="link"
                                    onClick={()=>this.goToMarkHomework(record)}>
                                重新批阅
                            </Button>
                        </Space>
                    )
                }
            },
        }
    ];
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.updatedHomeworkPublish={};//要更新的发布数据
        this.state={
            homeworkPublishData:[],
            homeworkSubmitData:[],
            classData:[],//有哪些班级
            selectedValue:undefined,//选择的班级
            republishHomeworkModal:false,
            submitRecordVisible:false,
        }
    }
    goToMarkHomework=(record)=>{
        this.props.history.push({
            pathname:"/markHomework",
            search:`homeworkSubmitId=${record.ID}`,
        });
    };
    cancelMarkHomework=async (record)=>{
        try{
            await Request.updateHomeworkSubmitMarkById({id:record.ID,mark:0});
            message.success("操作成功");
            this.loadHomeworkSubmitData(record.homeworkPublishId);
        }catch (e) {
            console.log(e);
        }
    };
    setHomeworkPublishId=()=>{
        let search = this.props.location.search;
        if(search!=="") {
             this.homeworkPublishId = queryString.parse(search.slice(1)).homeworkPublishId;
             return this.homeworkPublishId
        }
    };
    onRepublishFormFinish=async (values)=>{
        let publish={
            id:this.updatedHomeworkPublish.ID,
            resubmit:values.resubmit === true ? 1 : 0,
            beginTime:values.range[0].format(),
            endTime:values.range[1].format(),
        };
        try{
            await Request.updateHomeworkPublishById(publish);
            this.cancelRepublishHomeworkModal();
            this.loadHomeworkPublishData(this.state.selectedValue);
            message.success("更新成功")
        }catch (e) {
            message.error("更新失败");
        }

    };
    showRepublishHomeworkModal=(record)=>{
        let range=new Array(2);
        let resubmit=record.resubmit===1;
        range[0]=moment(record.beginTime);
        range[1]=moment(record.endTime);
        this.updatedHomeworkPublish={...record,resubmit:resubmit,range:range};
        this.setState({republishHomeworkModal:true});
    };
    cancelRepublishHomeworkModal=()=>{
        this.setState({republishHomeworkModal:false});
    };
    loadClassData=async ()=>{
      try{
          const result = await Request.getClassesByCourseId(this.courseId);
          if(result.length!==0){

              this.setState({classData:result,selectedValue:result[0].ID});
              this.loadHomeworkPublishData(result[0].ID);
          }
      }catch (e) {
          console.log(e);
      }
    };
    loadHomeworkPublishData=async (classId)=>{
        try{
            const result=await Request.getHomeworkPublishesByClassId(classId);
            this.setState({homeworkPublishData:result})
        }catch (e) {
            console.log(e);
        }
    };
    loadHomeworkSubmitData=async (homeworkPublishId)=>{
        try{
            const result = await Request.getHomeworkSubmitsByPublishId(homeworkPublishId);
            this.setState({homeworkSubmitData:result});
        }catch (e) {
            console.log(e);
        }
    };
    showHomeworkSubmitRecord=(homeworkPublish)=>{
        this.props.history.push({pathname:"homework",search:`homeworkPublishId=${homeworkPublish.ID}`});
    };
    cancelHomeworkSubmitRecord=()=>{
        this.props.history.push({pathname:"homework"});
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.location !== prevProps.location){//根据路由变化决定显示发布的作业数据页面还是具体的提交数据页面
            this.setSubmitRecordVisible();
        }
    };
    componentDidMount() {
        this.loadClassData();
        this.setSubmitRecordVisible();
    };
    downloadHomeworkExcel=async ()=>{
        try{
            await Request.exportHomeworkToExcel(this.homeworkPublishId);
        }catch (e) {
            message.error("下载出错");
        }
    };
    setSubmitRecordVisible=()=>{//提交的作业记录表格是否可见
        if(this.setHomeworkPublishId()){
            this.setState({submitRecordVisible:true});
            this.loadHomeworkSubmitData(this.homeworkPublishId);
        }else{
            this.setState({submitRecordVisible:false});
        }
    };
    onSelectChange=(value)=>{
        this.loadHomeworkPublishData(value);
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
        const homeworkPublishList=(
            <div>
                    <Modal title="重设发放" onCancel={this.cancelRepublishHomeworkModal} destroyOnClose={true}
                           visible={this.state.republishHomeworkModal} footer={null}>
                        <Form initialValues={this.updatedHomeworkPublish} name="republish-homeworkLib" onFinish={this.onRepublishFormFinish} {...formItemLayout}>
                            <Form.Item name="resubmit" label="重复提交" valuePropName="checked">
                                <Switch/>
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
                            this.state.homeworkPublishData.map((item)=>{
                                return (<Col span={8} key={item.ID}>
                                    <Card title={item.homeworkLib.name} actions={[
                                        <div style={{display:"flex",justifyContent:"space-between",paddingLeft:20,paddingRight:20}}>
                                            <span><span style={{fontSize:20,color:"red"}}>{item.unMarkCount}</span>份待批</span>
                                            <Space>
                                                <Button onClick={()=>this.showRepublishHomeworkModal(item)}>重设发放</Button>
                                                <Button onClick={()=>this.showHomeworkSubmitRecord(item)}>查看</Button>
                                            </Space>
                                        </div>]
                                    }>
                                        <div>开始时间:{moment(item.beginTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                        <div>结束时间:{moment(item.endTime).format("YYYY-MM-DD HH:mm:ss")}</div>
                                        <div>提交人数:{item.submitCount}人</div>
                                    </Card>
                                </Col>)
                            })
                        }
                    </Row>
                </div>
        );
        const homeworkSubmitRecord=(
            <div>
                <div style={{marginBottom:10}}>
                    <Button type="link" icon={<ArrowLeftOutlined/>} onClick={this.cancelHomeworkSubmitRecord}>返回</Button>
                    <Button type="primary" icon={<DownloadOutlined/>} onClick={this.downloadHomeworkExcel}>导出成绩到Excel</Button>
                </div>
                <Table bordered  columns={this.columns} dataSource={this.state.homeworkSubmitData}
                       summary={this.getSummary}  pagination={false} rowKey={record=>record.ID}
                />
            </div>
        );
        return (
            this.state.submitRecordVisible?homeworkSubmitRecord:homeworkPublishList
        )
    }
}
export default withRouter(HomeworkComponent)