// react imports
import React, { Component, useReducer } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// import other cpns
import Socio from '../socio/socio';
import FullPost from '../full-post/full-post';
import Auth from '../user-auth/user-auth';
import Menu from '../menu/menu';
import { userContext } from '../user-context/user-context';
import Home from '../home/home';
import B0t from '../b0t/b0t';
import Dropzone from '../_dropzone/_dropzone';

// third party imports
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import ViewHeadlineRoundedIcon from '@material-ui/icons/ViewHeadlineRounded';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import Cookies from 'js-cookie';

const menuOptions = [
    {name: 'All courses', path: '/all-courses', icon: <ViewHeadlineRoundedIcon/>, cpn: <Socio/>},
    {name: 'Home', path: '/', icon: <HomeRoundedIcon/>, cpn: <Dropzone/>}
];

const reverse = menuOptions.slice();
reverse.reverse();

export default class App extends Component {
    state = {
        user: {
            username: '',
            email: '',
            color: ''
        },
        activeTab: 0,
    }

    componentDidMount() {
        let userdata = Cookies.get('user');
        if (userdata) {
            this.setState({user: JSON.parse(userdata)});   
        }
    }

    componentWillUnmount = () => {};

    updateUser =  async (info) => {
        await this.setState(
            {user: info});
        if (info.username != '') {
            Cookies.set('user', this.state.user, {expires: 1});
        } else {
            Cookies.remove('user');
        }
    }

    selectTab = (i) => {
        this.setState({activeTab: i});
    }

    render() {
        const value = {
            user: this.state.user,
            updateUser: this.updateUser
        }

        let main = <Router>
            <Switch>
                {menuOptions.map((o, id) => <Route path={o.path} key={id}>
                    <Menu onClick={this.selectTab} activeTab={menuOptions.length - 1 - id} links={reverse}/>
                    {o.cpn}
                </Route>
                )}
            </Switch>
        </Router>        

        return (
            <userContext.Provider value={value}>
                {
                    (this.state.user.username != '') ? <div>
                        {main}
                        <B0t />
                    </div>: null
                }
                <Auth />
                
            </userContext.Provider>
        )
    }
}