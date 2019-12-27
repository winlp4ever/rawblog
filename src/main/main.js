import React, { Component, useReducer } from 'react';
import Socio from '../socio/socio';
import ConnectionError from '../connection-error/connection-error';
import FullPost from '../full-post/full-post';
import Auth from '../user-auth/user-auth';
import io from 'socket.io-client';
import Menu from '../menu/menu';
import Editor from '../editor/editor';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: '',
                email: '',
            },
            activeTab: 1,
            postId: -1,
            socket: io(),
        }
        this.viewFullPost = this.viewFullPost.bind(this);
        this.viewSocio = this.viewSocio.bind(this);
        this.viewEditor = this.viewEditor.bind(this);
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

    viewEditor() {
        this.setState({activeTab: 2, postId: -1})
    }

    viewFullPost(id) {
        this.setState({activeTab: 1, postId: id});
    }

    viewSocio() {
        this.setState({activeTab: 1, postId: -1});
    }

    render() {
        let menuOptions = [
            {name: 'Home', onClick: _ => { window.location.href = 'https://theaiinstitute.ai'; }}, 
            {name: 'Wall', onClick: this.viewSocio}
        ];
        if (this.state.user.name == 'AII') menuOptions.push({name: 'Editor', onClick: this.viewEditor});
        console.log(this.state.user.name)
        let auth = '';
        if (!this.state.user.name) auth=(<Auth updateUser={this.updateUser} />);

        let main = (<div>Oof! Error, page not found!</div>> -1);
        if (this.state.activeTab == 1 && this.state.postId == -1) {
            main = (<Socio socket={this.state.socket} 
                viewFullPost={this.viewFullPost} 
                user={this.state.user} 
            />);
        }
            
        else if (this.state.activeTab == 1 && this.state.postId > -1) {
            main = <FullPost postId={this.state.postId} 
                socket={this.state.socket} 
                user={this.state.user}
            />;
        } 
        else if (this.state.activeTab == 2) {
            main = <Editor />
        }
        return (
            <section>
                <Menu links={menuOptions} activeTab={this.state.activeTab}/>
                {main}
                <ConnectionError />
                {auth}
            </section>
        )
    }
}

export default Main;