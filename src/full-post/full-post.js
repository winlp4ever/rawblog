import React, { Component } from 'react';
import MdRender from '../markdown-render/markdown-render';
import Comment from '../comment/comment';
import $ from 'jquery';
import './_full-post.scss';
import { hot } from 'react-hot-loader';
import Img from '../../imgs/cs-bg.svg';
import Button from '@material-ui/core/Button';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import LazyLoad from 'react-lazyload';


function disableDoubleClick() {
    $('.full-post .post-interact i').on('mousedown', e => {
        e.preventDefault();
    });
}

export default class FullPost extends Component {
    state = {
        post: {
            title: '',
            likes: '',
            article: '',
            hashtags: []
        },
        view_comments: true,
        display_supp: false,
    }

    like = this.like.bind(this)
        
    async componentDidMount() {
        // behaviors
        disableDoubleClick();
        let response = await fetch(`/get-full-post?postId=${this.props.postId}`, {method: 'POST'});
        let data = await response.json();
        this.setState({ post: data });

        // generate outline
        let outline = $(`<div class='outline'><h2>Outline</h2></div>`);
        let count = 0;
        this.$article = $(this.article);
        this.$article.children('.markdown-render').children('h2').each(function() {
            outline.append(`<span><a href='#post-sec-${count}'>${$(this).html()}</a></span>`);
            $(this).attr('id', `post-sec-${count}`);
            count ++;
        })
        this.$article.children('.markdown-render').children('h1').after(outline);
        $(window).on('scroll', () => {
            if ($(window).scrollTop() > this.$article.find('.outline').first().offset().top +
                this.$article.find('.outline').first().outerHeight()) this.setState({display_supp: true});
            else this.setState({display_supp: false});
        })
    }
    
    async componentWillUnmount() {
        //this.props.socket.disconnect();
        this.$article.off();
        $(window).off('scroll', '**');
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

        let supp = this.state.display_supp? <div className='supp'>
            <h2>{this.state.post.title}</h2>
            <p>{this.state.post.intro}</p>
                <Button 
                    className='like-post' 
                    variant='outlined'
                    endIcon={<FavoriteBorderIcon/>}
                    onClick={this.like}
                > 
                    {this.state.post.likes}
                </Button>
        </div>: null;
        return (
            <div 
                className='full-post'
            >
                {supp}
                <div className='himmi'>
                    <LazyLoad height={400}>
                        <img src={Img}/>
                    </LazyLoad>                  
                </div>
                <div 
                    className='article'
                    ref={article => this.article = article}>
                    {hashtags}
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
                    <MdRender 
                        source={this.state.post.article} 
                    />
                </div>
                {comments_section}
            </div>
        );
    }
}

if (hot.module) {
    hot.module.accept();
}