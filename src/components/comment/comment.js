import React, { Component } from 'react';
import { autoResize } from './utils';
import './_comment.scss';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            newComment: '',
            socket: io()
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    async componentDidMount() {
        await this.state.socket.emit('comment history', 0);
        this.state.socket.on('comment history', comments => {
            this.setState({comments: comments})
        });
        this.state.socket.on('new comment', msg => {
            let comments = this.state.comments.slice();
            comments.push(msg)
            this.setState({comments: comments})
        });
        this.submitComment();
        //autoResize();
    }

    handleChange(e) {
        this.setState({newComment: e.target.value})
    }

    async submitComment() {
        $('.comment').on('keydown', 'textarea', e => {
            let keycode = e.keyCode | e.which;
            if (keycode != 13) return;
            
            e.preventDefault(); // prevents page reloading
            this.state.socket.emit('submit comment', $('.enter-comment textarea').val());
            $('.enter-comment textarea').val('');                    
            return false;

        })
        
    } 

    render() {
        let spans = [];
        for(const [i, comm] of Object.entries(this.state.comments)) {
            spans.push(<div key={i}><span>{comm}</span></div>);
        }
        return (
            <div 
                className='comment'
            >
                <div className='enter-comment'>
                    <textarea
                        rows={1}
                        placeholder='&nbsp;'
                        onChange={this.handleChange}
                    ></textarea>
                    <span className='label'>
                        Your comment
                    </span>
                    <span className='border'>
                    </span>
                </div>
                
                {spans}
            </div>
        )
    }
}

export default Comment;