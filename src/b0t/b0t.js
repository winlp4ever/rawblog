import './_b0t.scss';
import React, { Component, useContext } from 'react';
import { userContext } from '../user-context/user-context';
import $ from 'jquery';
import Img from '../../imgs/discuss.svg';

export default class B0t extends Component {
    state = {
        chats: [],
        newchat: ''
    }

    async componentDidMount() {
        let copy = this.state.chats.slice();
        copy.push({user: 'b0t', msg: 'Knock Knock Neo...'});
        this.setState({chats: copy});
        this.props.socket.on('bot-msg', msg => {
            let copy = this.state.chats.slice();
            copy.push({user: 'b0t', msg: msg});
            this.setState({chats: copy})
        })
    }

    onChange = (e) => {
        this.setState({newchat: e.target.value});
    }

    submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        if (!this.state.newchat) return;
        console.log(this.state.chats)
        const userdata = {name: 'me', email: ''};
        this.props.socket.emit('user-msg', this.state.newchat);
        let copy = this.state.chats.slice();
        copy.push({user: userdata.name, msg: this.state.newchat});
        this.setState({chats: copy, newchat: ''});
        $(e.currentTarget).val('');     
    }

    render() {
        return (
            <div className='b0t'>
                <div className='icon'>
                    <img src={Img} />
                </div>
                <div className='chat-section'>
                    {this.state.chats.map((c, id) => {
                        let b0ticon = '';
                        let cl = 'msg';
                        if (c.user == 'b0t') {
                            b0ticon = <div><i className="fas fa-robot"></i></div>;
                            cl += ' bot';
                        }
                        return (
                            <div key={id}>
                                <div className={cl}>
                                    <span>{c.msg}</span>
                                    <span className='user'>:{c.user}</span>
                                </div>
                                {b0ticon}
                            </div>
                        )
                    })}
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