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
import Forward10Icon from '@material-ui/icons/Forward10';
import Replay10Icon from '@material-ui/icons/Replay10';

import {CSSTransition} from 'react-transition-group';
import lottie from 'lottie-web';
import loading from '../../imgs/loading.json';
import { findDOMNode } from 'react-dom';
import io from 'socket.io-client';


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
            <Button className='rm-question' onClick={props.rmQuestion}><Icon iconName='ChromeClose'/></Button>
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
            <Button className='cancel' onClick={cancelChanges}><Icon iconName='Undo'/></Button>
        </div>}
    </div>)
}

export default class QAFix extends Component {
    _mounted = false;
    state = {
        socket: io(),
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
        this.state.socket.on('raw-qas', msg => {
            this.setState({questions: msg.questions});
            console.log(this.state.questions);
        })
        this.state.socket.emit('transcript-url', {url: this.props.transcriptUrl});
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
    }

    componentWillUnmount() {
        this._mounted = false;
        clearInterval(this.progressing_);
        this.state.socket.disconnect();
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

    forward = () => {
        if (this.player != null) {
            let t = this.player.getCurrentTime();
            this.player.seekTo(t+10);
            this._setState({seek: t+10});
        }
    }

    replay = () => {
        if (this.player != null) {
            let t = this.player.getCurrentTime();
            t = (t - 10) > 0 ? t-10: 0; 
            this.player.seekTo(t);
            this._setState({seek: t});
        }
    }

    rmQuestion = (i) => {
        let qas_ = this.state.questions.slice();
        qas_.splice(i, 1);
        this.setState({questions: qas_});
    }

    saveToCloud = async () => {
        if (this.props.url == '') return;
        let response = await fetch('/save-to-cloud', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({qaList: this.state.questions, url: this.props.transcriptUrl})
        });
        let data = await response.json();
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
                        url={this.props.videoUrl}
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
                        <Button onClick={this.replay}><Replay10Icon/></Button>
                        <Button className='playpause' onClick={this.pauseOrPlay}>
                            {this.state.playing? <PauseRoundedIcon/>: <PlayArrowRoundedIcon/>}
                        </Button>
                        <Button className='stop' onClick={this.stop}><StopRoundedIcon /></Button>
                        <Button onClick={this.forward}><Forward10Icon/></Button>
                    </div>
                </div>
            </div>
            <Button className='save-to-cloud' onClick={this.saveToCloud}>Save to Cloud</Button>
            <div className='qas'>
                {this.state.questions.map(
                    (qa, id) => <QA {...qa} key={id} saveChanges={this.saveChanges} questionId={id} seekTo={this.seek} rmQuestion={_ => this.rmQuestion(id)}/>)}
            </div>
        </div>)
    }
}