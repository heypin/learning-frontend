import React from "react";
import {Checkbox, Radio} from "antd";
export default class JudgementSubject extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            value:props.dataSource.answer,
        }
    }

    onChange=(e)=>{
        let value=e.target.value;
        this.setState({value:value});
        console.log(value)
        let values={...this.props.dataSource,answer:value};
        if(this.props.getValues !== undefined && this.props.getValues!==null) {
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
                <p style={{fontSize:17,marginBottom:5,wordBreak:"break-all"}}>
                    <span style={{color:"#36aafd"}}>{sequenceNumber}.</span>
                    <span style={{color:"#36aafd"}}>[{dataSource.type}]</span>
                    <span style={{color:"#aeaeae"}}>({dataSource.score}分)</span>
                    <span style={{color:"#333"}}>{dataSource.question}</span>
                </p>
                <div style={{width:"100%"}}>
                    <Radio.Group style={{width:"100%"}} onChange={this.onChange} value={this.state.value}>
                        <Radio  style={radioStyle} value={'1'}>
                            <span>对</span>
                        </Radio>
                        <Radio  style={radioStyle} value={'0'}>
                            <span>错</span>
                        </Radio>
                    </Radio.Group>
                </div>
            </div>
        )
    }
}