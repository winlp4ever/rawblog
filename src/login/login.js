import React, {Component} from 'react';
import './_login.scss';
import $ from 'jquery';
import bg from '../../imgs/bg_.svg';
import Button from '@material-ui/core/Button';


export default class Login extends Component {
    state = {
        username: '',
        password: ''
    }

    componentDidMount() {

    }

    handleChange = (e) => {
        if ($(e.currentTarget).parent().attr('class') == 'enter-username') this.setState({username: e.target.value});
        if ($(e.currentTarget).parent().attr('class') == 'enter-password') this.setState({password: e.target.value});
        console.log(`${this.state.username} - ${this.state.password}`);
    }

    submit = async (e) => {
        //if (!this.state.username || !this.state.password) return;
        console.log('clicked');
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: this.state.username,
                password: this.state.password
            })
        });
        const data = await response.json();
        console.log(data);
        this.props.handleLogin(data.answer);
    }

    render() {
        return (<div className='login-window'>
            <img className='login-background' src={bg}/>
            <div className='login'>
                <h1>How are you?</h1>
                <h2>Let get you back in...</h2>
                <div className='enter-username'>
                    <input
                        rows={1}
                        placeholder='&nbsp;'
                        onChange={this.handleChange}
                    ></input>
                    <span className='label'>
                        Username
                    </span>
                    <span className='border'>
                    </span>
                </div>
                <div className='enter-password'>
                    <input
                        type='password'
                        rows={1}
                        placeholder='&nbsp;'
                        onChange={this.handleChange}
                    ></input>
                    <span className='label'>
                        Password
                    </span>
                    <span className='border'>
                    </span>
                </div>
                <Button className='login-submit' variant='contained' onClick={this.submit}>Login</Button>
            </div>   
        </div>) 
    }
}