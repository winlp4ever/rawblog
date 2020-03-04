import React, {Component, useState, useContext} from 'react';

const Ask = (props) => {
    const [q, setQ] = useState('');
    
}

const Question = (props) => {
    return <div className='question'>
        <div className='title'>
            <span className='username'>{props.question.username}</span>
            <span>{props.question.content}</span>
        </div>
        <div className='replies'>
            {props.question.replies.map((rep, id) => {
                <div className='reply' key={id}>
                    <span className='rep-username'>{rep.username}</span>
                    <span className='rep-content'>{rep.content}</span>
                </div>
            })}
        </div>
    </div>
}

export default class JustAsk extends Component {
    state = {
        questions: []
    }
    async componentDidMount() {
        let response = await fetch(`/get-questions-postId=${this.props.postId || 0}`);
        let data = await response.json();
        this.setState(data);
    }
    render() {
        return <div className='ask'>

        </div>
    }
}