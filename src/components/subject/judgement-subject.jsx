import React from "react";
import {InputNumber, Radio} from "antd";
export default class JudgementSubject extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            value:props.record.answer,
            inputValue:props.record.score,
        }
    }
    onChange=(e)=>{
        let value=e.target.value;
        this.setState({value:value});
        let values={
            record:{...this.props.record,answer:value},
            dataSource:this.props.dataSource,
            sequenceNumber:this.props.sequenceNumber,
        };
        if(this.props.getValues) {
            this.props.getValues(values);
        }
    };
    onInputChange=(value)=>{
        this.setState({inputValue:value});
        let values={
            record:{...this.props.record,score:value},
            dataSource:this.props.dataSource,
            sequenceNumber:this.props.sequenceNumber,
        };
        this.props.getInputValue(values);
    };
    componentDidMount() {
        let values={
            record:this.props.record,
            sequenceNumber:this.props.sequenceNumber,
            dataSource:this.props.dataSource,
        };
        if(this.props.getValues) {
            this.props.getValues(values);
        }
        if(this.props.getInputValue){
            this.props.getInputValue(values);
        }
    }
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
                    <span style={{color:"#36aafd"}}>[判断题]</span>
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
                <div style={{width:"100%",height:40}}>
                    {this.props.answerVisible?<span style={{float:"left",color:"black",fontSize:15}}>正确答案:{this.props.dataSource.answer}</span>:null}
                    {this.props.inputVisible?<span style={{float:"right",color:"black",fontSize:14}}>得分: <InputNumber onChange={this.onInputChange} value={this.state.inputValue}  min={0} max={this.props.dataSource.score}/></span>:null}
                </div>
            </div>
        )
    }
}