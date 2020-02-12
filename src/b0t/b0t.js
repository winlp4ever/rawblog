import './_b0t.scss';
import React, { Component, useState, useContext, useEffect } from 'react';
import { userContext } from '../user-context/user-context';
import $ from 'jquery';
import Notif, { NotifContext } from '../notif/notif';
import { Resizable } from 're-resizable';
import MdRender from '../markdown-render/markdown-render';
import bot from '../../imgs/support.svg';
import qa from '../../imgs/qa.svg';
import mStud from '../../imgs/m-stud.svg';
import idea from '../../imgs/idea.svg';
import lesson from '../../imgs/lesson.svg';
import toread from '../../imgs/toread.svg';
import Send from '../../imgs/send.svg';
import {CSSTransition} from 'react-transition-group';

const Newchat = (props) => {
    const [newchat, setNewchat] = useState('');
    const [focus, setFocus] = useState(-1);
    const [cursorOn, setCursorOn] = useState(false);
    const user = useContext(userContext).user;
    const onChange = async(e) => {
        setNewchat(e.target.value);
        props.socket.emit('ask for hints', {sender: user.name, msg: e.target.value});
    }
    const sendNewChat = () => {
        if (!newchat) return;
        if (newchat.indexOf('@') == 0 && props.dest == 'bot') {
            props.socket.emit('submit chat',
                {sender: user.name, dest: newchat.substr(1, newchat.length-1), msg: 'Hi'})
        }
        else {
            if (props.referral) 
                props.socket.emit('submit chat', {sender: user.name, dest: props.dest, msg: newchat, referral: props.referral});
            else props.socket.emit('submit chat', {sender: user.name, dest: props.dest, msg: newchat});
        }
        setNewchat('');
        setFocus(-1);
        props.resetHints();
    }
    const submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode == 13) {
            e.preventDefault();
            sendNewChat();
            $(e.currentTarget).val('');     
        }
    }

    const clickSend = async (e) => {
        sendNewChat();
        $(e.currentTarget).parent().children('textarea').val('');
    }

    const checkCursorOn = async () => {
        setCursorOn(true);
    }

    const checkCursorOff = async () => {
        setCursorOn(false)
    }

    const keyBehave = async (e) => {
        // apply 'hint' when press 'tab', escape hints when pressing 'esc'
        let keycode = e.keyCode || e.which;
        if (keycode == 9) {
            e.preventDefault();
            if (props.hints.length > 0) {
                if (focus < props.hints.length-1) {
                    let s = props.hints[focus+1].hint;
                    try {s = $(props.hints[focus+1].hint).html()} catch (e) {};
                    if (!s) s = props.hints[focus+1].hint;
                    setNewchat(s);
                    $(e.currentTarget).val(s);
                }  
                setFocus((focus < props.hints.length - 1) ? focus+1: -1);
            }
        } else if (e.key == 'Escape') {
            e.preventDefault();
            props.resetHints();
        }
    }
    let cl = 'newchat';
    if (cursorOn) cl = 'newchat typing';
    return (
        <div className={cl}>
            <div className='hints'>
                {props.hints.length > 0 ? <div className='help-hint'><span>see if your question is here ...</span></div>: null}
                {props.hints.map((h, i) => (<div className={'hint' + ((focus == i)? ' focus': '')} key={i}>
                        <span dangerouslySetInnerHTML={{__html: h.hint}} />
                        <span className='confid'>{parseFloat(h.confidence)*100}%</span>
                    </div>))}
            </div>
            <div className='send'onClick={clickSend}><img src={Send} /></div>
            {props.referral? <span className='referral'>
                to {props.referral} <i onClick={props.unsetReferral} className="fas fa-times"></i></span>: null}
            <textarea 
                rows={1}
                placeholder='chat something'
                onChange={onChange}
                onKeyPress={submit}
                onKeyDown={keyBehave}
                onFocus={checkCursorOn}
                onBlur={checkCursorOff}
            />
        </div>
    )
}

class B0t extends Component {
    _isMounted = false;
    state = {
        chats: [],
        hide: false,
        dests: ['bot'],
        currDest: 0,
        notifs: [],
        referral: '',
        insights: {},
        hints: [],
        is_typing: false
    }

    updateNotifs = async () => {
        let l = this.state.notifs.length;
        if (this.state.notifs.length > 0) {
            this.setState({notifs: this.state.notifs.splice(1, l-1)});
        }
    }

    addNotif = (newnotif) => {
        let copy = this.state.notifs.slice();
        copy.push(newnotif);
        this.setState({notifs: copy});
    }

    updateChat = async (msg) => {
        if (msg.sender == this.props.username || msg.dest == this.props.username) {
            let copy = this.state.chats.slice();
            copy.push(msg);
            this.setState({chats: copy, is_typing: false});
            if (msg.sender != this.props.username && this.state.dests.indexOf(msg.sender) < 0) {
                let cp_list = this.state.dests.slice();
                cp_list.push(msg.sender);
                this.setState({dests: cp_list});
                this.addNotif(`new person added to chat list: ${msg.sender}`);
            }
            else if (msg.dest != this.props.username && this.state.dests.indexOf(msg.dest) < 0) {
                let cp_list = this.state.dests.slice();
                cp_list.push(msg.dest);
                this.setState({dests: cp_list});
                this.addNotif(`new person added to chat list: ${msg.dest}`);
            }
        }
    }

    async componentDidMount() {
        //this.props.socket.emit('submit chat', {sender: 'bot', dest: this.props.username, msg: 'Knock Knock Neo ...'});
        this._isMounted = true;
        let first_msg = ' Knock Knock... Neo! Wake up!';
        for (let i = 1; i <= first_msg.length; i++) {
            if (i == 1 || i == 15) await new Promise(res => setTimeout(() => res(), 2000));
            else await new Promise(res => setTimeout(() => res(), 100));
            this.setState({chats: [{sender: 'bot', dest: this.props.username, msg: first_msg.substr(0, i) || 'K'}]})
        }
        this.props.socket.on('new chat', msg => this.updateChat(msg));
        this.props.socket.on('hints', msg => {
            if (msg.dest == this.props.username) {
                this.setState({hints: msg.hints})
            }
        })
        this.props.socket.on('is typing', msg => {
            if (msg.dest == this.props.username) {
                this.setState({is_typing: true})
            }
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.chats.length != this.state.chats.length) {
            if ($('.oldchats').outerHeight() + $('.oldchats').scrollTop() != $('.oldchats')[0].scrollHeight) {
                $('.oldchats').animate({scrollTop: $('.oldchats')[0].scrollHeight});
            }
        } 
        
        if (this.props.username != prevProps.username) // Check if it's a new user, you can also use some unique property, 
        //like the ID  (this.props.user.id !== prevProps.user.id)
        {
            //this.props.socket.emit('submit chat', {sender: 'bot', dest: this.props.username, msg: 'Knock Knock Neo ...'});
        }
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    chooseDest = (id) => {
        this.setState({currDest:id});
    }

    showhide = () => {
        this.setState({hide: !this.state.hide});
    }

    // view full answer
    viewInsights = async (toread, id, e) => {
        let insights = {}
        if (id > -1) {
            let response = await fetch(`/get-post-title?postId=${id}`, {method: 'POST'});
            let data = await response.json();
            insights.course = {title: data.title, id: id}
        } 
        if (toread) {
            insights.toread = toread;
        }
        this.setState({insights: insights})
    }

    closeInsights = async () => {
        this.setState({insights: {}});
    }

    setReferral = name => {
        this.setState({referral: name})
    }

    unsetReferral = _ => {
        this.setState({referral: ''})
    }

    resetHints = _=> {
        this.setState({hints: []});
    }

    render() {
        const Nos = {notifs: this.state.notifs, updateNotifs: this.updateNotifs};
        const reprops = {
            defaultSize: {
                width:'100%',
                height: this.state.hide ? 25: 350,
            }, 
            minWidth: '100%', 
            minHeight: this.state.hide ? 25: 200, 
            maxWidth: '100%', maxHeight: this.state.hide ? 25: 600, 
            position: 'absolute'
        }
        var sameperson = []

        const chats = []
        this.state.chats.map((c, id) => {
            let course_id = c.courses || -1;
            let viewinsights = (c.toread | course_id >= 0)? 
                <a onClick={e => this.viewInsights(c.toread, course_id, e)}>see here</a>: null

            let blink = (id == this.state.chats.length-1 && c.sender=='bot') ? <span className='blink'></span>: null;

            if (c.sender != this.state.dests[this.state.currDest] && 
                c.dest != this.state.dests[this.state.currDest]) return;

            let b0ticon = (c.sender == 'bot') ? <span className='ava'><img src={bot} /></span>: 
                <span className='ava'><img src={mStud}/></span>;
            let identifier = (c.sender == this.props.username) ? 'iden me-chat': 'iden other-chat';
            let cl = 'msg';
            if (id == this.state.chats.length-1) cl = 'appear ' + cl;
            if (id == 0 || this.state.chats[id-1].sender != c.sender) cl = 'first ' + cl;
            if (id == this.state.chats.length-1 || this.state.chats[id+1].sender != c.sender)
                cl = 'last ' + cl;
            if (c.sender == 'bot') {
                cl += ' bot';
            } else if (c.sender != this.props.username) {
                cl += ' others';
            } else {cl += ' me'}
            if (c.type && c.type == 'answer') cl += ' answer';
            let chat_ = (
                <div key={id} className='chat'>
                    <div className={identifier}>
                        {(id == this.state.chats.length-1 || this.state.chats[id+1].sender != c.sender) ? 
                            <div className='user-and-date'>
                                {b0ticon}
                                <span className='user'>{c.sender}:</span>
                            </div>: <div className='user-and-date' />
                        }
                        
                        <div className={cl}>
                            <span className='seemore'>
                                {c.msg + ' '}{viewinsights}
                                {blink}
                            </span>
                            {c.referral ? 
                            <span className='reply-to' onClick={_ => this.setReferral(c.referral)}>
                                <i className="fas fa-reply"></i> {c.referral}
                            </span>: null}
                        </div>
                    </div>
                </div>
            );
            sameperson.push(chat_)  
            if (id == this.state.chats.length-1 || this.state.chats[id+1].sender != c.sender) {
                chats.push(<div className='same-person'>{sameperson}</div>);
                sameperson = [];
            }
            
        })

        return (
            <NotifContext.Provider value={Nos}>
            <Resizable {...reprops} className={this.state.hide? 'hide-b0t': 'b0t'}>
                <button className='showhide-ter' onClick={_ => this.showhide()}>
                    {this.state.hide? 'Ask me!': 'Hide me!'}
                </button>
                <div className='chat-list'>
                    {this.state.dests.map((d, id) => {
                        if (id == this.state.currDest) 
                            return <span key={id} data-iscurr onClick={_ => this.chooseDest(id)}>{d}</span>;
                        return <span key={id} onClick={_ => this.chooseDest(id)}>{d}</span>;
                    })}
                </div>
                <div className='chat-section'>
                    <div className='oldchats'>
                        {chats}
                        {this.state.is_typing? <div className='is-typing'>
                            <div /><div /><div /><div />
                        </div>: null}
                    </div>
                    <Newchat 
                        socket={this.props.socket} 
                        dest={this.state.dests[this.state.currDest]} 
                        referral={this.state.referral}
                        unsetReferral={this.unsetReferral}
                        hints={this.state.hints}
                        resetHints={this.resetHints}
                    />
                </div>
                <Notif />
                
                <CSSTransition
                    in={this.state.insights.course? true: false}
                    timeout={200}
                    classNames="display"
                    unmountOnExit
                >
                <div className='supp-info'>
                    <button className='close' onClick={this.closeInsights}><i className="fas fa-times"></i></button>
                    <span className='title-icon'><img src={idea} /></span>
                    {this.state.insights.course? 
                        <div className='relevant-course'>
                            <span><img src={lesson} /></span>
                            <span>Relevant Course: <a onClick={_ => this.props.viewFullPost(this.state.insights.course.id)}>
                                {this.state.insights.course.title}</a>
                            </span>    
                        </div> : null }
                    {this.state.insights.toread?
                        <div className='toread'>
                            <span><img src={toread} /></span>
                            <span>To read more on this topic:</span>
                            <ul>
                            {this.state.insights.toread.map((t, j) => 
                                <li key={j}><a href={t} target='_blank'>{t}</a></li>)}
                            </ul>
                        </div>:null
                    }
                </div>
                </CSSTransition>
            </Resizable>
            </NotifContext.Provider>
        )
    }
}
export default B0t;
