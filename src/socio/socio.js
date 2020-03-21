import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Post from '../post/post';
import './_socio.scss';
import FullPost from '../full-post/full-post';

const Socio = props => {
    const [postIds, setPostIds] = useState(new Set())
    useEffect(() => {
        async function init() {
            let response = await fetch('/postIds', {method: 'POST'});
            let data = await response.json();
            setPostIds(new Set(data.postIds));
        }
        init();
    }, [])

    const delPost = async (i) => {
        if (props.user.username != 'Wall-Q') return;
        let ids = new Set(postIds);
        ids.delete(i);
        setPostIds(ids);
    }

    let posts = [];
    let match = useRouteMatch();

    for (let id of postIds) {
        posts.push(<div key={id}>
            <div className='head-icons'>
                <button className='del-post' onClick={_ => delPost(id)}>
                    <i className="fas fa-times"></i>
                </button>
                <Link to={`${match.url}/${id}`}>
                    <button>
                        <i className="fas fa-external-link-alt" ></i>
                    </button>
                </Link>
            </div>
        
            <Post 
                postId={id}
                socket={props.socket} 
            />
            </div>);
    }
    return (
        <Switch>
            <Route path={`${match.path}/:postId`}>
                <FPost />
            </Route>
            <Route exact path={match.path}>
                <div className='socio'>
                    <div className='course-info-panel'>
                        <h1>AWS - A cloud platform</h1>
                        <p>this is a long introductionllllllllllllllllllllllwefewfl ffffffffwfwfef 
                        wefwel fwefl fwlggggggggggqlwef lfffffffffffffffffffffffffffffffffffffffflfl
                        fwew we</p>
                    </div>
                    {posts}
                </div>
            </Route>
        </Switch>
    )
}

const FPost = (props) => {
    'wrapper of FullPost that use useParams to resolve routing'
    let { postId } = useParams();
    return <FullPost postId={postId} />
}

export default Socio;