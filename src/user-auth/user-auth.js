import React, { Component, useState, useContext } from 'react';
import './_user-auth.scss';
import { userContext } from '../user-context/user-context';

const Auth = () => {
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleChange = e => {
        setName(e.target.value);
    }

    const handlePass = (e) => {
        setPass(e.target.value);
    }

    const value = useContext(userContext);

    const handleSubmit = async () => {
        if (name == 'AII') {
            let response = await fetch('/admin-verify', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({pass: pass})
            });
            let data = await response.json();
            if (data.answer != 'y') return;
            setName('AII');
        }
        value.updateUser({name: name, email: email});
    } 

    let input_adminpass = '';
    if (name == 'AII') input_adminpass = <input onChange={handlePass} />
    return (   
        <div className='auth' onKeyPress={e => {
            let keycode = e.keyCode || e.which;
            if (keycode == 13) handleSubmit();
        }}>
            <span>How do you want to be called?</span>
            <input onChange={handleChange} placeholder='Enter your name'/>
            {input_adminpass}
            <button onClick={handleSubmit}>Let's go!</button>
        </div>
    )
}

export default Auth;