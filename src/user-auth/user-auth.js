import React, { Component, useState, useContext } from 'react';
import './_user-auth.scss';
import { userContext } from '../user-context/user-context';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';


const Auth = () => {
    const [name, setName] = useState('');
    const [email,setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleName = e => {
        setName(e.target.value);
    }

    const handlePass = (e) => {
        setPass(e.target.value);
    }

    const userdata = useContext(userContext);

    const handleSubmit = async () => {
        if (name == 'Wall-Q') {
            let response = await fetch('/admin-verify', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({pass: pass})
            });
            let data = await response.json();
            if (data.answer != 'y') return;
            setName('Wall-Q');
        }
        userdata.updateUser({name: name, email: email});
        setName('');
        setEmail('');
    } 

    const handleEnter = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        handleSubmit();
    }

    const signOut = async () => {
        userdata.updateUser({name: '', email: ''});
    }

    console.log(userdata.user.name);

    if (userdata.user.name != '') return (<div className='user-panel'>
        <span>Hi, {userdata.user.name}</span> <Button onClick={signOut}><Icon iconName='SignOut'/></Button></div>)

    return (   
        <div className='auth' onKeyPress={handleEnter}>
            <div className='auth-line'>
                <Icon iconName='FollowUser'/>
                <TextField label='enter your name' onChange={handleName}/>
            </div>
            {name == 'Wall-Q' ? <div className='auth-line'>
                    <Icon iconName='PasswordField' />
                    <TextField label='admin password' onChange={handlePass} type='password'/>
                </div>: null}
            <Button variant='outlined' startIcon={<Icon iconName='Signin'/>} onClick={handleSubmit}>Log In</Button>
        </div>
    )
}

export default Auth;