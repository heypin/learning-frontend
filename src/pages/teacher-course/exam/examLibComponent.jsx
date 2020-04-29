import React from "react";
import moment from "moment";
import {Button, Divider, Form, Input, message, Modal, Space, Table, Upload} from "antd";
import Request from "../../../api";
import {withRouter} from "react-router";
import PublishExamForm from "./publish-exam-form";
import {UploadOutlined} from "@ant-design/icons";
const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
class ExamLibComponent extends React.Component{
    columns=[
        {title: '试卷标题', dataIndex: 'name',width:"30%"},
        {title: '创建时间', dataIndex: 'CreatedAt',width:"20%",align:'center',
            render:(text)=>{
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {title:'题目数量',dataIndex:'subjectCount',width:"10%",align:'center'},
        {title:'总分',dataIndex:'totalScore',width:"10%",align:'center'},
        {title:'操作',key:'action',width:"30%",align:'center',
            render: (text,record) => {
                return (
                    <Space size={2}>
                        <Button style={{padding:0}} type="link"
                                onClick={()=>this.showRenameModal(record)}>
                            重命名
                        </Button>
                        <Divider type="vertical" />
                        <Button style={{padding:0}} type='link'
                                onClick={()=>this.goToEditExamLib(record)}>
                            编辑
                        </Button>
                        <Divider type="vertical" />
                        <Button style={{padding:0}} type='link'
                                onClick={()=>this.showImportLibModal(record)}>
                            从Excel中导入试题
                        </Button>
                        <Divider type="vertical" />
                        <Button style={{padding:0}} disabled={record.subjectCount===0} type='link'
                                onClick={()=>this.showPublishLibModal(record)}>
                            发布考试
                        </Button>
                    </Space>
                )
            },
        }
    ];
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.updatedLib={name:""};//要更新的库
        this.state={
            examLibData:[],
            renameModal:false,
            createLibModal:false,
            publishLibModal:false,

            importLibModal:false,
            uploading:false,
            fileList:[],
        };
    }
    componentDidMount() {
        this.loadExamLibData();
    }
    goToEditExamLib=(record)=>{
        let query = `courseId=${this.courseId}&examLibId=${record.ID}`;
        this.props.history.push({pathname:"/editor",search:query});
    };
    showRenameModal=(record)=>{
        this.setState({renameModal:true});
        this.updatedLib=record;
    };
    cancelRenameModal=()=>{
        this.setState({renameModal:false});
    };
    renameExamLib=async (values)=>{
        try{
            await Request.updateExamLibNameById({id:this.updatedLib.ID,name:values.name});
            message.success("已更新");
            this.cancelRenameModal();
            this.loadExamLibData();
        }catch (e) {
            message.error("操作失败");
        }
    };

    showPublishLibModal=(record)=>{
        this.publishedExamLibId=record.ID;
        this.setState({publishLibModal:true})
    };
    cancelPublishLibModal=()=>{
        this.setState({publishLibModal:false})
    };
    publishExam=async (values)=>{
        values={...values,examLibId:this.publishedExamLibId};
        try{
            const result = await Request.publishExam(values);
            if(result.code===202){
                message.info("该班级已发布过,不能重复发布")
            }else{
                message.success("发布成功");
                this.cancelPublishLibModal();
            }
        }catch (e) {
            message.error("发布失败");
        }
    };
    loadExamLibData=async ()=>{
        try{
            const result = await Request.getExamLibsByCourseId(this.courseId);
            this.setState({examLibData:result})
        }catch (e) {
            message.error("获取数据失败");
        }
    };

    beforeUpload = () => {
        return false;
    };
    onRemove = () => {
        this.setState({fileList:[]});
    };
    handleUploadChange=(info)=>{
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        this.setState({fileList:fileList});
    };
    showImportLibModal=(record)=>{
        this.setState({importLibModal:true});
        this.updatedLib=record;
    };
    cancelImportLibModal=()=>{
        this.setState({importLibModal:false});
    };
    importLibFormExcel=async ()=>{
        const { fileList } = this.state;
        const formData = new FormData();
        if(fileList.length!==0){
            formData.append('excel', fileList[0].originFileObj);
        }
        formData.append('libId',this.updatedLib.ID);
        formData.append('type',"exam");
        this.setState({uploading: true,});
        try {
            await Request.importExcelSubjectToLib(formData);
            this.setState({
                uploading: false,
                fileList: [],
                importLibModal:false,
            });
            message.success("导入题库成功");
            this.loadExamLibData();
        }catch (e) {
            let err="";
            if(e.response.data.err){
                err=e.response.data.err;
            }
            message.error("导入失败!"+err);
            this.setState({uploading:false});
        }
    };
    downloadExcelExample=async ()=>{
        try{
            await Request.downloadExcelExample();
        }catch (e) {
            message.error("下载出错");
        }
    };
    render() {
        return (
            <div>
                <Modal title="重命名" destroyOnClose={true} onCancel={this.cancelRenameModal}
                       visible={this.state.renameModal} footer={null}>
                    <Form name="rename-lib" onFinish={this.renameExamLib} {...formItemLayout}>
                        <Form.Item name="name" label="名称"  rules={[{required: true,message: '请输入名称!'},]}>
                            <Input  />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="导入试题" destroyOnClose={true} onCancel={this.cancelImportLibModal}
                       visible={this.state.importLibModal} footer={null}>
                    <Upload  listType="picture" multiple={false} onChange={this.handleUploadChange}
                             onRemove={this.onRemove}
                             beforeUpload={this.beforeUpload} fileList={this.state.fileList}>
                        <Button>
                            <UploadOutlined /> 选择Excel文件
                        </Button>
                    </Upload>
                    <Button type="primary" onClick={this.importLibFormExcel}
                            disabled={this.state.fileList.length===0} loading={this.state.uploading}
                            style={{ marginTop: 16 }}
                    >
                        {this.state.uploading ? '上传中' : '开始上传'}
                    </Button>
                </Modal>
                <Modal title="发布考试" onCancel={this.cancelPublishLibModal}
                       visible={this.state.publishLibModal} footer={null}>
                    <PublishExamForm courseId={this.courseId} onFinish={this.publishExam}/>
                </Modal>
                <Button style={{marginBottom:10}} onClick={this.downloadExcelExample} type="primary">下载导入题库的Excel模板</Button>
                <Table bordered  columns={this.columns} dataSource={this.state.examLibData}
                       pagination={false} rowKey={record=>record.ID}
                />
            </div>
        )
    }
}
export default withRouter(ExamLibComponent)