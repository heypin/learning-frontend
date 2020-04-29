import React from "react";
import {Menu, Layout, message, Button, Form, Input, Modal, Popconfirm, Upload} from "antd";
import Request from "../../api"
import {UploadOutlined} from "@ant-design/icons";
import Constant from "../../utils/constant";
const {Sider,Content}= Layout;
export default class Home extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.state= {
            chapters: [],
            addChapterModal: false,
            updateChapterModal: false,
            uploadVideoModal: false,
            uploading: false,
            fileList:[],
            selectedChapterId:0,
            selectedVideoName:"",
        };
    };
    componentDidMount() {
        this.loadChapterData();
    }
    loadChapterData=async ()=>{
        try{
            const result = await Request.getChapterByCourseId(this.courseId);
            this.setState({chapters:result});
            if(result.length!==0){
                if(this.state.selectedChapterId===0){
                    let chapter=result[0];
                    this.setState({
                        selectedChapterId:chapter.ID,
                        selectedVideoName:chapter.videoName,
                    });
                }else{
                    result.forEach((item)=>{
                        if(item.ID===this.state.selectedChapterId){
                            this.setState({selectedVideoName:item.videoName})
                        }
                    })
                }
            }else {
                this.setState({selectedChapterId:0,selectedVideoName:""})
            }

        }catch (e) {
            message.error("获取目录失败");
        }
    };
    addChapter= async (values)=>{
        try{
            await Request.createChapter({
                courseId:this.courseId,
                chapterName:values.chapterName
            });
            this.setState({addChapterModal:false});
            this.loadChapterData();
        }catch (e) {
            message.error("创建失败");
        }

    };
    updateChapterName=async (values)=>{
        try{
            await Request.updateChapterName({
                id:this.state.selectedChapterId,
                chapterName:values.chapterName
            });
            this.setState({updateChapterModal:false});
            this.loadChapterData();
        }catch (e) {
            message.error("修改目录失败");
        }
    };
    updateChapterVideo=async ()=>{
        const { fileList } = this.state;
        const formData = new FormData();
        if(fileList.length!==0){
            formData.append('video', fileList[0].originFileObj);
        }
        formData.append('id',this.state.selectedChapterId);
        this.setState({uploading: true,});
        try {
            await Request.updateChapterVideo(formData);
            this.setState({
                uploading: false,
                fileList: [],
                uploadVideoModal:false,
            });
            message.success("上传视频成功");
            this.loadChapterData();
        }catch (e) {
            message.error("上传视频失败");
            this.setState({uploading:false});
        }
    };
    onMenuItemClick=({item})=>{
        let chapter = item.props.record;
        this.setState({
            selectedChapterId:chapter.ID,
            selectedVideoName:chapter.videoName,
        });
    };

    deleteChapterVideo=async ()=>{
        try{
            await Request.deleteChapterVideoById(this.state.selectedChapterId);
            message.success("删除视频成功");
            this.loadChapterData();
        }catch (e) {
            message.error("删除视频失败");
        }
    };
    deleteChapter=async ()=>{
        try{
            await Request.deleteChapterById(this.state.selectedChapterId);
            this.setState({selectedChapterId:0});
            message.success("删除目录成功");
            this.loadChapterData();
        }catch (e) {
            message.error("删除目录失败");
        }
    };
    cancelAddChapterModal=()=>{this.setState({addChapterModal:false})};
    showAddChapterModal=()=>{this.setState({addChapterModal:true})};
    cancelUpdateChapterModal=()=>{this.setState({updateChapterModal:false})};
    showUpdateChapterModal=()=>{this.setState({updateChapterModal:true})};
    cancelUploadVideoModal=()=>{this.setState({uploadVideoModal:false})};
    showUploadVideoModal=()=>{this.setState({uploadVideoModal:true})};

    beforeUpload = () => {
        return false;
    };
    onRemove = () => {
        this.setState({fileList:[]});
    };
    handleChange=(info)=>{
        let fileList = [...info.fileList];
        fileList = fileList.slice(-1);
        this.setState({fileList:fileList});
    };

    render() {
        const formItemLayout = {
            labelCol: {span:4},
            wrapperCol: {span:16},
        };
        const tailFormItemLayout = {
            wrapperCol: {span:16,offset:4},
        };
        return (
            <React.Fragment>
                <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                    <Menu theme="light" mode="inline" onClick={this.onMenuItemClick}
                          selectedKeys={[this.state.selectedChapterId.toString()]}>
                        {this.state.chapters.map((item)=>{return (
                                    <Menu.Item key={item.ID} record={item}>
                                        <span className="nav-text">{item.chapterName}</span>
                                    </Menu.Item>
                        )})}
                    </Menu>
                </Sider>
                <Content className="content">
                    <div>
                        <div style={{display:"flex",justifyContent:"flex-end"}}>
                            <div>
                                <Button type="primary" style={{margin:5}}  onClick={this.showAddChapterModal}>添加目录</Button>
                                <Modal title="添加目录" onCancel={this.cancelAddChapterModal}
                                       visible={this.state.addChapterModal} footer={null}>
                                    <Form name="create-chapter" onFinish={this.addChapter} {...formItemLayout}>
                                        <Form.Item name="chapterName" label="名称"  rules={[{required: true,message: '请输入名称!'},]}>
                                            <Input  />
                                        </Form.Item>
                                        <Form.Item {...tailFormItemLayout}>
                                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                            <div>
                                <Button type="primary" style={{margin:5}} disabled={this.state.chapters.length===0} onClick={this.showUpdateChapterModal}>修改名称</Button>
                                <Modal title="修改目录名" onCancel={this.cancelUpdateChapterModal}
                                       visible={this.state.updateChapterModal} footer={null}>
                                    <Form name="update-chapter" onFinish={this.updateChapterName}{...formItemLayout}>
                                        <Form.Item name="chapterName" label="名称"  rules={[{required: true,message: '请输入目录名!'},]}>
                                            <Input  />
                                        </Form.Item>
                                        <Form.Item {...tailFormItemLayout}>
                                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                                                确认修改
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                            <div>
                                <Button type="primary" style={{margin:5}} onClick={this.showUploadVideoModal}
                                        disabled={this.state.chapters.length===0||
                                        (this.state.selectedVideoName!=null&&
                                        this.state.selectedVideoName!=="")}>
                                    上传视频
                                </Button>
                                <Modal title="上传视频" onCancel={this.cancelUploadVideoModal}
                                       visible={this.state.uploadVideoModal} footer={null}>
                                    <Upload  listType="picture" multiple={false} onChange={this.handleChange}
                                             onRemove={this.onRemove}
                                            beforeUpload={this.beforeUpload} fileList={this.state.fileList}>
                                        <Button>
                                            <UploadOutlined /> 选择视频
                                        </Button>
                                    </Upload>
                                    <Button type="primary" onClick={this.updateChapterVideo}
                                            disabled={this.state.fileList.length===0} loading={this.state.uploading}
                                            style={{ marginTop: 16 }}
                                    >
                                        {this.state.uploading ? '上传中' : '开始上传'}
                                    </Button>
                                </Modal>
                            </div>
                            <Popconfirm title="确定删除视频" placement={"bottom"} onConfirm={() => {this.deleteChapterVideo()}}>
                                <Button type="primary" style={{margin:5}}
                                        disabled={this.state.chapters.length===0||
                                        this.state.selectedVideoName===""||
                                        this.state.selectedVideoName==null} >
                                    删除视频
                                </Button>
                            </Popconfirm>
                            <Popconfirm title="确定删除目录" placement={"bottom"} onConfirm={() => {this.deleteChapter()}}>
                                <Button type="primary" disabled={this.state.chapters.length===0} style={{margin:5}}>删除目录</Button>
                            </Popconfirm>
                        </div>
                        <div style={{width:"100%",height:"100%"}}>
                                {
                                    this.state.selectedVideoName===""||this.state.selectedVideoName==null?
                                        null:(
                                        <video width="75%"  controls style={{marginTop:10,marginLeft:10}}
                                               src={Constant.BaseVideo+this.state.selectedVideoName}/>
                                    )
                                }
                        </div>
                    </div>
                </Content>
            </React.Fragment>
        )
    }
}