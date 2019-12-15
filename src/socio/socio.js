import React, { Component } from 'react';
import Post from '../post/post';
import LinkPreview from '../link-preview/link-preview';
class Socio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            postIds: new Set(), 
        }
        this.delPost = this.delPost.bind(this);
    }

    async componentDidMount() {
        let response = await fetch('/postIds', {method: 'POST'});
        let data = await response.json();
        this.setState({ postIds: new Set(data.postIds) });
        console.log(data);
    }

    async delPost(i) {
        let ids = new Set(this.state.postIds);
        ids.delete(i);
        this.setState({ postIds: ids });
    }

    render() {
        let posts = [];
        for (let id of this.state.postIds) {
            posts.push(<Post 
                key={id} 
                postId={id} del={_ => this.delPost(id)} 
                socket={this.props.socket} 
                viewFullPost={this.props.viewFullPost}
                user={this.props.user}
            />);
        }
        return (
            <div>
                {posts}
            </div>
        )
    }
}

export default Socio;