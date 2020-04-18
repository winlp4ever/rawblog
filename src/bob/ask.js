import React, {Component, useState, useContext, useEffect, useRef} from 'react';
import {userContext} from '../user-context/user-context';

import Button from '@material-ui/core/Button';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import StarsIcon from '@material-ui/icons/Stars';
import RadioButtonCheckedRoundedIcon from '@material-ui/icons/RadioButtonCheckedRounded';
import RadioButtonUncheckedRoundedIcon from '@material-ui/icons/RadioButtonUncheckedRounded';


import './_ask.scss';

import {getCurrentTime} from '../utils';

const Chat = ({content}) => {
    return <div className='chat'>
        <span className='text'>{content.text}</span>
        <span className='time'>{content.time}</span>
    </div>
}

const RateTheAnswer = ({content}) => {
    const [score, setScore] = useState(0);
    const [hov, setHov] = useState(0);

    return <div className='rating'>
        <span className='text'>
            <img src={require('../../imgs/bob/rating.svg')} />
            <b>Please rate the answer</b>
        </span>
        <div className='rating-score'>
            {[1, 2, 3, 4, 5].map(i => <span 
                key={i}
                onClick={_ => setScore(i)}
                className={i <= score ? 'on': 'off'}
            >
                {i <= score? <StarsIcon />: <RadioButtonUncheckedRoundedIcon />}
            </span>)}
        </div>
    </div>
}

const MultipleChoice = ({content}) => {
    return null;
}

const RelatedQuestions = ({qs, socket}) => {
    const [viewRel, setViewRel] = useState(false);

    const user = useContext(userContext).user;

    const toggleRel = () => setViewRel(!viewRel);

    const ask = (txt) => {
        const nc = {
            time: getCurrentTime(true),
            user: user,
            type: 'chat',
            text: txt
        }
        socket.emit('ask-bob', {
            chat: nc,
            conversationID: user.userid
        });
    }
    
    return <div className='related-questions'>
        <span className={'text' + (viewRel? ' rel': '')}
            onClick={toggleRel}
        >
            <img src={require('../../imgs/bob/related.svg')} />
            <b>Wanna see some related questions?</b>
        </span>
        {viewRel? <div>
            {qs.map((q, id) => <div className='rel-q'>
                <span className='text' onClick={_ => ask(q[1])}>
                    {q[1]}
                </span>
            </div>)}
        </div>:null}
    </div>
}

const AnswerInsights = ({content}) => {
    return <div className='answer-insights'>
        <div className='full-answer'>
            <h4><img src={require('../../imgs/bob/A.svg')} /> Full answer:</h4>
            {content.text}
        </div>
    </div>
}

const Answer = ({content, socket, setIns}) => {
    const [pin, setPin] = useState(false);
    const [mini, setMini] = useState(false);

    const togglePin = () => setPin(!pin);
    const toggleMini = () => setMini(!mini);

    return <div> 
        <div className='chat'>
            <span className='text'>I found something for you</span>
        </div>
        <div 
            className={'answer'} 
            onMouseEnter={_ => setIns(content)} 
            onMouseLeave={_ => setIns(null)}
        >
            <div className='taskbar'>
                <Button className={pin? 'pinned' : 'pin'} 
                    onClick={togglePin}>
                    <img src={require('../../imgs/bob/pin.svg')}/>
                </Button>
            </div>
            <span 
                className='answer-text' 
                dangerouslySetInnerHTML={{
                    __html: '... ' + content.text
                }}
            />
        </div>
        <RateTheAnswer />
        <RelatedQuestions qs={content.related_questions} socket={socket}/>
    </div>
}

const ChatSegment = (props) => {
    // get user context
    const user = useContext(userContext).user;

    let cl = 'chat-segment';
    let isBob = false;
    // check if these phrases are spoken by current user
    if (props.chats.length > 0) {
        if (user.username == props.chats[0].user.username) cl += ' me';
        if (props.chats[0].user.username == 'bob') {
            cl += ' chatbot';
            isBob = true;
        }
    }
    return <div className={cl}>
        {isBob ? <div className='user'>
            <img src={require('../../imgs/bob/robot.svg')} />
        </div>: null}
        <div className='content'>
            {props.chats.map((c, id) => {
                if (c.type == 'chat') return <Chat key={id} content={c}/>;
                if (c.type == 'answer') 
                    return <Answer key={id} content={c} socket={props.socket} setIns={props.setIns}/>;
            })}
        </div>
    </div>
}

const Hints = ({hints, applyHint}) => {
    const [focus, setFocus] = useState(-1);

    const toggleHint = (i) => {
        setFocus(i);
    }

    return <div className='question-hints'>
        {hints.map((h, id) => <div 
            key={id} 
            className={'hint' + (focus==id? ' focus': '')}
            onMouseEnter={_ => toggleHint(id)}
            onMouseLeave={_ => toggleHint(-1)}
            onClick={_ => applyHint(h[1])}
        >
            <span>{h[1]}</span><span className='similarity-score'>{`${parseInt(h[2] * 100)}%`}</span>
        </div>)}
    </div>
}

const NewChat = (props) => {
    const [newchat, setNewchat] = useState('');
    const [viewHints, setViewHints] = useState(true);

    const input = useRef(null);
    const sending = useRef(null);
    const user = useContext(userContext).user;

    const viewHideHints = () => {
        setViewHints(!viewHints);
    }

    const handleChange = (e) => {
        setNewchat(e.target.value);
        props.socket.emit('ask-for-hints-bob', {
            'typing': e.target.value,
            'conversationID': user.userid
        })
    }

    const applyHint = (h) => {
        setNewchat(h);
        input.current.value = h;
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

    const askRelatedQ = (q) => {
        setNewchat(h);
        input.current.value = h;
        send();
    }

    const handleKeyPress = (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault();
        sending.current.click();
    }

    return <div className='new-chat'>
        {viewHints & newchat != '' & newchat != ' ' & props.hints.length > 0 ?
            <Hints hints={props.hints} applyHint={applyHint}
            />
        : null}
        <Button className={'show-hints' + (viewHints? '': ' not-show')} 
            onClick={viewHideHints}
        >
            <img src={require('../../imgs/bob/hint.svg')}/>
        </Button>
        <TextareaAutosize
            ref={input}
            placeholder='ask a question'
            onChange={handleChange}
            onKeyPress={handleKeyPress}
        />
        <Button onClick={send} ref={sending}><img src={require('../../imgs/bob/send.svg')}/></Button>
    </div>
}

const Ask = (props) => {
    const [ins, setIns] = useState(null);

    const setIns_ = (cnt) => {
        console.log('yuf');
        setIns(cnt);
    }

    let chatSegments = [];
    let segment = [];
    let currentUser = '';
    props.chats.forEach((c, id) => {
        if (c.user.username != currentUser) {
            currentUser = c.user.username;
            if (segment.length > 0) {
                chatSegments.push(segment);
                segment = [];
            }
        }
        segment.push(c);
        
    })
    if (segment) chatSegments.push(segment);

    return <div className='ask'>
        {ins? <AnswerInsights content={ins} />: null}
        <div className='old-chats'>
            {chatSegments.map((p, id) => {
                return <ChatSegment key={id} chats={p} socket={props.socket} setIns={setIns_}/>
            })}
        </div>
        <NewChat socket={props.socket} hints={props.hints}/>
    </div>
}

export default Ask;