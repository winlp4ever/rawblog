import React, { Component } from 'react';
import QAFix from '../qa-fix/qa-fix';
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import './_app.scss';


class App extends Component {
    state = {
        socket: io(),
        videoUrl: '',
        transcriptUrl: '',
        questions: [],
        generateUI: false
    }

    componentDidMount() {
        this.state.socket.on('raw-qas', msg => {
            this.setState({questions: msg.questions});
            console.log(this.state.questions);
        })
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
        console.log(this.state.videoUrl);
        console.log(this.state.transcriptUrl);
        this.state.socket.emit('transcript-url', {url: this.state.transcriptUrl});
    }

    render() {
        return (<div className='app'>
                <TextareaAutosize 
                    className='enter-url'
                    placehoder='enter video url'
                    onChange={this.handleVideoUrlChange}
                />
                <TextareaAutosize 
                    className='enter-url'
                    placehoder='enter transcript url'
                    onChange={this.handleTranscriptUrlChange}
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
                        url={this.state.videoUrl}
                        questions={this.state.questions}/>
                :null}
            </div>
        ) 
    }
}

export default App;