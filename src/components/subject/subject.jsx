import React from "react";
import SingleSubject from "./single-subject";
import MultipleSubject from "./multiple-subject";
import JudgementSubject from "./judgement-subject";
import BlankSubject from "./blank-subject";
import ShortSubject from "./short-subject";
import ProgramSubject from "./program-subject";
export default class Subject extends React.Component{
    render() {
        let {dataSource,getValues,sequenceNumber} = this.props;
        let component;
        switch(dataSource.type){
            case '单选题':
                component=<SingleSubject sequenceNumber={sequenceNumber}  dataSource={dataSource} getValues={getValues}/>;
                break;
            case '多选题':
                component=<MultipleSubject sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '判断题':
                component=<JudgementSubject sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '填空题':
                component=<BlankSubject sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '简答题':
                component=<ShortSubject sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            case '编程题':
                component=<ProgramSubject sequenceNumber={sequenceNumber} dataSource={dataSource} getValues={getValues}/>;
                break;
            default:
                component=null;
                break;
        }
        return component;
    }
}