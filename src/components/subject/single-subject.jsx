import React from "react";
import {Radio} from "antd";

export default class SingleSubject extends React.Component{
    constructor(props) {
        super(props);
        this.options=this.props.dataSource.options;
        this.state={
            value:props.record.answer,
        }
    }
    onChange=(e)=>{
        let value=e.target.value;
        this.setState({value:value});
        let values={...this.props.record,answer:value};
        if(this.props.getValues) {
            this.props.getValues(values);
        }
    };
    render() {
        const {sequenceNumber,dataSource}=this.props;
        const radioStyle = {
            lineHeight: '40px',
            marginBottom:'10px',
            width:"100%",
            border:"1px solid #eaeaea",
            borderRadius:4,
            paddingLeft:10,
            fontSize:16,
            display:"inline-block",
            verticalAlign:"middle",
            wordBreak:"break-all",
        };
        return (
            <div style={{paddingLeft:10,paddingRight:10}}>
                <p style={{fontSize:16,marginBottom:5,wordBreak:"break-all"}}>
                    <span style={{color:"#36aafd"}}>{sequenceNumber}.</span>
                    <span style={{color:"#36aafd"}}>[单选题]</span>
                    <span style={{color:"#aeaeae"}}>({dataSource.score}分)</span>
                    <span style={{color:"#333"}}>{dataSource.question}</span>
                </p>
                <div style={{width:"100%"}}>
                    <Radio.Group style={{width:"100%"}} onChange={this.onChange} value={this.state.value}>
                        {
                            this.options.map((item)=>{
                                return (
                                    <Radio key={item.sequence} style={radioStyle} value={item.sequence}>
                                        <span>{item.sequence}.</span>
                                        <span>{item.content}</span>
                                    </Radio>
                                )
                            })
                        }
                    </Radio.Group>
                </div>
            </div>
        )
    }
}