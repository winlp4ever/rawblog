import React, { Component } from 'react';
import './_editor.scss';
import hljs from 'highlight.js';
import { autoResize, keysBehaviours } from './utils';
import MdRender from '../markdown-render/markdown-render';

class Editor extends Component {
    state = {
        newPost: {
            content: '',
            shared_link: ''
        }
    };        
        
    componentDidMount = async () => {
        autoResize();
        keysBehaviours();
    }

    handleChange = (e) => {
        this.setState({newPost: {
            content: e.target.value,
            shared_link: this.state.newPost.shared_link
        }});
    }

    handleLink = (e) => {
        this.setState({newPost: {
            content: this.state.newPost.content,
            shared_link: e.target.value
        }})
    }

    savePost = async () => {
        /**
         * save new post, send it to the server to update posts, then wait
         * for server response and generate new posts
         */
        try {    
            let content = this.state.newPost.content;
            if (!content) return;
            let h1array = content.match(/#\s.*\n/g);
            let title = '...';
            if (!h1array) title = content.substr(0, 10) + '...';
            else {
                let title = h1array[0];
                title = title.substr(2, title.length-2);
            }
            

            let pass = prompt('Enter password:'); 
            const response = await fetch('/save-post', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: title,
                    content: content,
                    shared_link: this.state.newPost.shared_link,
                    password: pass 
                })
            });
            let data = await response.json();
            let ans = data.answer;
            if (ans == 'y') {
                this.setState({
                    newPost: {
                        content: '',
                    }
                });
                $('.editor textarea').val('');
                $('.shared-link input').val('');
            }
            
        } catch(err) {
            console.error(`Error: ${err}`);
        }
    }

    render = () => {
        /**
         * This function render the Editor inside Posts section
         */
        return (
        <div className="editor">   
            <div className='md-window'>
                <h4>Write Post</h4>    
                <textarea
                    className='md-input'
                    rows={1}
                    id="enter-content"
                    placeholder="Write down your thoughts"
                    onChange={this.handleChange}
                    defaultValue={window.newPost}
                />
                <button 
                    id='save-post'
                    onClick={this.savePost}
                >
                    Post
                </button>
            </div>

            <div className='shared-link'>
                <div>
                    <span>Shared link: </span>
                    <input onChange={this.handleLink}></input>
                </div>
            </div>

            <div >
                <div className="markdown-render">
                    <MdRender source={this.state.newPost.content} />
                </div>
            </div>
            
        </div>);
    }
}

export default Editor;