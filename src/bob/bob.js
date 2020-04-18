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

// import style file
import './_bob.scss';

// other cpns imports
import {getCurrentTime} from '../utils';
import MdRender from '../markdown-render/markdown-render';


const RatingLvs = ['totally unrelated!', 'not so helpful', 'contain info', 'very helpful', 'excellent']


const Question = ({question}) => {
    return <div className='related-question'>
        <span>{question[1]}</span>
    </div>
}

const Insights = ({content, loadInsights}) => {
    const [score, setScore] = useState(0);
    const [msg, setMsg] = useState(' ');

    const submitRating = async () => {
        let response = await fetch('/submit-answer-rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                answer_id: content.answer.answer_temp_id,
                rating: score
            })
        })
        let data = await response.json();
        console.log(data);
    }

    return <div className='insights'>
        <div className='insights-taskbar'>
            <Button onClick={_ => loadInsights(null)}><CloseRoundedIcon /></Button>
        </div>
        <div className='related-questions'>
            <span className='narrate'>Here are some related questions</span>
            {content.related_questions.map((q, id) => <Question question={q} key={id}/>)}
        </div>
        {content.answer.source? <div className='source'>
            <span className='narrate'>Answer's source</span>
            <span className='src-doc'>{content.answer.source}</span>
        </div>: null}
        {content.text? <div className='rate-container'>
            <span className='narrate'>Rate the answer!</span>
            <div className='rate'>
                {RatingLvs.map((c, id) => {
                    if (id < score)
                        return <span key={id} 
                            onClick={_ => setScore(id+1)}
                            onMouseEnter={_ => setMsg(c)}
                            onMouseLeave={_ => setMsg('')}
                        >
                            <StarRoundedIcon />
                        </span>;
                    return <span key={id} 
                        onClick={_ => setScore(id+1)}
                        onMouseEnter={_ => setMsg(c)}
                        onMouseLeave={_ => setMsg('')}
                    >
                        <StarBorderRoundedIcon />
                    </span>;
                })}
                <span className='rating-msg'>{msg}</span>
            </div>
            <Button className='submit-rating' onClick={submitRating}>Submit</Button>
        </div>:null}
        <div className='insights-toolbar'>
            <Button className='mail-teacher'>
                <img src={require('../../imgs/mail.svg')} />
            </Button>
        </div>
    </div>
}


const Chat = ({content}) => {
    return <div className='chat'>
        <span className='text'>{content.text}</span>
        <span className='time'>{content.time}</span>
    </div>
}

const Answer = ({content, loadInsights}) => {
    const [pin, setPin] = useState(false);
    const [mini, setMini] = useState(false);

    const togglePin = () => setPin(!pin);
    const toggleMini = () => setMini(!mini);

    return <div> 
        <div className='chat'>
            <span className='text'>I found something for you</span>
        </div>
        <div className={'answer'}>
            <div className='taskbar'>
                <Button className={pin? 'pinned' : 'pin'} 
                    onClick={togglePin}>
                    <img src={require('../../imgs/bob/pin.svg')}/>
                </Button>
            </div>
            <span 
                className='answer-text' 
                dangerouslySetInnerHTML={{
                    __html: content.text
                }}
            />
            <Button className='click-url' 
                onClick={_ => loadInsights(content)}
            >
                View Insights
            </Button>
        </div>
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
                if (c.type == 'answer') return <Answer key={id} content={c} loadInsights={props.loadInsights}/>;
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
        <Button><img src={require('../../imgs/bob/hint.svg')}/></Button>
        <TextareaAutosize
            ref={input}
            placeholder='ask a question'
            onChange={handleChange}
            onKeyPress={handleKeyPress}
        />
        <Button onClick={send} ref={sending}><img src={require('../../imgs/bob/send.svg')}/></Button>
    </div>
}

export default class Bob extends Component {
    static contextType = userContext;
    state = {
        chats: [],
        socket: io(),
        pins: [],
        history: [],
        tab: 0, 
        insights: null
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

    toggleTab = (id) => {
        this.setState({tab: id});
    }

    loadInsights = (content) => {
        this.setState({insights: content});
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

        let options = [
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
                icon: <img src={require('../../imgs/bob/compass.svg')}/>,
                cl: 'view-more'
            },
            {
                icon: <MinimizeRoundedIcon/>,
                cl: 'minimize-window'
            }
        ]

        let main = null;
        if (this.state.tab == 0) {
            main = <div className='ask'>
                <div className='old-chats'>
                    {chatParts.map((p, id) => {
                        return <OnePersonChats key={id} chats={p} loadInsights={this.loadInsights}/>
                    })}
                </div>
                <NewChat socket={this.state.socket}/>
            </div>
        }

        return <div className='bob'>
            <div className='bob-menu'>
                {options.map((o, id) => <Button 
                    key={id}
                    className={o.cl + (id == this.state.tab? ' focus': '')}
                    onClick={_=>this.toggleTab(id)}
                >
                    {o.icon}
                </Button>)}
            </div>
            {main}
            {this.state.insights? <Insights 
                content={this.state.insights} 
                socket={this.state.socket}
                loadInsights={this.loadInsights}
            /> :null}
        </div>
    }
}