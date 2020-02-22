import React, { Component, createRef, useState } from 'react';
import ReactPlayer from 'react-player';
import './_vid.scss';
import Button from '@material-ui/core/Button';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import {CSSTransition} from 'react-transition-group';
import { findDOMNode } from 'react-dom';
import GoodIcon from '../../imgs/good.svg';
import bookmark from '../../imgs/bookmark.json';
import loading from '../../imgs/loading.json';
import yo from '../../imgs/yo.json';
import lottie from 'lottie-web';
import favorite from '../../imgs/favorite.json';
import Input from '@material-ui/core/Input';
import HelpOutlinedIcon from '@material-ui/icons/HelpOutlined';

const NewQuestion = (props) => {
    const [active, setActive] = useState(false);
    const [q, setQ] = useState('');

    const handleChange = (e) => {
        setQ(e.target.value);
    }

    const handleFocus = () => {
        setActive(true);
    }

    const handleOutFocus = () => {
        setActive(false);
    }

    let cl = 'question';
    if (active) cl+= ' active';
    return <div className={cl}>
        <Input disableUnderline={true} 
            fullWidth={true} 
            placeholder='Ask a question' 
            onFocus={handleFocus} 
            onBlur={handleOutFocus}
            onChange={handleChange}/>
        <HelpOutlinedIcon className='question-mark'/>
    </div>
}

class Yo extends Component {
    state = {on: false}
    
    componentDidMount() {
        this.anim = lottie.loadAnimation({
            container: this.animBox,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: yo
        })
        this.anim.setSpeed(1.5);
    }

    componentWillUnmount() {
        this.anim.destroy();
    }

    handleClick = () => {
        if (!this.state.on)
            this.anim.play();
        else this.anim.stop();
        this.setState({on: !this.state.on})
    }

    render() {
        let cl = 'learned-something';
        if (this.state.on) cl += ' on';
        return <Button
            variant="contained"
            className={cl}
            endIcon={<span className='yo' ref={animBox => this.animBox = animBox}/>}
            onClick={this.handleClick}
        >
            I learned something!
        </Button>
    }
}

class Loading extends Component {
    componentDidMount() {
        this.anim = lottie.loadAnimation({
            container: this.animBox,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: loading
        })
    }
    render() {
        return <div className='loading-icon' ref={animBox => this.animBox = animBox}/>
    }
}

class _Icon extends Component {
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

class VideoPlayer extends Component {
    state = {
        ready: false,
        playing: false,
        duration: 1,
        seek: 0,
    };

    componentDidMount() {
        this.$player = $(findDOMNode(this.player));
        
        console.log(this.$player.css('height'))
        this.progressing_ = setInterval(() => {
            let seek = 0;
            try {
                seek = this.player.getCurrentTime();

            } catch (e) {
            }
            this.$player.parent().parent()
                .children('.controls')
                .children('.progress-bar')
                .children('.seek').css('width', `${seek / this.state.duration * 100}%`);
            this.setState({seek: seek});
        }, 200);
    }
    componentWillUnmount() {
        clearInterval(this.progressing_);
    }

    pauseOrPlay = () => {
        this.setState({playing: !this.state.playing});
    }

    stop = () => {
        this.player.seekTo(0);
        this.setState({playing: false, seek: 0});
    }

    handleReady = () => {
        this.setState({ready: true, duration: this.player.getDuration()});
        this.$player.parent().css('height', parseFloat(this.$player.children('video').css('height'), 10));   
    }

    ref = player => {
        this.player = player
    }

    render() {
        return <div className='video-player'>
            <div className='player-wrapper'>
                {this.state.ready? null: 
                    <div className='loading'>
                        <Loading />
                    </div>}
                <ReactPlayer
                    ref={this.ref}
                    className='react-player'
                    url={this.props.url}
                    height='auto'
                    width='100%'
                    playing={this.state.playing}
                    onClick={this.pauseOrPlay}
                    onReady={this.handleReady}
                />
            </div>
            <div className='controls'>
                <div className='progress-bar'>
                    <div className='seek'></div>
                </div>
                <div className='control-buttons'>
                    <Button className='playpause' onClick={this.pauseOrPlay}>
                        {this.state.playing? <PauseRoundedIcon/>: <PlayArrowRoundedIcon/>}
                    </Button>
                    <Button className='stop' onClick={this.stop}><StopRoundedIcon /></Button>
                </div>
            </div>
            
        </div>
    }
}

export default class Vid extends Component {
    state = {
        url: 'https://taii.s3.eu-west-3.amazonaws.com/ted-ed-vid.mp4',
    };

    render() {
        return (
            <div className='vid'>
                <VideoPlayer url={this.state.url}/>
                <div className='right-panel'>
                    <div className='course-info'>
                        <h1>Introduction to Recurrent Neural Network</h1>
                        <p>Teacher: The AI Institute</p>
                        <p>Duration: {parseInt(this.state.duration)}s</p>
                        <div className='favorite-and-bookmark'>
                            <div className='favorite'>
                                <_Icon icon={favorite}/>
                            </div>
                            <div className='bookmark'>
                                <_Icon icon={bookmark} />
                            </div>
                        </div>
                    </div>
                    <div className='review'>
                        <Yo />
                    </div>
                </div>
                <div className='main-panel'>
                    <div className='ask-question'>
                        <NewQuestion />
                    </div>
                </div>
            </div>
        )
    }
}