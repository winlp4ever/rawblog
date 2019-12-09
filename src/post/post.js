import React, { Component } from 'react';
import MdRender from '../markdown-render/markdown-render';
import Comment from '../comment/comment';
import LinkPreview from '../link-preview/link-preview';
import $ from 'jquery';
import './_post.scss';
import io from 'socket.io-client';
import { hot } from 'react-hot-loader';

function disableDoubleClick() {
    $('.post .post-interact i').on('mousedown', e => {
        e.preventDefault();
    });
}

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_content: {} ,
            likes: '',
        }
        this.like = this.like.bind(this);
    }
    async componentDidMount() {
        // behaviors
        disableDoubleClick();
        let response = await fetch(`/get-post?postId=${this.props.postId}`, {method: 'POST'});
        let data = await response.json();
        this.setState({ post_content: data.content, likes: data.likes });
    }

    
    async componentWillUnmount() {
        //this.props.socket.disconnect();
    }

    like() {
        this.setState({ likes: this.state.likes + 1 });
        this.props.socket.emit(`likes`, this.props.postId);
    }


    render() {
        return (
            <div 
                className='post'
            >
                <button className='del-post' onClick={_ => this.props.onClick()}>
                    <i className="fas fa-times"></i>
                </button>
                <button>
                    <i className="fas fa-external-link-alt"></i>
                </button>
                
                <div>
                    <MdRender source={this.state.post_content.text}></MdRender>
                    <LinkPreview url='https://www.reddit.com/r/javascript/comments/4bxsi6/webpack_hmr_express_socketio_one_does_not_simply/'/>
                </div>

                <div
                    className='post-interact'
                >
                    <div>
                        <span 
                            onClick={this.like}
                        >
                            <i className="fab fa-gratipay"></i>
                        </span>
                        <span>{this.state.likes}</span>
                    </div>
                    <div>
                        <span>
                            <i className="fas fa-comment-dots"></i>
                        </span>
                    </div>

                </div>
                <div className='comment-section'>
                    <Comment postId={this.props.postId} socket={this.props.socket}/>
                </div>
            </div>
        );
    }
}

if (hot.module) {
    hot.module.accept();
}