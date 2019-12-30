import React, { Component, useReducer } from 'react';
import Socio from '../socio/socio';
import ConnectionError from '../connection-error/connection-error';
import FullPost from '../full-post/full-post';
import Auth from '../user-auth/user-auth';
import io from 'socket.io-client';
import Menu from '../menu/menu';
import Editor from '../editor/editor';
import { userContext } from '../user-context/user-context';

class App extends Component {
    state = {
        user: {
            name: '',
            email: '',
        },
        activeTab: 1,
        postId: -1,
        socket: io(),
    }

    componentWillUnmount = () => {
        this.state.socket.disconnect();
    }

    updateUser =  async (info) => {
        if (info.name) {
            this.setState({user: {name: info.name, email: info.email}});
        }
    }

    viewEditor = () => {
        this.setState({activeTab: 2, postId: -1})
    }

    viewFullPost = (id) => {
        this.setState({activeTab: 1, postId: id});
    }

    viewSocio = () => {
        this.setState({activeTab: 1, postId: -1});
    }

    render = () => {
        let menuOptions = [
            {name: 'Home', onClick: _ => { window.location.href = 'https://theaiinstitute.ai'; }}, 
            {name: 'Wall', onClick: this.viewSocio}
        ];
        if (this.state.user.name == 'AII') menuOptions.push({name: 'Editor', onClick: this.viewEditor});

        let auth = '';
        if (!this.state.user.name) auth=(<Auth updateUser={this.updateUser} />);

        let main = (<div>Oof! Error, page not found!</div>> -1);
        if (this.state.activeTab == 1 && this.state.postId == -1) {
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
            main = <Editor />
        }

        const value = {
            user: this.state.user,
            updateUser: this.updateUser
        }

        return (
            <userContext.Provider value={value}>
                <Menu links={menuOptions} activeTab={this.state.activeTab}/>
                {main}
                <ConnectionError />
                {auth}
            </userContext.Provider>
        )
    }
}

export default App;