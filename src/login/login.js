import React, {Component} from 'react';
import './_login.scss';
import $ from 'jquery';
import bg from '../../imgs/bg.svg';

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
    }

    submit = (e) => {}

    render() {
        return (<div className='login-window'>
            <img className='login-background' src={bg}/>
            <div className='login'>
                <h1>How are you?</h1>
                <h2>Let get you back in..</h2>
                <div className='enter-username'>
                    <textarea
                        rows={1}
                        placeholder='&nbsp;'
                        onChange={this.handleChange}
                        onKeyPress={this.submit}
                    ></textarea>
                    <span className='label'>
                        Username
                    </span>
                    <span className='border'>
                    </span>
                </div>
                <div className='enter-password'>
                    <textarea
                        rows={1}
                        placeholder='&nbsp;'
                        onChange={this.handleChange}
                        onKeyPress={this.submit}
                    ></textarea>
                    <span className='label'>
                        Password
                    </span>
                    <span className='border'>
                    </span>
                </div>
            </div>   
        </div>) 
    }
}