import './_b0t.scss';
import React, { useState, useContext, useEffect } from 'react';
import { userContext } from '../user-context/user-context';
import $ from 'jquery';
import Img from '../../imgs/discuss.svg';

const B0t = props => {
    const [chats, setChats] = useState([]);
    const [newchat, setNewchat] = useState('');
    const [hide, setHide] = useState(false);
    const [dests, setDests] = useState(['bot']);
    const [currDest, setCurrDest] = useState(0);
    
    const userdata = useContext(userContext);

    useEffect(() => {
        let copy = chats.slice();
        copy.push({sender: 'bot', dest: userdata.user.name, msg: 'Knock Knock Neo...'});
        setChats(copy);
        props.socket.on('bot-msg', msg => {
            let copy = chats.slice();
            copy.push({sender: 'bot', dest: userdata.user.name, msg: msg});
            setChats(copy);
        })
    }, [])

    const showHide = () => {
        setHide(!hide);
    }

    const onChange = (e) => {
        setNewchat(e.target.value);
    }

    const chooseDest = (id) => {
        setCurrDest(id);
    }

    const submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        if (!newchat) return;
        let copy = chats.slice();
        copy.push({sender: userdata.user.name, dest: dests[currDest], msg: newchat});
        
        if (dests[currDest] == 'bot') {
            if (newchat == 'what is bert2?') {
                copy.push({sender: 'bot', dest: userdata.user.name, msg: "I'm not qualified to answer this."});
                copy.push({sender: 'bot', dest: userdata.user.name, msg: "I will deliver this msg to professor Alpha!"});
                if (dests.indexOf('Prof. Alpha') < 0) {
                    copy.push({sender: 'Prof. Alpha', dest: userdata.user.name, msg: "Hi, please ask me..."});
                    let cp_list = dests.slice();
                    cp_list.push('Prof. Alpha');
                    setDests(cp_list);
                }
                
            } else {
                props.socket.emit('user-msg', newchat);
            }
        }
        setChats(copy);
        setNewchat('');
        
        $(e.currentTarget).val('');     
    }

    return (
        <div className='b0t'>
            <div className='chat-list'>
                {dests.map((d, id) => {
                    if (id == currDest) return <span key={id} data-iscurr onClick={_ => chooseDest(id)}>{d}</span>;
                    return <span key={id} onClick={_ => chooseDest(id)}>{d}</span>;
                })}
            </div>
            <div className='chat-section'>
                <div className='oldchats'>
                    {chats.map((c, id) => {
                        if (c.sender != dests[currDest] && c.dest != dests[currDest]) return;
                        let b0ticon = '';
                        let cl = 'msg';
                        if (c.sender == 'bot') {
                            b0ticon = <div><i className="fas fa-robot"></i></div>;
                            cl += ' bot';
                        } else if (c.sender != userdata.user.name) {
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
                        onChange={onChange}
                        onKeyPress={submit}
                    />
                </div>
            </div>
            
            
        </div>
    )
}

export default B0t;
