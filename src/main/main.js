import React, { Component } from 'react';
import Socio from '../socio/socio';
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
                <Socio socket={this.state.socket} />
            </div>
        )
    }
}

export default Main;