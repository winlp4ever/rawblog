import React, { Component } from 'react';
import Socio from '../socio/socio';
import ConnectionError from '../connection-error/connection-error';
import Post from '../post/post';

import io from 'socket.io-client';


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,
            postId: -1,
            socket: io(),
        }
        this.viewFullPost = this.viewFullPost.bind(this);
        this.viewSocio = this.viewSocio.bind(this);
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }

    viewFullPost(id) {
        this.setState({activeTab: 1, postId: id});
    }

    viewSocio() {
        this.setState({activeTab: 0, postId: -1});
    }

    render() {
        let main = (<div>Oof! Error, page not found!</div>);
        if (this.state.activeTab == 0) main = <Socio socket={this.state.socket} viewFullPost={this.viewFullPost}/>;
        if (this.state.activeTab == 1) main = <Post postId={this.state.postId} socket={this.state.socket} />;
        return (
            <section>
                {main}
                <ConnectionError />
            </section>
        )
    }
}

export default Main;