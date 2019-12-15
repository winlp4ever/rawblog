import React, { Component } from 'react';
import './_user-auth.scss';

export default class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            pass: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePass = this.handlePass.bind(this);
    }

    async handleSubmit() {
        if (this.state.name == 'AII') {
            let response = await fetch('/admin-verify', {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({pass: this.state.pass})
            });
            let data = await response.json();
            if (data.answer != 'y') return;
            this.setState({name: 'AII'});
        }
        this.props.updateUser({name: this.state.name, email: this.state.email});
    }

    handleChange(e) {
        this.setState({
            name: e.target.value
        })
    }

    handlePass(e) {
        this.setState({
            pass: e.target.value
        })
    }

    render() {
        let input_adminpass = '';
        if (this.state.name == 'AII') input_adminpass = <input onChange={this.handlePass} />
        return (
            <div className='auth'>
                <span>How do you want to be called?</span>
                <input onChange={this.handleChange} placeholder='Enter your username'/>
                {input_adminpass}
                <button onClick={this.handleSubmit}>Let's go!</button>
            </div>
        )
    }
}