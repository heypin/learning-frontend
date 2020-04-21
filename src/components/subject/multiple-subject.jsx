import React from "react";
import {Checkbox} from "antd";
export default class MultipleSubject extends React.Component{
    constructor(props) {
        super(props);
        this.options=this.props.dataSource.options;
        let answer = props.record.answer;
        if(answer!==undefined&&answer!=null&&answer!==''){
            answer = answer.split(',');//将1,2变为数组[1,2]
        }
        this.state={
            value:answer,
        }
    }
    onChange=(value)=>{
        this.setState({value:value});
        let answer=value.toString();//将数值变为字符串
        let values={...this.props.record,answer:answer};
        if(this.props.getValues) {
            this.props.getValues(values);
        }
    };
    render() {
        const {sequenceNumber,dataSource}=this.props;
        const checkBoxStyle = {
            lineHeight: '40px',
            marginBottom:'10px',
            width:"100%",
            border:"1px solid #eaeaea",
            borderRadius:4,
            paddingLeft:10,
            fontSize:16,
            wordBreak:"break-all",
        };
        return (
            <div style={{paddingLeft:10,paddingRight:10}}>
                <p style={{fontSize:17,marginBottom:5,wordBreak:"break-all"}}>
                    <span style={{color:"#36aafd"}}>{sequenceNumber}.</span>
                    <span style={{color:"#36aafd"}}>[多选题]</span>
                    <span style={{color:"#aeaeae"}}>({dataSource.score}分)</span>
                    <span style={{color:"#333"}}>{dataSource.question}</span>
                </p>
                <div style={{width:"100%"}}>
                    <Checkbox.Group style={{width:"100%"}} onChange={this.onChange} value={this.state.value}>
                        {
                            this.options.map((item)=>{
                                return (
                                    <React.Fragment key={item.sequence}>
                                        <Checkbox  style={checkBoxStyle} value={item.sequence}>
                                            <span>{item.sequence}.</span>
                                            <span>{item.content}</span>
                                        </Checkbox>
                                        <br/>
                                    </React.Fragment>

                                )
                            })
                        }
                    </Checkbox.Group>
                </div>
            </div>
        )
    }
}