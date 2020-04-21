import React from "react";
import {Input} from "antd";
export default class ShortSubject extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            value:props.record.answer,
        }
    }
    onChange=(value)=>{
        this.setState({value:value});
        let values={...this.props.record,answer:value};
        if(this.props.getValues) {
            this.props.getValues(values);
        }
    };
    render() {
        const {sequenceNumber,dataSource}=this.props;
        return (
            <div style={{paddingLeft:10,paddingRight:10}}>
                <p style={{fontSize:17,marginBottom:5,wordBreak:"break-all"}}>
                    <span style={{color:"#36aafd"}}>{sequenceNumber}.</span>
                    <span style={{color:"#36aafd"}}>[简答题]</span>
                    <span style={{color:"#aeaeae"}}>({dataSource.score}分)</span>
                    <span style={{color:"#333"}}>{dataSource.question}</span>
                </p>
                <div style={{width:"100%"}}>
                    <Input.TextArea rows={8} value={this.state.value} onChange={this.onChange}/>
                </div>
            </div>
        )
    }
}