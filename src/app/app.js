import React, { Component, useReducer } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
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

const menuOptions = [
    {name: 'View all', path: '/all-lessons', icon: <ViewHeadlineRoundedIcon/>, cpn: <Socio/>},
    {name: 'Home', path: '/', icon: <HomeRoundedIcon/>, cpn: <Home/>}
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
                    </div>: null
                }
                <Auth />
            </userContext.Provider>
        )
    }
}