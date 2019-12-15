import React, { Component } from 'react';
import { autoResize } from './utils';
import './_comment.scss';

class Comment extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            newComment: '',
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    async componentDidMount() {
        this._isMounted = true;
        await this.props.socket.emit('comment history', this.props.postId);
        this.props.socket.on(`comment history postId=${this.props.postId}`, comments => {
            if (this._isMounted) this.setState({comments: comments});
        });
        this.props.socket.on(`new comment postId=${this.props.postId}`, msg => {
            if (this._isMounted) {
                let comments = this.state.comments.slice();
                comments.push(msg);
                this.setState({comments: comments});
            }     
        });
        //this.submitComment();
        //autoResize();
    }

    async componentWillUnmount() {
        //this.state.socket.disconnect();
        this._isMounted = false;
    }

    handleChange(e) {
        this.setState({newComment: e.target.value})
    }

    async submitComment(e) {
        let keycode = e.keyCode | e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        if ($(e.currentTarget).val()) {
            this.props.socket.emit('submit comment', 
                {
                    username: this.props.user.name || 'anonymous',
                    comment: $(e.currentTarget).val(), 
                    postId: this.props.postId
                }
            );
            $(e.currentTarget).val('');  
            this.setState({newComment: ''});
        }
        
        return false;
    } 

    render() {
        let spans = [];
        for(const [i, comm] of Object.entries(this.state.comments)) {
            //console.log(`wth: ${i} -- ${comm}`);
            spans.push(<div key={i}><span className='username'>{comm.username}:</span><span>{comm.content}</span></div>);
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
                        onKeyPress={this.submitComment}
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