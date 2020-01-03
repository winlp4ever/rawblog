import React, { Component } from 'react';
import Post from '../post/post';
import LinkPreview from '../link-preview/link-preview';
import './_socio.scss';

class Socio extends Component {
    state = {
        postIds: new Set(), 
    }
    delPost = this.delPost.bind(this);
    

    async componentDidMount() {
        let response = await fetch('/postIds', {method: 'POST'});
        let data = await response.json();
        this.setState({ postIds: new Set(data.postIds) });
    }

    async delPost(i) {
        if (this.props.user.name != 'Wall-Q') return;
        let ids = new Set(this.state.postIds);
        ids.delete(i);
        this.setState({ postIds: ids });
    }

    render() {
        let posts = [];
        for (let id of this.state.postIds) {
            posts.push(<div key={id}>
                <div className='head-icons'>
                    <button className='del-post' onClick={_ => this.delPost(id)}>
                        <i className="fas fa-times"></i>
                    </button>
                    <button onClick={_ => this.props.viewFullPost(id)}>
                        <i className="fas fa-external-link-alt" ></i>
                    </button>
                </div>
            
                <Post 
                    postId={id}
                    socket={this.props.socket} 
                />
                </div>);
        }
        return (
            <div className='socio'>
                {posts}
            </div>
        )
    }
}

export default Socio;