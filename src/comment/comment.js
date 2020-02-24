import React, { Component, useState, useContext } from 'react';
import './_comment.scss';
import { userContext } from '../user-context/user-context';
import Button from '@material-ui/core/Button';
import _Icon from '../_icon/_icon';
import like from '../../imgs/facebook-like.json';

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
                    content: newComment, 
                    postId: props.postId,
                    likes: 0
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

    likeComment = async (i) => {
        let comments_ = this.state.comments.slice();
        comments_[i].likes ++;
        this.setState({comments: comments_});
        this.props.socket.emit(`like comment`, {
            postId: this.props.postId,
            commentId: i
        })
    }

    render = () => {
        return (
            <div className='comment'>
                <NewComment postId={this.props.postId} socket={this.props.socket}/>
                {this.state.comments.map((comm, i) => (
                    <div key={i}>
                        <span className='username'>{comm.username}:</span>
                        <span>{comm.content}</span>
                        <button className='del'><i className="fas fa-times"></i></button>
                        <Button 
                            variant='contained' 
                            className='like-comment' 
                            onClick={_=>this.likeComment(i)}><_Icon icon={like} className='like'/> {comm.likes}</Button>
                    </div>
                ))}
            </div>
        )
    }
}

export default Comment;