import React, { Component, useReducer } from 'react';
import Socio from '../socio/socio';
import FullPost from '../full-post/full-post';
import Auth from '../user-auth/user-auth';
import io from 'socket.io-client';
import Menu from '../menu/menu';
import { userContext } from '../user-context/user-context';
import Home from '../home/home';
import B0t from '../b0t/b0t';
//import Login from '../login/login';
import Vid from '../vid/vid';

import Cookies from 'js-cookie';

export default class App extends Component {
    state = {
        user: {
            name: '',
            email: '',
        },
        activeTab: 1,
        postId: -1,
        socket: io(),
    }

    componentDidMount() {
        console.log(Cookies.get('user'));

        let userdata = Cookies.get('user');

        if (userdata) {
            this.setState({user: JSON.parse(userdata)});   
        }
        
    }

    componentWillUnmount = () => {
        this.state.socket.disconnect();
    }

    updateUser =  async (info) => {
        await this.setState({user: {name: info.name, email: info.email}});
        if (info.name != '') {
            Cookies.set('user', this.state.user, {expires: 1});
        } else {
            Cookies.remove('user');
        }
    }

    viewFullPost = (id) => {
        this.setState({activeTab: 1, postId: id});
    }

    viewSocio = () => {
        this.setState({activeTab: 1, postId: -1});
    }

    viewHome = () => {
        this.setState({activeTab: 0, postId: -1});
    }

    viewVideo = () => {
        this.setState({activeTab: 2, postId: -1});
    }

    render() {
        let menuOptions = [
            {name: 'Home', onClick: this.viewHome}, 
            {name: 'ViewAll', onClick: this.viewSocio},
            {name: 'Video', onClick: this.viewVideo}
        ];

        let main = (<div>Oof! Error, page not found!</div>> -1);
        if (this.state.activeTab == 0) {
            main = (<Home />);
        }

        else if (this.state.activeTab == 1 && this.state.postId == -1) {
            main = (<Socio socket={this.state.socket} 
                viewFullPost={this.viewFullPost} 
            />);
        }
            
        else if (this.state.activeTab == 1 && this.state.postId > -1) {
            main = <FullPost postId={this.state.postId} 
                socket={this.state.socket} 
            />;
        } 

        else if (this.state.activeTab == 2) {
            main = <Vid />;
        }

        const value = {
            user: this.state.user,
            updateUser: this.updateUser
        }

        return (
            <userContext.Provider value={value}>
                <B0t socket={this.state.socket} username={this.state.user.name || 'anonymous'} viewFullPost={this.viewFullPost}/>
                <Menu links={menuOptions} activeTab={this.state.activeTab}/>
                {main}
                <Auth />
            </userContext.Provider>
        )
    }
}