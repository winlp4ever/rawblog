// import react
import React, {Component, useState, useContext, useEffect, useRef} from 'react';
import {userContext} from '../user-context/user-context';

// third party imports
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';

// import style file
import './_bob.scss';


const Chat = ({content}) => {
    return <div className='chat'>
        <span className='text'>{content.text}</span>
        <span className='time'>{content.time}</span>
    </div>
}

const MultipleChoices = ({content}) => {
    const handleClick = () => {
        console.log('click choice!');
    }
    return <div className='multiple-choices'>
        {content.choices.map((choice, id) => {
            return <span key={id} className='choice' onClick={handleClick}>{choice.text}</span>
        })}
    </div>
}

const OnePersonChats = (props) => {
    // get user context
    const user = useContext(userContext).user;

    let cl = 'one-person-chats';

    // check if these phrases are spoken by current user
    if (props.chats.length > 0) if (user.username == props.chats[0].user.username) cl += ' me'
    return <div className={cl}>
        <div className='user'></div>
        <div className='content'>
            {props.chats.map((c, id) => {
                if (c.type == 'chat') return <Chat key={id} content={c}/>;
                if (c.type == 'multiple-choices') return <MultipleChoices key={id} content={c}/>
            })}
        </div>
    </div>
}

const NewChat = (props) => {
    const [newchat, setNewchat] = useState('');
    const input = useRef(null);
    const sending = useRef(null);
    const user = useContext(userContext).user;

    const handleChange = (e) => {
        setNewchat(e.target.value);
    }

    const send = () => {
        if (newchat == '') return;
        const nc = {
            user: user,
            type: 'chat',
            text: newchat
        }
        props.socket.emit('ask-bob', {
            chat: nc,
            conversationID: user.userid
        });
        props.addNewchat(nc);
        setNewchat('');
        input.current.value = '';
    }

    const handleKeyPress = (e) => {

    }

    return <div className='new-chat'>
        <TextareaAutosize
            ref={input}
            placeholder='ask a question'
            onChange={handleChange}
        />
        <Button onClick={send} ref={sending}><SendRoundedIcon/></Button>
    </div>
}

export default class Bob extends Component {
    static contextType = userContext;
    state = {
        chats: [],
        socket: io()
    }

    componentDidMount () {
        this.state.socket.on('bob-msg', msg => {
            console.log(msg);
            if (msg.conversationID == this.context.user.userid) {
                let chats_ = this.state.chats.slice();
                chats_.push(msg.chat);
                this.setState({chats: chats_});
            }
        })
    }

    componentWillUnmount () {
        this.state.socket.disconnect();
    }

    addNewchat = (c) => {
        let chats_ = this.state.chats.slice();
        chats_.push(c);
        this.setState({chats: chats_});
    }

    render() {
        console.log(this.state.chats);
        let chatParts = [];
        let onePersonChats = [];
        let currentUser = '';
        this.state.chats.forEach((c, id) => {
            if (c.user.username != currentUser) {
                if (onePersonChats.length > 0) {
                    chatParts.push(onePersonChats);
                    onePersonChats = [];
                    currentUser = c.user.username;
                }
            }
            onePersonChats.push(c);
            
        })
        if (onePersonChats) chatParts.push(onePersonChats);

        return <div className='bob'>
            <div className='old-chats'>
                {chatParts.map((p, id) => {
                    return <OnePersonChats key={id} chats={p}/>
                })}
            </div>
            <NewChat addNewchat={this.addNewchat} socket={this.state.socket}/>
        </div>
    }
}