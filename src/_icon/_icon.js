import React, { Component } from 'react';
import lottie from 'lottie-web';

export default class _Icon extends Component {
    state = {
        on: false
    }
    componentDidMount() {
        this.anim = lottie.loadAnimation({
            container: this.animBox, // the dom element that will contain the animation
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: this.props.icon // the path to the animation json
        });
        this.anim.setSpeed(2);
    }

    componentWillUnmount() {
        this.anim.destroy();
    }

    handleClick = () => {
        this.anim.setDirection(this.state.on? -1: 1);
        this.anim.play();
        this.setState({on: !this.state.on})
    }
    
    render() {
        return <div 
            ref={animBox => {this.animBox = animBox}} 
            onClick={this.handleClick} 
            className={this.props.className}/>
    }
}