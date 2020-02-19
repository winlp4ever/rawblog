import React, { Component, createRef } from 'react';
import ReactPlayer from 'react-player';
import './_vid.scss';
import Button from '@material-ui/core/Button';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';
import DoneOutlineRoundedIcon from '@material-ui/icons/DoneOutlineRounded';
import {CSSTransition} from 'react-transition-group';
import { findDOMNode } from 'react-dom';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import GoodIcon from '../../imgs/good.svg';
import SvgIcon from '@material-ui/core/SvgIcon';

const transcript = [
    {t: 1, content: "what is the question", isQuestion: true}, 
    {t: 2, content: "Yeah, how it work is you may think like in my example like, 'i want to eat fish', the sentence is either one hot or embedded, and you insert I to the network, then next word until the last one ", isQuestion: false},
    {t: 5, content: "how does the alpha work?", isQuestion: true}, 
    {t: 6, content: "The alpha depends, as I said, if you in the cases, it depends on what function. You want to apply if you applied softmax which means you want to do a multiple dimensions class vacations", isQuestion: false}
]

const QAs_ = [
    {t: 10, content: "high level, how is this working?", isQuestion: true}, 
    {t: 38, content: "Yeah, how it work is you may think like in my example like, 'i want to eat fish', the sentence is either one hot or embedded, and you have a vector you gave I to one of the aren't first note and then like that are in protest.", isQuestion: false},
    {t: 129, content: "how does the alpha work?", isQuestion: true}, 
    {t: 143, content: "The alpha depends, as I said, if you in the cases, it depends on what function. You want to apply if you applied softmax which means you want to do a multiple dimensions classification", isQuestion: false}
]

export default class Vid extends Component {
    state = {
        url: 'https://taii.s3.eu-west-3.amazonaws.com/ted-ed-vid.mp4',
        playing: false,
        duration: 1,
        seek: 0,
        transcript: transcript,
        displayed: [],
        index: -1,
        toserver: false
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
                if (this.state.index + 1 < this.state.transcript.length) 
                    if (parseInt(seek) == this.state.transcript[this.state.index+1].t) {
                        if (this.state.displayed.length > 0) 
                            if (this.state.displayed[this.state.displayed.length-1].t == parseInt(seek)) 
                                return;
                        let display_ = this.state.displayed.slice();
                        display_.push(this.state.transcript[this.state.index+1]);
                        this.setState({displayed: display_, index: this.state.index+1});   
                } 
                if (this.state.displayed.length >= 2) {
                    setTimeout(() => {
                        let displ = this.state.displayed.slice(2);
                        this.setState({displayed: displ, toserver: true});
                        setTimeout(()=> {
                            this.setState({toserver: false})
                        }, 2000)
                    }, 2000);
                }
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
        this.setState({playing: false, seek: 0, index: -1, displayed: []});
    }

    handleReady = () => {
        this.setState({duration: this.player.getDuration()});
        
    }

    ref = player => {
        this.player = player
    }

    render() {
        return (
            <div className='vid'>
                <div className='video-player'>
                    <div className='player-wrapper'>
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
                    <Button
                        variant="contained"
                        className='like-vid'
                        endIcon={<img src={GoodIcon}/>}
                    >
                        I learned something!
                    </Button>
                </div>
                <div className='right-panel'>
                    <div className='course-info'>
                        <h1>Introduction to Recurrent Neural Network</h1>
                        <p>Teacher: The AI Institute</p>
                        <p>Duration: {parseInt(this.state.duration)}s</p>
                    </div>
                    
                    <div className='question-answer'>
                        {this.state.displayed.map((chat, index) => {
                            if (chat.isQuestion) 
                                return (
                                    <div className='question' key={chat.t}>
                                        <ContactSupportOutlinedIcon />
                                        <Button variant='contained' className='appear'>{chat.content}</Button>
                                    </div>
                                    )
                            return <div className='answer' key={chat.t}>
                                <Button variant='outlined' className='appear'>{chat.content}</Button>
                                <DoneOutlineRoundedIcon/>
                            </div>
                        })}
                        <CSSTransition
                            in={this.state.toserver? true: false}
                            timeout={1000}
                            classNames="toserver"
                            color='primary'
                            unmountOnExit
                        >
                            <Button variant='contained' className='toserver'>
                                Registered to Server!
                            </Button>
                        </CSSTransition>
                        
                    </div>
                </div>
            </div>
        )
    }
}