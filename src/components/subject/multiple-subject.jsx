import React from "react";
import {Checkbox, InputNumber} from "antd";
export default class MultipleSubject extends React.Component{
    constructor(props) {
        super(props);
        this.options=this.props.dataSource.options;
        let answer = props.record.answer;
        if(answer!==undefined&&answer!=null&&answer!==''){
            answer = answer.split(',');//将1,2变为数组[1,2]
        }
        if (answer===""){
            answer=[]
        }
        this.state={
            value:answer,
            inputValue:props.record.score,
        }
    }
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
    onChange=(value)=>{
        this.setState({value:value});
        let answer=value.toString();//将数值变为字符串
        let values={
            record:{...this.props.record,answer:answer},
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
                <div style={{width:"100%",height:40}}>
                    {this.props.answerVisible?<span style={{float:"left",color:"black",fontSize:15}}>正确答案:{this.props.dataSource.answer}</span>:null}
                    {this.props.inputVisible?<span style={{float:"right",color:"black",fontSize:14}}>得分: <InputNumber onChange={this.onInputChange} value={this.state.inputValue}  min={0} max={this.props.dataSource.score}/></span>:null}
                </div>
            </div>
        )
    }
}