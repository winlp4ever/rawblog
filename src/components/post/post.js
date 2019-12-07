import React, { Component } from 'react';
//import MdRender from '../md-render/md-render';
import Comment from '../comment/comment';
import $ from 'jquery';
import './_post.scss';


function disableDoubleClick() {
    $('.post .post-interact i').on('mousedown', e => {
        e.preventDefault();
    });
}

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            post_content: {} 
        }
    }
    async componentDidMount() {
        // behaviors
        disableDoubleClick();
        let response = await fetch(`/get-post?postId=${this.props.postId}`, {method: 'POST'});
        let data = await response.json();
        this.setState({ post_content: data});
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
                    {this.state.post_content.text}
                </div>
                <div
                    className='post-interact'
                >
                    <div>
                        <span 
                            
                        >
                            <i className="fab fa-gratipay"></i>
                        </span>
                        <span>likes</span>
                    </div>
                    <div>
                        <span>
                            <i className="fas fa-comment-dots"></i>
                        </span>
                    </div>

                </div>
                <Comment postId={this.props.postId} />
            </div>
        );
    }
}