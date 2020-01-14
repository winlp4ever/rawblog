import './_b0t.scss';
import React, { Component, useState, useContext, useEffect } from 'react';
import { userContext } from '../user-context/user-context';
import $ from 'jquery';
import Notif, { NotifContext } from '../notif/notif';

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

const Newchat = (props) => {
    const [newchat, setNewchat] = useState('');
    const [focus, setFocus] = useState(-1);
    const [hints, setHints] = useState([]);
    const user = useContext(userContext).user;
    const onChange = async(e) => {
        setNewchat(e.target.value);
        if (newchat && newchat.indexOf('what is mach') > -1) setHints(hints_2);
        else if (newchat && newchat.indexOf('what is') > -1) setHints(hints_1);
        else if (newchat && newchat.indexOf('what does machi') > -1) setHints(hints_3);
        else if (props.dest == 'bot' && newchat && newchat.indexOf('i want to talk to @') > -1) setHints(hints_5);
        else if (props.dest == 'bot' && newchat && newchat.indexOf('i want to ta') > -1) setHints(hints_4);
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
            else props.socket.emit('submit chat', 
                {sender: user.name, dest: props.dest, msg: newchat});
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
        fullanswer:''
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
            if (msg.fullanswer) {
                this.viewFullAnswer(msg.fullanswer);
            }
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

    viewFullAnswer = (ans) => {
        if (ans) {
            this.setState({fullanswer: ans})
        }
    }

    cancelFullAnswer = () => {
        this.setState({fullanswer: ''})
    }

    render() {
        if (this.state.hide) return (
            <div className='hide-b0t'>
                <button className='showhide-ter' onClick={_ => this.showhide()}>Open Terminal</button>
            </div>
        )

        const Nos = {notifs: this.state.notifs, updateNotifs: this.updateNotifs};

        return (
            <NotifContext.Provider value={Nos}>
            <div className='b0t'>
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
                            let seefull = c.fullanswer ? <a onClick={_ => this.viewFullAnswer(c.fullanswer)}>here</a>: null;

                            if (c.sender != this.state.dests[this.state.currDest] && 
                                c.dest != this.state.dests[this.state.currDest]) return;
                            let b0ticon = '';
                            let cl = 'msg';
                            if (c.sender == 'bot') {
                                b0ticon = <div><i className="fas fa-robot"></i></div>;
                                cl += ' bot';
                            } else if (c.sender != this.props.username) {
                                cl += ' others';
                            }
                            return (
                                <div key={id}>
                                    <div className={cl}>
                                        <span>{c.msg}{seefull}{(id == this.state.chats.length-1 && c.sender=='bot') ? <span className='blink'>|</span>: ''}</span>
                                        <span className='user'>{c.sender}:</span>
                                    </div>
                                    {b0ticon}
                                </div>
                            )
                        })}
                        {this.state.fullanswer ? <div className='fullanswer'>
                            <span>{this.state.fullanswer}</span>
                            <button className='cancel' onClick={this.cancelFullAnswer}><i className="fas fa-times-circle"></i></button>
                        </div>: null}
                    </div>
                    <Newchat socket={this.props.socket} dest={this.state.dests[this.state.currDest]} />
                </div>
                <Notif />
            </div>
            </NotifContext.Provider>
        )
    }
}
export default B0t;
