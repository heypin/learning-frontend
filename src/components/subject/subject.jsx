import React from "react";
import SingleSubject from "./single-subject";
import MultipleSubject from "./multiple-subject";
import JudgementSubject from "./judgement-subject";
import BlankSubject from "./blank-subject";
import ShortSubject from "./short-subject";
import ProgramSubject from "./program-subject";
export default class Subject extends React.Component{
    render() {
        let {type,inputVisible,getInputValue,answerVisible,dataSource,getValues,sequenceNumber,record} = this.props;
        let component;
        switch(type){
            case '单选题':
                component=<SingleSubject getInputValue={getInputValue} inputVisible={inputVisible} answerVisible={answerVisible} record={record} sequenceNumber={sequenceNumber}  dataSource={dataSource} getValues={getValues}/>;
                break;
            case '多选题':
                component=<MultipleSubject getInputValue={getInputValue} inputVisible={inputVisible} answerVisible={answerVisible}  record={record} sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '判断题':
                component=<JudgementSubject getInputValue={getInputValue} inputVisible={inputVisible} answerVisible={answerVisible}   record={record} sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '填空题':
                component=<BlankSubject getInputValue={getInputValue} inputVisible={inputVisible} answerVisible={answerVisible} record={record} sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '简答题':
                component=<ShortSubject getInputValue={getInputValue} inputVisible={inputVisible} answerVisible={answerVisible}  record={record} sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '编程题':
                component=<ProgramSubject getInputValue={getInputValue} inputVisible={inputVisible} answerVisible={answerVisible}  record={record} sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            default:
                component=null;
                break;
        }
        return component;
    }
}