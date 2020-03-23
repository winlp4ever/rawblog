// react imports
import React, { Component, useState, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { withRouter } from "react-router";

// external cpns
import MdRender from '../markdown-render/markdown-render';
import Comments, {NewComment} from '../comment/comment';
import loading from '../../imgs/loading.json';
import _Icon from '../_icon/_icon';

// third party 
import $ from 'jquery';
import { hot } from 'react-hot-loader';
import Img from '../../imgs/cs-bg.svg';
import Button from '@material-ui/core/Button';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import LazyLoad from 'react-lazyload';
import io from 'socket.io-client';
import lottie from 'lottie-web';

// style file
import './_full-post.scss';

const Explained = (props) => <span className='explained'>{props.explained}</span>;

class Loading extends Component {
    componentDidMount() {
        this.anim = lottie.loadAnimation({
            container: this.animBox,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: loading
        });
    }
    render() {
        return <div className='loading-icon' ref={animBox => this.animBox = animBox}/>;
    }
}

const QuestionBar = (props) => {
    const [focus, setFocus] = useState(false);

    const handleFocus = _ => setFocus(!focus);

    let cl = 'question-bar';
    if (focus) cl += ' focus'
    return <div className={cl}>
        <Button className='question-mark'><i className="fas fa-question fa-fw"></i></Button>
        <NewComment {...props} onFocus={handleFocus}/>
    </div>
}

function disableDoubleClick() {
    $('.full-post .post-interact i').on('mousedown', e => {
        e.preventDefault();
    });
}

class FullPost extends Component {
    _mounted = false;
    state = {
        post: {
            title: '',
            likes: '',
            article: '',
            hashtags: [],
            nbComments: 0
        },
        outline: [],
        display_supp: false,
        socket: io(),
        viewComments: false
    }

    _setState = (dict) => {
        // only set state when component is mounted
        if (this._mounted) {
            this.setState(dict);
        }
    }
        
    async componentDidMount() {
        // behaviors
        this._mounted = true;
        disableDoubleClick();
        let response = await fetch(`/get-full-post?postId=${this.props.postId}`, {method: 'POST'});
        let data = await response.json();
        this._setState({ post: data });

        // generate outline
        let outline = $(`<div class='outline'><h2>Outline</h2></div>`);
        let count = 0;
        this.$article = $(findDOMNode(this.article));
        let O = []
        this.$article.children('.markdown-render').children('h2').each(function() {
            O.push($(this).html());
            $(this).attr('id', `post-sec-${count}`);
            count ++;
        })
        this.setState({outline: O});
        //await this.$article.children('.markdown-render').children('h1').after(outline);
        $(window).on('scroll', () => {
            if ($(window).scrollTop() > this.$article.find('h1').first().offset().top +
                this.$article.find('h1').first().outerHeight()) this._setState({display_supp: true});
            else this._setState({display_supp: false});
        })
    }
    
    async componentWillUnmount() {
        this.$article.off();
        $(window).off('scroll', '**');
        this._mounted = false;
        this.state.socket.disconnect();
    }

    like = async () => {
        let post_ = JSON.parse(JSON.stringify(this.state.post));
        post_.likes ++;
        this._setState({post: post_});
        this.state.socket.emit(`likes`, this.props.postId);
    }

    toggleViewComments = () => this.setState({viewComments: !this.state.viewComments});


    render() {
        // if the page is not yet mounted, return loading icon
        if (!this._mounted) return <Loading />;

        // hashtags part
        let hashtags = '';
        if (this.state.post.hashtags) {
            hashtags = (<div className='hashtags'>
                {this.state.post.hashtags.map((e, id) => (
                    <span key={id}>#{e}</span>
                ))}
                <Button 
                    className='like-post' 
                    variant='contained'
                    endIcon={<Icon iconName='Heart'/>}
                    onClick={this.like}
                > 
                    {this.state.post.likes}
                </Button>
                <Button 
                    className='nb-questions'
                    endIcon={<Icon iconName='Comment'/>}
                    onClick={this.toggleViewComments}
                >
                    {this.state.post.nbComments > 0? this.state.post.nbComments: ''}
                </Button>
            </div>)
        }

        /**
            Supplementary window, appears only when user has scrolled downpassed 
            post's title and outline. It simply is a small win with title and outline
            that appears next to post        
         */
        let supp = this.state.display_supp? <div className='supp'>
                <h2>{this.state.post.title}</h2>
                <p>{this.state.post.intro}</p>
                <div className='post-interact'>
                    <Button 
                        className='like-post' 
                        variant='outlined'
                        endIcon={<Icon iconName='Heart'/>}
                        onClick={this.like}
                    > 
                        {this.state.post.likes}
                    </Button>
                    <Button 
                        className='nb-questions'
                        endIcon={<Icon iconName='Comment'/>}
                        onClick={this.toggleViewComments}
                    >
                        {this.state.post.nbComments > 0? this.state.post.nbComments: ''}
                    </Button>
                </div>
                
                <div className='outline'>
                    {this.state.outline.map((l, i) => <span key={i} >
                            <a href={`${this.props.match.url}#post-sec-${i}`}>{l}</a>
                        </span>)}
                </div>
            </div>: null;
        return (
            <div 
                className='full-post'
            >
                {supp}
                <div className='himmi'>
                    <LazyLoad height={400}>
                    {
                        this.state.post.himmi? <img 
                            src={require('../../imgs/' + this.state.post.himmi)}
                            alt='himmi'/>
                        : null
                    }
                    </LazyLoad>                  
                </div>
                <div 
                    className='article'
                    ref={article => this.article = article}>
                    {hashtags}
                    <MdRender 
                        source={this.state.post.article} 
                    />
                </div>
                {!this.state.viewComments ? 
                    <QuestionBar postId={this.props.postId} 
                        socket={this.state.socket} 
                        user={this.props.user} />
                : null}
                {this.state.viewComments? 
                    <div className='comment-section'>
                        <div>
                            <Button 
                                className='close' 
                                onClick={this.toggleViewComments}
                            >
                                <Icon iconName='ChromeClose'/>
                            </Button>
                            <h3 className='channel'>#questions</h3>
                            <Comments 
                                postId={this.props.postId} 
                                socket={this.state.socket} 
                                user={this.props.user}
                            />
                        </div>
                    </div>
                : null}
            </div>
        );
    }
}

export default withRouter(FullPost);

if (hot.module) {
    hot.module.accept();
}