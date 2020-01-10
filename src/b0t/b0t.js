import './_b0t.scss';
import React, { Component, useState, useContext, useEffect } from 'react';
import { userContext } from '../user-context/user-context';
import $ from 'jquery';

class B0t extends Component {
    state = {
        chats: [],
        newchat: '',
        hide: false,
        dests: ['bot'],
        currDest: 0
    }

    updateChat = (msg) => {
        if (msg.sender == this.props.username || msg.dest == this.props.username) {
            let copy = this.state.chats.slice();
            copy.push({sender: msg.sender, dest: msg.dest, msg: msg.msg});
            this.setState({chats: copy});
            if (msg.sender != this.props.username && this.state.dests.indexOf(msg.sender) < 0) {
                let cp_list = this.state.dests.slice();
                cp_list.push(msg.sender);
                this.setState({dests: cp_list});
            }
            else if (msg.dest != this.props.username && this.state.dests.indexOf(msg.dest) < 0) {
                let cp_list = this.state.dests.slice();
                cp_list.push(msg.dest);
                this.setState({dests: cp_list});
            }
        }
    }

    async componentDidMount() {
        this.props.socket.emit('submit chat', {sender: 'bot', dest: this.props.username, msg: 'Knock Knock Neo ...'});
        this.props.socket.on('new chat', msg => this.updateChat(msg));
    }

    componentDidUpdate(prevProps) {
        if (this.props.username != prevProps.username) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
        {
            this.props.socket.emit('submit chat', {sender: 'bot', dest: this.props.username, msg: 'Knock Knock Neo ...'});
        }
    } 

    onChange = (e) => {
        this.setState({newchat: e.target.value});
    }

    submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        if (!this.state.newchat) return;
        this.props.socket.emit('submit chat', 
            {sender: this.props.username, dest: this.state.dests[this.state.currDest], msg: this.state.newchat});
        this.setState({newchat: ''});
        
        $(e.currentTarget).val('');     
    }

    chooseDest = (id) => {
        this.setState({currDest:id});
    }

    render() {
        return (
            <div className='b0t'>
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
                                        <span>{c.msg}</span>
                                        <span className='user'>{c.sender}:</span>
                                    </div>
                                    {b0ticon}
                                </div>
                            )
                        })}
                    </div>
                    <div className='newchat'>
                        <textarea 
                            rows={1}
                            placeholder='chat something'
                            onChange={this.onChange}
                            onKeyPress={this.submit}
                        />
                    </div>
                </div>
                
                
            </div>
        )
    }
}
export default B0t;
