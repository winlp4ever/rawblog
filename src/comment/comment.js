import React, { Component, useState, useContext, useEffect } from 'react';
import './_comment.scss';
import { userContext } from '../user-context/user-context';
import Button from '@material-ui/core/Button';
import _Icon from '../_icon/_icon';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Cookies from 'js-cookie';

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
        let res = {
            username: value.user.username,
            content: newComment, 
            postId: props.postId,
            likes: 0,
            replies: []
        }
        if (props.replyTo != null) {
            res.replyTo = props.replyTo;
            delete res.replies;
        }

        if ($(e.currentTarget).val()) {
            console.log(res);
            props.socket.emit('submit comment', res);
            $(e.currentTarget).val('');  
            setNewComment('');
        }  
        return false;
    } 

    return (
        <div className='enter-comment'>
            <TextareaAutosize
                rows={1}
                placeholder='&nbsp;'
                onChange={handleChange}
                onKeyPress={submit}
            ></TextareaAutosize>
            <span className='label'>
                Your comment
            </span>
            <span className='border'>
            </span>
        </div>
    )
}
const Comment = (props) => {
    const [displayReplies, setDisplayReplies] = useState(false);
    const [user, setUser] = useState({username: props.comment.username, color: 'whitesmoke'});
    const userdata = useContext(userContext);

    useEffect(() => {
        const cpnDidMount = async () => {
            if (userdata.user.username == user.username) setUser(userdata.user);
            else {
                let users = Cookies.get('users');
                if (users != null) {
                    users = JSON.parse(users);
                } else users = {};

                if (user.username in users) setUser(users[user.username]);
                else {
                    try {
                        let response = await fetch('/get-user-data', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                username: user.username,
                            })
                        })
                        let data = await response.json();
                        setUser(data);
                        users[user.username] = data;
                        Cookies.set('users', users, {expires: 1});
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        cpnDidMount();
    }, [])

    const avaStyle = {
        background: user.color,
        color: 'whitesmoke',
    }

    const handleClick = () => {
        if (props.commentId != null) props.likeComment(props.commentId, -1);
        else props.likeComment(props.replyTo, props.replyId);
    }

    const showHideReplies = () => {
        setDisplayReplies(!displayReplies)
    }

    return <div className='comment'>
        <span className='ava' style={avaStyle}>
            {user.username.substr(0,1).toUpperCase()}
        </span>
        <span className='username'>{props.comment.username}:</span>
        <span>{props.comment.content}</span>
        <button className='del'><i className="fas fa-times"></i></button>
        <div className='comment-interact'>
            <Button 
                variant='contained' 
                className='like-comment' 
                onClick={handleClick}>
                <Icon iconName='Like'/> 
                {' '+props.comment.likes}
            </Button>
            {
                props.replyTo == null? <Button
                    variant='contained' 
                    className='nb-replies' 
                    onClick={showHideReplies}
                >
                    <Icon iconName='Comment'/>
                    {' ' + props.comment.replies.length}
                </Button>: null
            }
        </div>
        
        {
            props.replyTo == null & displayReplies? <div className='comment-replies'>
                {props.comment.replies.map(
                    (rep, j) => <Comment 
                        key={j} 
                        replyTo={props.commentId} 
                        comment={rep} 
                        postId={props.postId} 
                        socket={props.socket}
                        replyId={j}
                        likeComment={props.likeComment}/>
                )}
                <NewComment replyTo={props.commentId} postId={props.postId} socket={props.socket}/>
            </div>: null
        }
        
    </div>
}

export default class Comments extends Component {
    _isMounted = false;
    state = {
        comments: [],
    }

    _setState = async (dict) => {
        if (this._isMounted) this.setState(dict);
    }
    
    componentDidMount = async () => {
        this._isMounted = true;
        await this.props.socket.emit('comment history', this.props.postId);
        this.props.socket.on(`comment history postId=${this.props.postId}`, 
            comments => this._setState({comments: comments}));
        this.props.socket.on(`new comment postId=${this.props.postId}`, msg => {
            console.log('new comment');
            console.log(msg);
            let comments = this.state.comments.slice();
            // check if this comment is a reply to another comment or not
            if (msg.replyTo != null) {
                // if yes push it to replies list of the specified comment
                const i = msg.replyTo;
                delete msg.replyTo;
                comments[i].replies.push(msg);
            } else {
                // otherwise push it to our comments list
                comments.push(msg);
            }     
            this._setState({comments: comments});
        });
    }

    componentWillUnmount = async () => {
        this._isMounted = false;
    }

    likeComment = async (i, j) => {
        /** args:
        i - comment index
        j - comment reply index - -1 if the like is for principle comment
         */
        let comments_ = this.state.comments.slice();
        if (j == -1) {
            comments_[i].likes ++;
        } else {
            comments_[i].replies[j].likes ++;
        }
        this._setState({comments: comments_});
        this.props.socket.emit(`like comment`, {
            postId: this.props.postId,
            commentId: i,
            replyId: j
        })
    }

    render = () => {
        return (
            <div className='comments'>
                <NewComment postId={this.props.postId} socket={this.props.socket}/>
                {this.state.comments.map((comm, i) => (
                    <Comment 
                        key={i}
                        commentId={i} 
                        comment={comm} 
                        postId={this.props.postId} 
                        socket={this.props.socket}
                        likeComment={this.likeComment}/>
                ))}
            </div>
        )
    }
}