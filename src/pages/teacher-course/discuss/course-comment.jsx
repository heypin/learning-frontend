import React from "react";
import {Comment, Avatar, List, Empty, Button, message, Modal, Input, Card} from 'antd';
import moment from "moment";
import Constant from "../../../utils/constant";
import Request from "../../../api"
import {withRouter} from "react-router";

class CourseComment extends React.Component {
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.replyId = 0;
        this.parentId = 0;
        this.replyUserId = 0;
        this.replyUserRealName="";//回复子评论的用户的名字
        this.state = {
            comment: "",
            commentData: [],
            commentModal: false,
        };
    }

    loadCommentData = async () => {
        try {
            const result = await Request.getCommentByCourseId(this.courseId);
            this.setState({commentData: result});
        } catch (e) {
            message.error("获取评论失败");
        }
    };

    componentDidMount() {
        this.loadCommentData();

    }

    showCommentModal = () => {
        this.setState({commentModal: true});
    };
    cancelCommentModal = () => {
        this.setState({commentModal: false,comment:""});
    };
    handleCommentChange = (event) => {
        this.setState({comment: event.target.value});
    };
    handleSubmitComment = async (e) => {
        try {
            let comment = {
                courseId: this.courseId,
                content: this.state.comment,
                parentId: this.parentId,
                replyId: this.replyId,
                replyUserId: this.replyUserId,
            };
            if(this.parentId!==this.replyId){//回复的是子评论
                comment.content=`回复${this.replyUserRealName}:`+this.state.comment;
            }
            await Request.createComment(comment);
            this.cancelCommentModal();
            this.loadCommentData();
        } catch (e) {
            message.error("发布失败");
        }
    };
    createComment=async ()=>{
        this.replyId = 0;
        this.parentId = 0;
        this.replyUserId = 0;
        this.showCommentModal();
    };
    replyParentComment=async (item)=>{
        this.replyId = item.ID;
        this.parentId = item.ID;
        this.replyUserId = item.user.ID;
        this.showCommentModal();
    };
    replyChildComment=async (item)=>{
        this.replyId = item.ID;
        this.parentId = item.parentId;
        this.replyUserId = item.user.ID;
        this.replyUserRealName=item.user.realName;
        this.showCommentModal();
    };
    render() {
        return (
            <Card title={`${this.state.commentData.length}条讨论`} bodyStyle={{padding:20}}
                  extra={<Button type="primary" onClick={this.createComment}>
                            添加评论
                        </Button>}
            >
                <Modal title="发布评论" onCancel={this.cancelCommentModal}
                           visible={this.state.commentModal} onOk={this.handleSubmitComment}>
                    <Input.TextArea value={this.state.comment} onChange={this.handleCommentChange} rows={5}/>
                </Modal>
                <div>
                    <List itemLayout="horizontal" dataSource={this.state.commentData}
                          renderItem={item => this.state.commentData.length === 0 ?
                              (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>) : (
                                  <li >
                                      <Comment
                                          actions={[<Button style={{padding:0}} type="link" onClick={()=>{this.replyParentComment(item)}}>回复</Button>]}
                                          author={<span style={{color:"black"}}>{item.user.realName}</span>}
                                               avatar={<Avatar src={item.user.avatar === "" ? "" : Constant.BaseAvatar + item.user.avatar}/>}
                                               content={item.content}
                                          datetime={<span style={{color:"black"}}>{moment(item.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>}
                                      >
                                          {(() => {
                                              if (item.children.length === 0) return null;
                                              else {
                                                  return item.children.map((subItem) => {
                                                      return (
                                                          <Comment key={subItem.ID}
                                                                   actions={[
                                                                       <Button style={{padding:0}} onClick={()=>{this.replyChildComment(subItem)}} type="link">
                                                                            回复
                                                                        </Button>]}
                                                                   author={<span style={{color:"black"}}>{subItem.user.realName}</span>}
                                                                   avatar={<Avatar src={subItem.user.avatar === "" ? "" : Constant.BaseAvatar + subItem.user.avatar}/>}
                                                                   content={subItem.content}
                                                                   datetime={<span style={{color:"black"}}>{moment(subItem.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>}
                                                          />
                                                      )
                                                  })
                                              }
                                          })()}
                                      </Comment>
                                  </li>
                              )}
                    />
                </div>

            </Card>
        )
    }
}
export default withRouter(CourseComment);