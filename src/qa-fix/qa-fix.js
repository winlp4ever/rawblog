import React, { Component, useState, createRef } from 'react';
import ReactPlayer from 'react-player';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import './_qa-fix.scss';

import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import {CSSTransition} from 'react-transition-group';
import lottie from 'lottie-web';
import loading from '../../imgs/loading.json';
import { findDOMNode } from 'react-dom';

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

const QA = (props) => {
    const [q, setQ] = useState(props.q);
    const [a, setA] = useState(props.a);
    const [editMode, setEditMode] = useState(false);
    const [focus, setFocus] = useState(false)

    const editOn = () => setEditMode(true);

    const modifyQ = (e) => setQ(e.target.value);
    const modifyA = (e) => setA(e.target.value);

    const cancelChanges = () => {
        setQ(props.q);
        setA(props.a);
        setEditMode(false);
    }

    const saveChanges = () => {
        props.saveChanges(props.questionId, q, a);
        setEditMode(false);
    }

    return (<div className={focus? 'qa focus': 'qa'} 
        onFocus={_ => setFocus(true)} 
        onBlur={_ => setFocus(false)}>
        <Button className='timestamp' onClick={_ => props.seekTo(props.timestamp)}>
            time: {props.timestamp}s <Icon iconName='GotoToday' />
        </Button>
        {!editMode ? <div className='nonedit-mode'>
            <div>
                <Icon iconName='StatusCircleQuestionMark'/>
                <span className='q'>{props.q}</span>
            </div>
            <div>
                <Icon iconName='CheckMark'/>
                <span className='a'>{props.a}</span>
            </div>
            <Button className='edit' onClick={editOn}><Icon iconName='Edit'/></Button>
        </div>
        :<div className='edit-mode'>
            <div>
                <Icon iconName='StatusCircleQuestionMark'/>
                <TextareaAutosize value={q} onChange={modifyQ} autoFocus={true}/>
            </div>
            <div>
                <Icon iconName='CheckMark'/>
                <TextareaAutosize value={a} onChange={modifyA}/>
            </div>
            <Button className='save' onClick={saveChanges}><Icon iconName='Save' /></Button>
            <Button className='cancel' onClick={cancelChanges}><Icon iconName='Cancel'/></Button>
        </div>}
    </div>)
}

export default class QAFix extends Component {
    _mounted = false;
    state = {
        url: 'https://sample-course-aii.s3.eu-west-3.amazonaws.com/sample-course.mp4',
        ready: false,
        playing: false,
        duration: 1,
        seek: 0,
        questions: []
    }

    _setState = (dict) => {
        if (this._mounted) this.setState(dict);
    }

    async componentDidMount() {
        this._mounted = true;
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
            this._setState({seek: seek});
        }, 200);
        let response = await fetch('/get-questions', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({pass: 'hmm'})
        })
        let data = await response.json();
        this._setState(data)
    }

    componentWillUnmount() {
        this._mounted = false;
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

    saveChanges = (i, q, a) => {
        let questions_ = this.state.questions.slice();
        questions_[i].q = q;
        questions_[i].a = a;
        this._setState({questions: questions_});
    }

    seek = (secs) => {
        if (this.player != null) {
            this.player.seekTo(secs);
            this._setState({seek: secs});
        }
    }

    render() {
        return (<div className='qa-fix'>
            <div className='video-player'>
                <div className='player-wrapper'>
                    {this.state.ready? null: 
                        <div className='loading'>
                            <Loading />
                        </div>}
                    <ReactPlayer
                        ref={this.ref}
                        className='react-player'
                        url={this.state.url}
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
            <div className='qas'>
                {this.state.questions.map(
                    (qa, id) => <QA {...qa} key={id} saveChanges={this.saveChanges} questionId={id} seekTo={this.seek}/>)}
            </div>
        </div>)
    }
}