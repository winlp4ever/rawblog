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
    
    state = {
        post_content: {} ,
        likes: '',
        view_comments: false
    }
    like = this.like.bind(this);
    viewComments = this.viewComments.bind(this);
    
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

    viewComments() {
        this.setState({view_comments: !this.state.view_comments});
    }


    render() {
        console.log('re-render');

        let comments_section = '';
        if (this.state.view_comments) {
            comments_section = (
                <div className='comment-section'>
                    <Comment 
                        postId={this.props.postId} 
                        socket={this.props.socket} 
                    />
                </div>
            );
        }
        return (
            <div 
                className='post'
            >
                <div className='post-text'>
                    <MdRender source={this.state.post_content.text} />
                </div>
                <LinkPreview url={this.state.post_content.shared_link}/>

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
                        <span
                            onClick={this.viewComments}
                        >
                            <i className="fas fa-comment-dots"></i>
                        </span>
                    </div>

                </div>
                {comments_section}
            </div>
        );
    }
}

if (hot.module) {
    hot.module.accept();
}