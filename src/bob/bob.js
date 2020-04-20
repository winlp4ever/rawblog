// import react
import React, {Component, useState, useContext, useEffect, useRef} from 'react';
import {userContext} from '../user-context/user-context';

// third party imports
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import MinimizeRoundedIcon from '@material-ui/icons/MinimizeRounded';
import SmsFailedOutlinedIcon from '@material-ui/icons/SmsFailedOutlined';
import CollectionsBookmarkOutlinedIcon from '@material-ui/icons/CollectionsBookmarkOutlined';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';
import StarBorderRoundedIcon from '@material-ui/icons/StarBorderRounded';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import $ from 'jquery';

// import style file
import './_bob.scss';

// other cpns imports

import MdRender from '../markdown-render/markdown-render';
import BobMenu from './menu';
import Ask from './ask';
import HistoryBookmarks from './history-bookmarks';

const RatingLvs = ['totally unrelated!', 'not so helpful', 'contain info', 'very helpful', 'excellent']

const Options = [
    {
        icon: <img src={require('../../imgs/bob/chat.svg')}/>,
        cl: 'view-ask'
    },
    {
        icon: <img src={require('../../imgs/bob/bookmark.svg')}/>,
        cl: 'view-bookmarks'
    },
    {
        icon: <img src={require('../../imgs/bob/compass.svg')}/>,
        cl: 'view-explore'
    },
    {
        icon: <img src={require('../../imgs/bob/list.svg')}/>,
        cl: 'view-more'
    },
    {
        icon: <MinimizeRoundedIcon/>,
        cl: 'minimize-window'
    }
]


export default class Bob extends Component {
    static contextType = userContext;
    state = {
        hints: [],
        chats: [],
        socket: io(),
        pins: [],
        tab: 0, 
    }

    componentDidMount () {
        this.state.socket.on('bob-msg', msg => {
            console.log(msg);
            if (msg.conversationID == this.context.user.userid) {
                let chats_ = this.state.chats.slice();
                chats_.push(msg.chat);
                let dct = this.context.user;
                dct.history.push(msg.chat);
                this.context.updateUser(dct);
                console.log(dct.history);
                this.setState({chats: chats_});
                $(".old-chats").animate({
                    scrollTop: $('.old-chats')[0].scrollHeight - $('.old-chats')[0].clientHeight + 50
                }, 500);
            }
        })
        this.state.socket.on('new-chat', msg => {
            if (msg.conversationID == this.context.user.userid) {
                let chats_ = this.state.chats.slice();
                chats_.push(msg.chat);
                this.setState({chats: chats_});
                $(".old-chats").animate({
                    scrollTop: $('.old-chats')[0].scrollHeight - $('.old-chats')[0].clientHeight + 50
                }, 500);
            }
        })
        this.state.socket.on('bob-hints', msg => {
            if (msg.conversationID == this.context.user.userid) {
                this.setState({hints: msg.hints})
            }
        })
    }

    componentWillUnmount () {
        this.state.socket.disconnect();
    }

    changeTab = (id) => {
        this.setState({tab: id});
    }

    render() {
        let main = null;
        if (this.state.tab == 0) {
            main = <Ask 
                socket={this.state.socket}
                chats={this.state.chats}
                hints={this.state.hints}
            />
        } else if (this.state.tab == 1) {
            main = <HistoryBookmarks/>
        }

        return <div className='bob'>
            <BobMenu 
                options={Options} 
                activeTab={this.state.tab}
                changeTab={this.changeTab} 
            />
            {main}
        </div>
    }
}