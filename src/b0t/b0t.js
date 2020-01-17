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
import lesson from '../../imgs/lesson.svg'

const hints_1 = [{hint: 'what is machine learning?', confidence: '89%'},
    {hint: 'what is deep learning?', confidence: '84%'}];
const hints_2 = [{hint: 'what is machine learning?', confidence: '97%'},
    {hint: 'what does machine learning do?', confidence: '78%'}];
const hints_3 = [{hint: 'what does machine learning do?', confidence: '96%'}]
 //   {hint: 'what is machine learning?', confidence: '85%'}]
const hints_4 = [{hint: 'i want to talk to', confidence: '100%'}];
const hints_5 = [{hint: "<a className='p-tag'>@Alexis</a>"}, 
    {hint: "<a className='p-tag'>@Max</a>"}, 
    {hint: "<a className='p-tag'>@Evelie</a>"}];

const hints_6 = [{hint: 'what is the algorithm behind neural network?', confidence: '93%'}]

const Newchat = (props) => {
    const [newchat, setNewchat] = useState('');
    const [focus, setFocus] = useState(-1);
    const [hints, setHints] = useState([]);
    const user = useContext(userContext).user;
    const onChange = async(e) => {
        setNewchat(e.target.value);
        if (newchat && newchat.indexOf('what is mach') > -1) setHints(hints_2);
        else if (newchat && (newchat.indexOf('the algorithm behind') > -1 || newchat.indexOf('what is the algo') > -1)) 
            setHints(hints_6);
        else if (newchat && newchat.indexOf('what is') > -1) setHints(hints_1);
        else if (newchat && newchat.indexOf('what does machi') > -1) setHints(hints_3);
        else if (props.dest == 'bot' && newchat && newchat.indexOf('i want to talk to') > -1) setHints(hints_5);
        else if (props.dest == 'bot' && newchat && newchat.indexOf('i want to') > -1) setHints(hints_4);
        else setHints([]);
    }
    const submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode == 13) {
            e.preventDefault();
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
            setHints([]);
            setFocus(-1);
            $(e.currentTarget).val('');     
        }
    }

    const keyBehave = async (e) => {
        // apply 'hint' when press 'tab', escape hints when press 'esc'
        let keycode = e.keyCode || e.which;
        if (keycode == 9) {
            e.preventDefault();
            if (hints.length > 0) {
                if (focus < hints.length-1) {
                    let s = hints[focus+1].hint;
                    try {s = $(hints[focus+1].hint).html()} catch (e) {};
                    if (!s) s = hints[focus+1].hint;
                    setNewchat(s);
                    $(e.currentTarget).val(s);
                }  
                setFocus((focus < hints.length - 1) ? focus+1: -1);
            }
        } else if (e.key == 'Escape') {
            e.preventDefault();
            setHints([]);
        }
    }

    return (
        <div className='newchat'>
            <div className='hints'>
                {hints.length > 0 ? <div className='help-hint'><span>see if your question is here ...</span></div>: null}
                {hints.map((h, i) => (<div className={'hint' + ((focus == i)? ' focus': '')} key={i}>
                        <span dangerouslySetInnerHTML={{__html: h.hint}} />
                        <span className='confid'>{h.confidence}</span>
                    </div>))}
            </div>
            {props.referral? <span className='referral'>
                to {props.referral} <i onClick={props.unsetReferral} className="fas fa-times"></i></span>: null}
            <textarea 
                rows={1}
                placeholder='chat something'
                onChange={onChange}
                onKeyPress={submit}
                onKeyDown={keyBehave}
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
        supp_info: {}
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
            this.setState({chats: copy});
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
        let first_msg = 'Knock Knock... Neo! Wake up!';
        for (let i = 0; i <= first_msg.length; i++) {
            if (i == 1 || i == 15) await new Promise(res => setTimeout(() => res(), 2000));
            else await new Promise(res => setTimeout(() => res(), 100));
            this.setState({chats: [{sender: 'bot', dest: this.props.username, msg: first_msg.substr(0, i)}]})
        }
        this.props.socket.on('new chat', msg => this.updateChat(msg));
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.chats.length != this.state.chats.length) {
            if ($('.oldchats').outerHeight() + $('.oldchats').scrollTop() != $('.oldchats')[0].scrollHeight) {
                $('.oldchats').animate({scrollTop: $('.oldchats')[0].scrollHeight});
            }
        } 
        
        if (this.props.username != prevProps.username) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
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

    toogleFullAnswer = async (id, e) => {
        console.log(id);
        let s = $(e.currentTarget).parent().parent().parent().parent().children('.fullanswer')
        if (s.attr('class') == 'fullanswer show') {
            s.attr('class', 'fullanswer hide');
            if (this.state.supp_info) {
                this.setState({ supp_info:  {}});
            }
        }
        else {
            s.attr('class', 'fullanswer show');
            if (id > -1) {
                let response = await fetch(`/get-post-title?postId=${id}`, {method: 'POST'});
                let data = await response.json();
                this.setState({ supp_info:  {course: {title: data.title, id: id}}});
            } else {
                if (this.state.supp_info) {
                    this.setState({ supp_info:  {}});
                }
            }
        };
    }

    likeAnswer = e => {
        $(e.currentTarget).parent().attr('data-like', '1');
    }
    dislikeAnswer = e => {
        $(e.currentTarget).parent().attr('data-like', '0');
    }

    setReferral = name => {
        this.setState({referral: name})
    }

    unsetReferral = _ => {
        this.setState({referral: ''})
    }

    render() {
        if (this.state.hide) return (
            <div className='hide-b0t'>
                <button className='showhide-ter' onClick={_ => this.showhide()}>Open Terminal</button>
            </div>
        )

        const Nos = {notifs: this.state.notifs, updateNotifs: this.updateNotifs};
        const reprops = {
            defaultSize: {
                width:'100%',
                height:350,
            }, minWidth: '100%', minHeight: 200, maxWidth: '100%', maxHeight: 600, position: 'absolute'}
        return (
            <NotifContext.Provider value={Nos}>
            <Resizable {...reprops} className='b0t'>
                <button className='showhide-ter' onClick={_ => this.showhide()}>Hide Terminal</button>
                <div className='chat-list'>
                    {this.state.dests.map((d, id) => {
                        if (id == this.state.currDest) 
                            return <span key={id} data-iscurr onClick={_ => this.chooseDest(id)}>{d}</span>;
                        return <span key={id} onClick={_ => this.chooseDest(id)}>{d}</span>;
                    })}
                </div>
                <div className='chat-section'>
                    <div className='oldchats'>
                        {this.state.chats.map((c, id) => {
                            let course_id = c.courses || -1;
                            let seefull = c.fullanswer ? <a onClick={e => this.toogleFullAnswer(course_id, e)}>see more</a>: null;
                            
                            if (c.sender != this.state.dests[this.state.currDest] && 
                                c.dest != this.state.dests[this.state.currDest]) return;

                            let b0ticon = (c.sender == 'bot') ? <span className='ava'><img src={bot} /></span>: 
                                <span className='ava'><img src={mStud}/></span>;
                            let identifier = (c.sender == this.props.username) ? 'iden me-chat': 'iden other-chat'
                            let cl = 'msg';
                            if (c.sender == 'bot') {
                                cl += ' bot';
                            } else if (c.sender != this.props.username) {
                                cl += ' others';
                            } else {cl += ' me'}
                            return (
                                <div key={id} className='chat'>
                                    <div className={identifier}>
                                        {b0ticon}
                                        <div className={cl}>
                                            <span className='user'>{c.sender}:</span>
                                            <span>{c.msg}{seefull}{(id == this.state.chats.length-1 && c.sender=='bot') ? <span className='blink'>|</span>: ''}</span>
                                            {c.referral ? <span className='reply-to' onClick={_ => this.setReferral(c.referral)}>
                                                    <i className="fas fa-reply"></i> {c.referral}
                                                </span>: null}
                                        </div>
                                    </div>
                                    
                                    {c.fullanswer ? <div className='fullanswer hide'>
                                        <MdRender source={c.fullanswer} />
                                        <div className='title-icon'><img src={qa}/></div>
                                        <div className='good' onClick={this.likeAnswer}><i className="fas fa-check fa-fw"></i></div>
                                        <div className='bad' onClick={this.dislikeAnswer}><i className="fas fa-times fa-fw"></i></div>
                                    </div>: null}
                                </div>
                            )
                        })}
                    </div>
                    <Newchat 
                        socket={this.props.socket} 
                        dest={this.state.dests[this.state.currDest]} 
                        referral={this.state.referral}
                        unsetReferral={this.unsetReferral}
                    />
                </div>
                <Notif />
                <div className='supp-info'>
                    <span className='title-icon'><img src={idea} /></span>
                    {this.state.supp_info.course? 
                        <div className='relevant-course'>
                            <span><img src={lesson} /></span>
                            <span>Relevant Course: <a onClick={_ => this.props.viewFullPost(this.state.supp_info.course.id)}>
                                {this.state.supp_info.course.title}</a>
                            </span>    
                        </div> : null }
                </div>
            </Resizable>
            </NotifContext.Provider>
        )
    }
}
export default B0t;
