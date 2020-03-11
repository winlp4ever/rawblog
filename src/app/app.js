import React, { Component, useReducer } from 'react';
import Socio from '../socio/socio';
import FullPost from '../full-post/full-post';
import Auth from '../user-auth/user-auth';
import Menu from '../menu/menu';
import { userContext } from '../user-context/user-context';
import Home from '../home/home';
import B0t from '../b0t/b0t';
//import Login from '../login/login';
import Vid from '../vid/vid';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import ViewHeadlineRoundedIcon from '@material-ui/icons/ViewHeadlineRounded';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import Cookies from 'js-cookie';

export default class App extends Component {
    state = {
        user: {
            username: '',
            email: '',
            color: ''
        },
        activeTab: 1,
        postId: -1,
    }

    componentDidMount() {
        let userdata = Cookies.get('user');
        if (userdata) {
            this.setState({user: JSON.parse(userdata)});   
        }
        
    }

    componentWillUnmount = () => {
    }

    updateUser =  async (info) => {
        await this.setState(
            {user: info});
        if (info.username != '') {
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
            {name: 'Home', onClick: this.viewHome, icon: <HomeRoundedIcon/>}, 
            {name: 'ViewAll', onClick: this.viewSocio, icon: <ViewHeadlineRoundedIcon/>},
            {name: 'Video', onClick: this.viewVideo, icon: <VideocamRoundedIcon/>}
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
                {
                    (this.state.user.username != '') ? <div>
                        <B0t 
                            socket={this.state.socket} 
                            username={this.state.user.username} 
                            viewFullPost={this.viewFullPost}
                        />
                        <Menu links={menuOptions} activeTab={this.state.activeTab}/>
                        {main}
                    </div>: null
                }
                <Auth />
            </userContext.Provider>
        )
    }
}