import React from "react";
import {Menu, Layout, message} from "antd";
import Request from "../../api"
import Constant from "../../utils/constant";
import queryString from 'querystring'
const {Sider,Content}= Layout;
export default class Home extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = queryString.parse(props.location.search.slice(1)).courseId;
        this.state= {
            chapters: [],
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
                let chapter=result[0];
                this.setState({selectedChapterId:chapter.ID,selectedVideoName:chapter.videoName});
            }else{
                this.setState({selectedVideoName:""})
            }
        }catch (e) {
            console.log(e);
            message.error("获取目录失败");
        }

    };
    onMenuItemClick=({item})=>{
        let chapter = item.props.record;
        this.setState({selectedChapterId:chapter.ID,selectedVideoName:chapter.videoName});
    };
    render() {
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
                <Content>
                    <div style={{width:"100%",height:"100%"}}>
                        {
                            this.state.selectedVideoName===""||this.state.selectedVideoName==null?
                                null:(
                                    <video width="75%"  controls style={{marginTop:10,marginLeft:10}}
                                           src={Constant.BaseVideo+this.state.selectedVideoName}/>
                                )
                        }
                    </div>
                </Content>
            </React.Fragment>
        )
    }
}