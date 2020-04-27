import React from "react";
export default class Timer extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            seconds:props.seconds,
        }
    }
    tick=()=> {
        this.setState((state, props) =>{
            if(state.seconds>0){
                return {seconds:state.seconds-1}
            }else{
                if(this.props.onFinish){//倒计时结束,通知父组件
                    this.props.onFinish()
                }
            }
        });
    };
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }
    render() {
        const seconds=this.state.seconds;
        if(this.props.onlySecond){//仅显示秒
            return <span>{seconds}s</span>
        }
        let hour=Math.floor(seconds/60/60);
        let minute=Math.floor(seconds/60%60);
        let second= Math.floor(seconds%60);
        return (
            <span style={this.props.style}>{hour}:{minute}:{second}</span>
        )
    }
}