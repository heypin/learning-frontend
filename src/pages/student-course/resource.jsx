import React from "react";
import {Table,Button,message} from 'antd';
import { Resizable } from 'react-resizable';
import Request from "../../api";
import moment from "moment";
import folder from "../../assets/folder.png";
import queryString from "querystring";
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
        this.courseId = queryString.parse(props.location.search.slice(1)).courseId;
        this.parentId = 0;
        this.query=this.getQuery();
        this.state={
            columns:this.fileColumns,
            fileData:[],
        };
    };
    getQuery=()=>{
        const search=this.props.location.search;
        let courseId,classId=0;
        let query="";
        if(search!==""){
            let obj=queryString.parse(search.slice(1));
            courseId=obj.courseId;
            classId=obj.classId;
            query=`courseId=${courseId}&classId=${classId}`;
        }
        return query
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
                        <Button type="link" style={{marginRight:10}}
                                onClick={()=>{this.handleDownloadFile(record.ID)}}>
                            下载
                        </Button>
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

    loadFileData=async ()=>{
      try{
          let search = this.props.location.search;
          if(search!==""){
              this.parentId=queryString.parse(search.slice(1)).parentId;
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
        return (
            <div>
                <Table bordered  columns={columns} dataSource={this.state.fileData}
                       components={this.components} pagination={false}
                       rowKey={record=>record.ID}
                       onRow={(record)=> {
                           return {
                               onDoubleClick: event => {
                                   console.log(this.parentId,record.ID);
                                   if(record.localFilename===""){//代表是文件夹
                                       this.props.history.push({
                                           pathname:`/student-course/resource`,
                                           search:`${this.query}&parentId=${record.ID}`,
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