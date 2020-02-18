import React, { Component, createRef } from 'react';
import ReactPlayer from 'react-player';
import './_vid.scss';
import Button from '@material-ui/core/Button';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import StopRoundedIcon from '@material-ui/icons/StopRounded';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';
import DoneOutlineRoundedIcon from '@material-ui/icons/DoneOutlineRounded';

const QAs = [
    {t: 1, content: 'what is blah blah?', isQuestion: true}, 
    {t: 4, content: "it's blah blah", isQuestion: false},
    {t: 6, content: 'now can you tell me what is blah blah? wait a minute this owei oiwe ooieis fe', isQuestion: true}, 
    {t: 8, content: "thi's is blllllahwfew", isQuestion: false}
]

export default class Vid extends Component {
    state = {
        url: 'https://taii.s3.eu-west-3.amazonaws.com/ted-ed-vid.mp4',
        playing: false,
        duration: 1,
        seek: 0,
        currentQAs: [],
    };

    componentDidMount() {
        this.progressing_ = setInterval(() => {
            let seek = 0;
            try {
                seek = this.player.getCurrentTime();
                $('.react-player')
            } catch (e) {
                console.log(e);
            }
            $('.seek').css('width', `${seek / this.state.duration * 100}%`);
            this.setState({seek: seek})
            //console.log(parseInt(seek));

            for (let c of QAs) {
                if (c.t == parseInt(seek)) {
                    let currentQAs_ = this.state.currentQAs.slice();
                    let assume = false;
                    if (this.state.currentQAs.length > 0) {
                        if (this.state.currentQAs[this.state.currentQAs.length-1].t != c.t)
                            assume = true;

                    } else assume = true;
                    if (assume)
                        currentQAs_.push(c);
                    this.setState({currentQAs: currentQAs_});
                    break;
                    
                }
            }
            if (this.state.currentQAs.length > 2) this.setState({currentQAs: this.state.currentQAs.slice(2, 3)})

        }, 100);
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
                            width='100%'
                            height='100%'
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
                        <h1>The legend of Annapurna, Hindu goddess of nourishment</h1>
                        <p>Teacher: The AI Institute</p>
                        <p>Duration: {parseInt(this.state.duration)}s</p>
                    </div>
                    <div className='question-answer'>
                        {this.state.currentQAs.map((chat, index) => {
                            if (chat.isQuestion) return <div className='question'><ContactSupportOutlinedIcon /><span key={chat.t} className='appear'>{chat.content}</span></div>
                            return <div className='answer'><span key={chat.t} className='appear'>{chat.content}</span><DoneOutlineRoundedIcon/></div>
                        })}
                    </div>
                </div>
            </div>
        )
    }
}