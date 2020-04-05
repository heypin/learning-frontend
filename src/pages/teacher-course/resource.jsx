import React from "react";
import {Table, Popconfirm, Button, Modal, Form, Input,Upload,message} from 'antd';
import { Resizable } from 'react-resizable';
import { UploadOutlined } from '@ant-design/icons';
import './teacher-course.less'
import Request from "../../api";
import moment from "moment";
import folder from "../../assets/folder.png"
const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;
    if (!width) {return <th {...restProps} />;}
    return (
        <Resizable width={width} height={0} onResize={onResize}
                   handle={resizeHandle => (
                <span className={`react-resizable-handle react-resizable-handle-${resizeHandle}`}
                    onClick={e => {e.stopPropagation();}}/>
            )}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

export default class Resource extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.parentId = 0;
        this.state={
            columns:this.fileColumns,
            newFolderVisible:false,
            newFileVisible:false,
            fileList: [],
            uploading: false,
            fileData:[],
        };
    };
    componentDidMount() {
        this.loadFileData();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.location !== prevProps.location){//路由变化重新载入文件数据
            this.loadFileData();
        }

    }

    fileColumns=[
        {width: 600, title: '文件名', dataIndex: 'filename',
            render:(text,record)=>{
                if(record.localFilename===''){
                    return (
                        <React.Fragment>
                            <img style={{width:32,height:32}} alt='folder' src={folder}/>
                            <span style={{marginLeft:5}}>{text}</span>
                        </React.Fragment>
                    )
                }else{
                    return text;
                }
            }
        },
        {width: 300, title: '创建日期', dataIndex: 'CreatedAt', align: 'center',
            render: (text) => {return moment(text).format('YYYY-MM-DD HH:mm:ss');},
        },
        {width:200,title:'大小',dataIndex:'size',align:'center',
            render:(text)=>{
                let size=parseInt(text);
                if(size===0){return ""}
                else if(size<1000){return size+"B"}
                else if(size<1000*1000) {size=size/1000;return size+"KB";}
                else if(size<1000*1000*1000){size=size/1000/1000;return size+"MB";}
                else{size=size/1000/1000/1000;return size+"GB";}
            }
        },
        {
            title: '操作', key: 'action',
            render: (text,record) => {
                if(record.localFilename!==""){
                    return (
                        <React.Fragment>
                            <Button type="link" style={{marginRight:10}} onClick={()=>{this.handleDownloadFile(record.ID)}}>下载</Button>
                            <Popconfirm title="确定删除" onConfirm={() => {this.handleDeleteFile(record.ID)}}>
                                <Button type="link">删除</Button>
                            </Popconfirm>
                        </React.Fragment>
                    )
                }else{
                    return (
                        <Popconfirm title="确定删除" onConfirm={() => {this.handleDeleteFile(record.ID)}}>
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    )
                }

            },
        },
    ];

    handleDownloadFile=async (id)=>{
        try{
            await Request.downloadFile(id);

        }catch (e) {
            message.error("下载出错");
        }

    };
    handleDeleteFile=async (id)=>{
        try{
            await Request.deleteFile(id);
            message.success("删除成功");
            this.loadFileData();
        }catch (e) {
            message.error("删除失败")
        }

    };
    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };
    showNewFolderModal=()=>{this.setState({newFolderVisible:true});};
    showNewFileModal=()=>{this.setState({newFileVisible:true,});};
    handleNewFolderCancel=()=>{this.setState({newFolderVisible:false});};
    handleNewFileCancel=()=>{this.setState({newFileVisible:false,fileList:[]});};
    handleCreateFolder=async (values)=>{
        try{
            let file = {folderName:values.folderName,courseId:this.courseId,parentId:this.parentId};
            console.log(file);
            await Request.createFolder(file);
            this.handleNewFolderCancel();
            this.loadFileData();
            message.success("创建成功");
        }catch (e) {
            message.error("创建失败");
        }
    };
    handleCreateNewFile=async ()=>{
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file[]', file);
        });
        formData.append("courseId",this.courseId);
        formData.append("parentId",this.parentId);
        this.setState({
            uploading: true,
        });
        try{
            await Request.createFile(formData);
            this.setState({uploading:false});
            this.handleNewFileCancel();
            this.loadFileData();
            message.success("上传成功");
        }catch (e) {
            message.error("上传失败");
        }
    };
    loadFileData=async ()=>{
      try{
          let search = this.props.location.search;
          if(search!==""){
              this.parentId=parseInt(search.split("=").pop());
          }else {
              this.parentId = 0;
          }
          let result = await Request.getChildFile({courseId:this.courseId,parentId:this.parentId});
          result = this.sortFileData(result);
          this.setState({fileData:result});

      }catch (e) {
          message.error("获取文件数据失败");
      }
    };

    onRemove = (file) => {
        this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
                fileList: newFileList,
            };
        });
    };
    beforeUpload = file => {
        this.setState(state => ({
            fileList: [...state.fileList, file],
        }));
        return false;
    };
    sortFileData(fileData){//使文件夹靠前
        let folder=[];
        let file =[];
        fileData.forEach((item)=>{
            if(item.localFilename===""){
                folder.push(item);
            }else {
                file.push(item);
            }
        });
        fileData=folder.concat(file);
        return fileData;
    };
    components = {
        header: {
            cell: ResizeableTitle,
        },
    };
    render() {
        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));
        const formItemLayout = {
            labelCol: {span:4},
            wrapperCol: {span:16},
        };
        const tailFormItemLayout = {
            wrapperCol: {span:16,offset:4},
        };
        const {fileList,uploading} = this.state;
        return (
            <div>
                <div style={{height:50,display:"flex",alignItems:"center",justifyContent:"flex-end"}}>
                    <div style={{marginRight:10}}>
                        <Button type="primary" onClick={this.showNewFolderModal}>
                            创建文件夹
                        </Button>
                        <Modal title="创建文件夹" onCancel={this.handleNewFolderCancel}
                               visible={this.state.newFolderVisible} footer={null}>
                            <Form name="create-folder" onFinish={this.handleCreateFolder}{...formItemLayout}>
                                <Form.Item name="folderName" label="名称"  rules={[{required: true,message: '请输入文件夹名!'},]}>
                                    <Input  />
                                </Form.Item>
                                <Form.Item {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                                        确认创建
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </div>
                    <div style={{marginRight:10}}>
                        <Button type="primary" onClick={this.showNewFileModal}>
                            添加文件
                        </Button>
                        <Modal title="上传文件" onCancel={this.handleNewFileCancel}
                               visible={this.state.newFileVisible} footer={null}>
                            <Upload onRemove={this.onRemove} beforeUpload={this.beforeUpload} listType="picture">
                                <Button>
                                    <UploadOutlined /> 选择文件
                                </Button>
                            </Upload>
                            <Button type="primary" onClick={this.handleCreateNewFile}
                                disabled={fileList.length === 0} loading={uploading}
                                style={{ marginTop: 16 }}
                            >
                                {uploading ? '上传中' : '开始上传'}
                            </Button>
                        </Modal>
                    </div>
                </div>
                <Table bordered  columns={columns} dataSource={this.state.fileData}
                       components={this.components} pagination={false}
                       rowKey={record=>record.ID}
                       onRow={(record)=> {
                           return {
                               onDoubleClick: event => {
                                   console.log(this.parentId,record.ID);
                                   if(record.localFilename===""){//代表是文件夹
                                       this.props.history.push({
                                           pathname:`/teacher-course/${this.courseId}/resource`,
                                           search:`?parentId=${record.ID}`,
                                       });
                                   }
                               },
                           };
                       }}
                />
            </div>
        )
    };

};