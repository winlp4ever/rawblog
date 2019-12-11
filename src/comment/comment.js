import React, { Component } from 'react';
import { autoResize } from './utils';
import './_comment.scss';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            newComment: '',
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }

    async componentDidMount() {
        await this.props.socket.emit('comment history', this.props.postId);
        var initcount = 0;
        this.props.socket.on(`comment history postId=${this.props.postId}`, comments => {
            initcount ++;
            this.setState({comments: comments});
        });
        this.props.socket.on(`new comment postId=${this.props.postId}`, msg => {
            let comments = this.state.comments.slice();
            comments.push(msg);
            this.setState({comments: comments});
            
        });
        this.submitComment();
        //autoResize();
    }

    async componentWillUnmount() {
        //this.state.socket.disconnect();
    }

    handleChange(e) {
        this.setState({newComment: e.target.value})
    }

    async submitComment() {
        $('.comment').on('keydown', 'textarea', e => {
            let keycode = e.keyCode | e.which;
            if (keycode != 13) return;
            
            e.preventDefault(); // prevents page reloading
            console.log('current target', $(e.currentTarget).val());
            this.props.socket.emit('submit comment', 
                {
                    comment: $(e.currentTarget).val(), 
                    postId: this.props.postId
                }
            );
            $(e.currentTarget).val('');  
            this.setState({newComment: ''});
            return false;

        })
        
    } 

    render() {
        let spans = [];
        for(const [i, comm] of Object.entries(this.state.comments)) {
            //console.log(`wth: ${i} -- ${comm}`);
            spans.push(<div key={i}><span>{comm}</span></div>);
        }
        return (
            <div 
                className='comment'
            >
                <div className='enter-comment'>
                    <textarea
                        rows={1}
                        placeholder='&nbsp;'
                        onChange={this.handleChange}
                    ></textarea>
                    <span className='label'>
                        Your comment
                    </span>
                    <span className='border'>
                    </span>
                </div>
                
                {spans}
            </div>
        )
    }
}

export default Comment;