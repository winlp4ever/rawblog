import React, {Component} from 'react';

const Question = (props) => {
    return <div className='question'>
        <div className='title'>
            <span className='username'>{props.question.username}</span>
            <span>{props.question.content}</span>
        </div>
        <div className='replies'>
            {props.}
        </div>
    </div>
}

export default class Ask extends Component {
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