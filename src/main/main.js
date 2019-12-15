import React, { Component, useReducer } from 'react';
import Socio from '../socio/socio';
import ConnectionError from '../connection-error/connection-error';
import Post from '../post/post';
import Auth from '../user-auth/user-auth';
import io from 'socket.io-client';


class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                email: '',
            },
            activeTab: 0,
            postId: -1,
            socket: io(),
        }
        this.viewFullPost = this.viewFullPost.bind(this);
        this.viewSocio = this.viewSocio.bind(this);
        this.updateUser = this.updateUser.bind(this);
    }

    componentWillUnmount() {
        this.state.socket.disconnect();
    }

    async updateUser(info) {
        if (info.name) {
            /**
             * if (info.name == 'admin') {
                let pass = prompt('please enter admin password:');
                let response = await fetch('/admin-verify', {method: 'POST', body: {pass: pass}});
                let data = await response.json();
                if (data.answer != 'y') return;
            }
             */
            
            this.setState({user: {name: info.name, email: info.email}});
        }
        
    }

    viewFullPost(id) {
        this.setState({activeTab: 1, postId: id});
    }

    viewSocio() {
        this.setState({activeTab: 0, postId: -1});
    }

    render() {
        console.log(this.state.user.name)
        let auth = '';
        if (!this.state.user.name) auth=(<Auth updateUser={this.updateUser} />);

        let main = (<div>Oof! Error, page not found!</div>);
        if (this.state.activeTab == 0) {
            main = (<Socio socket={this.state.socket} 
                viewFullPost={this.viewFullPost} 
                user={this.state.user} 
            />);
        }
            
        if (this.state.activeTab == 1) {
            main = <Post postId={this.state.postId} 
                socket={this.state.socket} 
                user={this.state.user}
            />;
        } 
        return (
            <section>
                {main}
                <ConnectionError />
                {auth}
            </section>
        )
    }
}

export default Main;