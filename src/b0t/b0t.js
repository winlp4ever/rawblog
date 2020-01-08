import './_b0t.scss';
import React, { useState, useContext, useEffect } from 'react';
import { userContext } from '../user-context/user-context';
import $ from 'jquery';
import Img from '../../imgs/discuss.svg';

const Disclaimer = () => {
    return (
        <div className='disclaimer'>
            <b>ATTENTION!</b> This chatbot is just a small demo!
        </div>
    )
}

const B0t = props => {
    const [chats, setChats] = useState([]);
    const [newchat, setNewchat] = useState('');
    const [hide, setHide] = useState(false)
    
    const userdata = useContext(userContext);

    console.log(userdata);

    useEffect(() => {
        let copy = chats.slice();
        copy.push({user: 'b0t', msg: 'Knock Knock Neo...'});
        setChats(copy);
        props.socket.on('bot-msg', msg => {
            let copy = chats.slice();
            copy.push({user: 'b0t', msg: msg});
            setChats(copy)
        })
    }, [])

    const hideUnhide = (e) => {
        if (hide) {
            $(e.currentTarget).parent().parent().children('.chat-section').css({'display':''});
        } else {
            $(e.currentTarget).parent().parent().children('.chat-section').css({'display': 'none'});
        }
        setHide(!hide);
    }

    const onChange = (e) => {
        setNewchat(e.target.value);
    }

    const submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        if (!newchat) return;
        props.socket.emit('user-msg', newchat);
        let copy = chats.slice();
        copy.push({user: userdata.user.name, msg: newchat});
        setChats(copy);
        setNewchat('')
        $(e.currentTarget).val('');     
    }

    return (
        <div className='b0t'>
            <Disclaimer />
            <div className='icon'>
                <img onClick={hideUnhide} src={Img} />
            </div>
            <div className='chat-section'>
                {chats.map((c, id) => {
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
                        onChange={onChange}
                        onKeyPress={submit}
                    />
                </div>
            </div>
            
        </div>
    )
}

export default B0t;
