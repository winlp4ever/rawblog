import React, { Component } from 'react';
import Post from '../post/post';
import io from 'socket.io-client';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: io()
        }
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }
    render() {
        return (
            <div>
                <Post postId={0} socket={this.state.socket} />
            </div>
        )
    }
}

export default Main;