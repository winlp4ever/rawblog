import React, { Component, useReducer } from 'react';
import Socio from '../socio/socio';
import ConnectionError from '../connection-error/connection-error';
import FullPost from '../full-post/full-post';
import Auth from '../user-auth/user-auth';
import io from 'socket.io-client';
import Menu from '../menu/menu';


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
        let menuOptions = [{name: 'Home', url: '/'}, {name: 'Posts', url: '/'}]
        if (this.state.user.name == 'AII') menuOptions.push({name: 'Editor', url: '/edit'});
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
            main = <FullPost postId={this.state.postId} 
                socket={this.state.socket} 
                user={this.state.user}
            />;
        } 
        return (
            <section>
                <Menu links={menuOptions}/>
                {main}
                <ConnectionError />
                {auth}
            </section>
        )
    }
}

export default Main;