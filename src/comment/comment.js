import React, { Component, useState, useContext } from 'react';
import { autoResize } from './utils';
import './_comment.scss';
import { userContext } from '../user-context/user-context';

const NewComment = (props) => {
    const [newComment, setNewComment] = useState('');

    const handleChange = (e) => {
        setNewComment(e.target.value);
    }

    const value = useContext(userContext);

    const submit = async (e) => {
        let keycode = e.keyCode || e.which;
        if (keycode != 13) return;
        
        e.preventDefault(); // prevents page reloading
        if ($(e.currentTarget).val()) {
            props.socket.emit('submit comment', 
                {
                    username: value.user.name || 'anonymous',
                    comment: newComment, 
                    postId: props.postId
                }
            );
            $(e.currentTarget).val('');  
            setNewComment('');
        }  
        return false;
    } 

    return (
        <div className='enter-comment'>
            <textarea
                rows={1}
                placeholder='&nbsp;'
                onChange={handleChange}
                onKeyPress={submit}
            ></textarea>
            <span className='label'>
                Your comment
            </span>
            <span className='border'>
            </span>
        </div>
    )
}

class Comment extends Component {
    _isMounted = false;
    state = {
        comments: [],
    }
    
    componentDidMount = async () => {
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
    }

    componentWillUnmount = async () => {
        this._isMounted = false;
    }

    render = () => {
        let spans = [];
        for(const [i, comm] of Object.entries(this.state.comments)) {
            spans.push(
                <div key={i}>
                    <span className='username'>{comm.username}:</span>
                    <span>{comm.content}</span>
                    <button className='del'><i className="fas fa-times"></i></button>
                </div>
            );
        }
        return (
            <div className='comment'>
                <NewComment postId={this.props.postId} socket={this.props.socket}/>
                {this.state.comments.map((comm, i) => (
                    <div key={i}>
                        <span className='username'>{comm.username}:</span>
                        <span>{comm.content}</span>
                        <button className='del'><i className="fas fa-times"></i></button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Comment;