import React from "react";
import {Avatar, Button, Card, Comment, Empty, List, message, Popconfirm} from "antd";
import Constant from "../../../utils/constant";
import moment from "moment";
import Request from "../../../api";
export class ReplyToMe extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.state = {
            commentData: [],
        };
    }
    loadCommentData=async ()=>{
        try {
            const result = await Request.getCommentReplyToUser(this.courseId);
            this.setState({commentData: result});
        } catch (e) {
            message.error("获取评论失败");
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
                              <Comment
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