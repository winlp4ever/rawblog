import React, { Component } from 'react';
import MdRender from '../markdown-render/markdown-render';
import $ from 'jquery';
import './_post.scss';
import { hot } from 'react-hot-loader';

function disableDoubleClick() {
    $('.post .post-interact i').on('mousedown', e => {
        e.preventDefault();
    });
}

export default class Post extends Component {
    state = {
        post: {
            title: '',
            likes: '',
            intro: ''
        }
    }
    
    async componentDidMount() {
        // behaviors
        disableDoubleClick();
        let response = await fetch(`/get-post?postId=${this.props.postId}`, {method: 'POST'});
        let data = await response.json();
        this.setState({post: data});
    }

    async componentWillUnmount() {
        //this.props.socket.disconnect();
    }

    like() {
        let post_ = JSON.parse(JSON.stringify(this.state.post));
        post_.likes ++;
        this.setState({post: post_});
        this.props.socket.emit(`likes`, this.props.postId);
    }

    render() {
        return (
            <div 
                className='post'
            >
                <div className='post-text'>
                    <h2>{this.state.post.title}</h2>
                    <MdRender source={this.state.post.intro} />
                    <button className='read-more' onClick={_ => this.props.viewFullPost(this.props.postId)}>
                        See full ...
                    </button>
                </div>
                <div
                    className='post-interact'
                >
                    <div>
                        <span><i className="fab fa-gratipay"></i></span>
                        <span>{this.state.post.likes}</span>
                    </div>
                    <div>
                        <span><i className="fas fa-comment-dots"></i></span>
                        <span>{this.state.post.nbComments}</span>
                    </div>
                    
                </div>
            </div>
        );
    }
}

if (hot.module) {
    hot.module.accept();
}