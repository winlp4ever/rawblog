import React, { Component } from 'react';
import QAFix from '../qa-fix/qa-fix';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import './_app.scss';


class App extends Component {
    state = {
        videoUrl: 'https://course-recording-q1-2020-taii.s3.eu-west-3.amazonaws.com/us/GMT20200117-205611_AI-Inst--U_gallery_1920x1080.mp4',
        transcriptUrl: 'https://course-recording-q1-2020-taii.s3.eu-west-3.amazonaws.com/us/GMT20200117-205611_AI-Inst--U.transcript.vtt',
        generateUI: false
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }

    handleVideoUrlChange = (e) => {
        this.setState({videoUrl: e.target.value})
    }

    handleTranscriptUrlChange = (e) => {
        this.setState({transcriptUrl: e.target.value})
    }

    

    generateInterface = () => {
        if (this.state.videoUrl == '') return;
        this.setState({generateUI: true});
    }

    render() {
        return (<div className='app'>
                <TextareaAutosize 
                    className='enter-url'
                    placehoder='enter video url'
                    onChange={this.handleVideoUrlChange}
                    defaultValue='https://course-recording-q1-2020-taii.s3.eu-west-3.amazonaws.com/us/GMT20200117-205611_AI-Inst--U_gallery_1920x1080.mp4'
                />
                <TextareaAutosize 
                    className='enter-url'
                    placehoder='enter transcript url'
                    onChange={this.handleTranscriptUrlChange}
                    defaultValue='https://course-recording-q1-2020-taii.s3.eu-west-3.amazonaws.com/us/GMT20200117-205611_AI-Inst--U.transcript.vtt'
                />
                <Button     
                    className='gen-ui'
                    variant='contained' 
                    onClick={this.generateInterface}
                >
                    Generate Interface
                </Button>
                {this.state.generateUI ? 
                    <QAFix 
                        videoUrl={this.state.videoUrl}
                        transcriptUrl={this.state.transcriptUrl}
                    />
                :null}
            </div>
        ) 
    }
}

export default App;