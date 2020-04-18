import React from "react";
import {Avatar, Button, Card, Comment, Empty, List, message, Popconfirm} from "antd";
import Constant from "../../../utils/constant";
import moment from "moment";
import Request from "../../../api";
import queryString from "querystring";
import {withRouter} from "react-router";

class MyComment extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = queryString.parse(props.location.search.slice(1)).courseId;
        this.state = {
            commentData: [],
        };
    }
    loadCommentData=async ()=>{
        try {
            const result = await Request.getCommentByUserId(this.courseId);
            this.setState({commentData: result});
        } catch (e) {
            message.error("获取评论失败");
        }
    };
    deleteComment=async (item)=>{
      try {
          await Request.deleteCommentById(item.ID);
          this.loadCommentData();
          message.success("已删除");
      }catch (e) {
          message.error("删除失败");
      }
    };
    componentDidMount() {
        this.loadCommentData();
    }
    render() {
        return(
            <Card>
                <List itemLayout="horizontal" dataSource={this.state.commentData}
                      renderItem={item => this.state.commentData.length === 0 ?
                          (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>) :
                          (<li>
                              <Comment actions={[<Popconfirm title="确定删除" onConfirm={()=>{this.deleteComment(item)}}>
                                      <Button style={{padding:0}} type="link">删除</Button>
                                  </Popconfirm>]}
                                  author={<span style={{color:"black"}}>{item.user.realName}</span>}
                                  avatar={<Avatar src={item.user.avatar === "" ? "" : Constant.BaseAvatar + item.user.avatar}/>}
                                  content={item.content}
                                  datetime={<span style={{color:"black"}}>{moment(item.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>}
                              >
                              </Comment>
                          </li>)
                      }
                />
            </Card>
        )
    }
}
export default withRouter(MyComment);