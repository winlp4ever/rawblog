import React, { Component, createRef } from 'react';
import ReactPlayer from 'react-player';
import './_vid.scss';
import Button from '@material-ui/core/Button';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import {CSSTransition} from 'react-transition-group';
import { findDOMNode } from 'react-dom';
import GoodIcon from '../../imgs/good.svg';
import UseAnimations from "react-useanimations";


export default class Vid extends Component {
    state = {
        ready: false,
        url: 'https://taii.s3.eu-west-3.amazonaws.com/ted-ed-vid.mp4',
        playing: false,
        duration: 1,
        seek: 0,
    };

    componentDidMount() {
        this.$player = $(findDOMNode(this.player));
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
        
    }

    ref = player => {
        this.player = player
    }

    render() {
        return (
            <div className='vid'>
                <div className='video-player'>
                    <div className='player-wrapper'>
                        {this.state.ready? null: 
                            <div className='loading'>
                                <UseAnimations className='loading-icon' animationKey="loading" />
                            </div>}
                        <ReactPlayer
                            ref={this.ref}
                            className='react-player'
                            url={this.state.url}
                            height='100%'
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
                <div className='right-panel'>
                    <div className='course-info'>
                        <h1>Introduction to Recurrent Neural Network</h1>
                        <p>Teacher: The AI Institute</p>
                        <p>Duration: {parseInt(this.state.duration)}s</p>
                    </div>
                    <div className='review'>
                        <Button
                            variant="contained"
                            className='like-vid'
                            endIcon={<img src={GoodIcon}/>}
                        >
                            I learned something!
                        </Button>
                    </div>
                </div>
                <div className='main-panel'>
                    <div className='ask-question'>
                        <input></input>
                    </div>
                </div>
            </div>
        )
    }
}