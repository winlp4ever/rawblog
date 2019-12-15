import React, { Component } from 'react';
import './_user-auth.scss';

export default class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        this.props.updateUser({name: this.state.name, email: this.state.email});
    }

    handleChange(e) {
        this.setState({
            name: e.target.value
        })
    }

    render() {
        return (
            <div className='auth'>
                <span>How do you want to be called?</span>
                <input onChange={this.handleChange} placeholder='Enter your username'/>
                <button onClick={this.handleSubmit}>Let's go!</button>
            </div>
        )
    }
}