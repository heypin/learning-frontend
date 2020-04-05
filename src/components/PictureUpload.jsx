import React from "react";
import {Modal,Upload, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
export default class PictureUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            fileList:[],
            previewVisible: false,
            previewImage: '',
        };
        this.props.fileList(this.getFileList)
    };
    getFileList=()=>{
      return this.state.fileList;
    };
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };
    handleCancelPreview = () => this.setState({ previewVisible: false });
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    beforeUpload=(file)=>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片必须小于2MB!');
        }
        if(isJpgOrPng && isLt2M){
            let list = [{...file,originFileObj:file}];
            this.setState({fileList:list});
        }else {
            this.setState({fileList:[]});
        }
        return false;
    };
    onRemove=(file) => {
        this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {fileList: newFileList,};
        });
    };
    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        return (
            <div>
                <Upload listType="picture-card"
                        fileList={fileList}
                        beforeUpload={this.beforeUpload}
                        onPreview={this.handlePreview}
                        onRemove={this.onRemove}
                >
                    {fileList.length >= 1 ? null : <div>
                        <PlusOutlined />
                        <div className="ant-upload-text">Upload</div>
                    </div>}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}