import React from "react";
export default class Timer extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            seconds:props.seconds,
        }
    }
    tick() {
        this.setState((state, props) =>{
            if(state.seconds>0){
                return {seconds:state.seconds-1}
            }
        });
    }
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
        let hour=Math.floor(seconds/60/60);
        let minute=Math.floor(seconds/60%60);
        let second= Math.floor(seconds%60);
        console.log(typeof seconds,typeof hour,typeof minute)
        return (
            <span style={this.props.style}>{hour}:{minute}:{second}</span>
        )
    }
}