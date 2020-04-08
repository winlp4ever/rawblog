// import react
import React, {Component, useState, useContext, useEffect, useRef} from 'react';
import {userContext} from '../user-context/user-context';

// third party imports
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import BookmarkBorderRoundedIcon from '@material-ui/icons/BookmarkBorderRounded';
import MinimizeRoundedIcon from '@material-ui/icons/MinimizeRounded';
import Button from '@material-ui/core/Button';
import io from 'socket.io-client';

// import style file
import './_bob.scss';

// other cpns imports
import {getCurrentTime} from '../utils';
import MdRender from '../markdown-render/markdown-render';


const Chat = ({content}) => {
    return <div className='chat'>
        <span className='text'>{content.text}</span>
        <span className='time'>{content.time}</span>
    </div>
}

const Answer = ({content}) => {
    const [pin, setPin] = useState(false);
    const [mini, setMini] = useState(false);

    const togglePin = () => setPin(!pin);
    const toggleMini = () => setMini(!mini);
    return <div className={'answer' + (pin? ' pinned': '')}>
        <div className='taskbar'>
            <Button onClick={togglePin}><BookmarkBorderRoundedIcon/></Button>
            <Button onClick={toggleMini}><MinimizeRoundedIcon/></Button>
        </div>
        <span 
            className='text' 
            dangerouslySetInnerHTML={{
                __html: content.text
            }}
        />
        {content.url != null ? <Button className='click-url' href={content.url} target='_blank'>Go to link</Button>:null}
    </div>
}

const MultipleChoices = ({content}) => {
    const [des, setDes] = useState(-1);

    const handleClick = (id) => {
        console.log('click choice!');
        setDes(id);
    }

    return <div className='multiple-choices'>
        <span className='text'>{content.text}</span>
        <div className={'choices' + (des > -1? ' des': '')}>
            {content.choices.map((choice, id) => {
                if (des > -1 & id != des) return null;
                return <span key={id} 
                    className={'choice' + (id == des ? ' des': '')} 
                    onClick={_ => handleClick(id) } 
                    dangerouslySetInnerHTML={{
                        __html: choice.text
                    }}
                />
            })}
        </div>
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
                if (c.type == 'answer') return <Answer key={id} content={c}/>;
                if (c.type == 'multiple-choices') return <MultipleChoices key={id} content={c}/>;
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
            time: getCurrentTime(true),
            user: user,
            type: 'chat',
            text: newchat
        }
        props.socket.emit('ask-bob', {
            chat: nc,
            conversationID: user.userid
        });
        setNewchat('');
        input.current.value = '';
    }

    const handleKeyPress = (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault();
        sending.current.click();
    }

    return <div className='new-chat'>
        <TextareaAutosize
            ref={input}
            placeholder='ask a question'
            onChange={handleChange}
            onKeyPress={handleKeyPress}
        />
        <Button onClick={send} ref={sending}><SendRoundedIcon/></Button>
    </div>
}

export default class Bob extends Component {
    static contextType = userContext;
    state = {
        chats: [],
        socket: io(),
        pins: [],
        history: []
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
        this.state.socket.on('new-chat', msg => {
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
                currentUser = c.user.username;
                if (onePersonChats.length > 0) {
                    chatParts.push(onePersonChats);
                    onePersonChats = [];
                }
            }
            onePersonChats.push(c);
            
        })
        if (onePersonChats) chatParts.push(onePersonChats);

        return <div className='bob'>

            <div className='ask'>
                <div className='old-chats'>
                    {chatParts.map((p, id) => {
                        return <OnePersonChats key={id} chats={p}/>
                    })}
                </div>
                <NewChat socket={this.state.socket}/>
            </div>
        </div>
    }
}