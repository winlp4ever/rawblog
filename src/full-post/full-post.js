import React, { Component } from 'react';
import MdRender from '../markdown-render/markdown-render';
import Comment from '../comment/comment';
import LinkPreview from '../link-preview/link-preview';
import $ from 'jquery';
import './_full-post.scss';
import io from 'socket.io-client';
import { hot } from 'react-hot-loader';
import Img from '../../imgs/cs-bg.svg';
import Button from '@material-ui/core/Button';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

function disableDoubleClick() {
    $('.full-post .post-interact i').on('mousedown', e => {
        e.preventDefault();
    });
}

function genOutline() {
    let outline = $(`<div class='outline'><h2>Outline</h2></div>`);
    let count = 0;
    $('.full-post .markdown-render').children('h2').each(function() {
        outline.append(`<span><a href='#post-sec-${count}'>${$(this).html()}</a></span>`);
        $(this).attr('id', `post-sec-${count}`);
        count ++;
    })
    $('.full-post h1').after(outline);
}

export default class FullPost extends Component {
    state = {
        post: {
            title: '',
            likes: '',
            article: '',
            hashtags: []
        },
        view_comments: true
    }

    like = this.like.bind(this)
        
    async componentDidMount() {
        // behaviors
        disableDoubleClick();
        let response = await fetch(`/get-full-post?postId=${this.props.postId}`, {method: 'POST'});
        let data = await response.json();
        this.setState({ post: data });
        genOutline();
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
        let comments_section = '';
        if (this.state.view_comments) {
            comments_section = (
                <div className='comment-section'>
                    <h3 className='channel'>#general</h3>
                    <Comment 
                        postId={this.props.postId} 
                        socket={this.props.socket} 
                        user={this.props.user} 
                    />
                </div>
            );
        }
        let hashtags = '';
        if (this.state.post.hashtags) {
            hashtags = (<div className='hashtags'>
                {this.state.post.hashtags.map((e, id) => (
                    <span key={id}>#{e}</span>
                ))}
            </div>)
        }
        return (
            <div 
                className='full-post'
            >
                <div className='himmi'><img src={Img}/></div>
                <div className='article'>
                    {hashtags}
                    <MdRender source={this.state.post.article} />
                </div>

                <div
                    className='post-interact'
                >
                    <div>
                        <Button 
                            className='like-post' 
                            variant='contained'
                            endIcon={<FavoriteBorderIcon/>}
                            onClick={this.like}
                        > 
                            {this.state.post.likes}
                        </Button>
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