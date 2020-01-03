//const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const http = require('http');

var app = express();
app.use(favicon(path.join(__dirname, 'imgs', 'favicon.ico')));
app.use(express.static(__dirname + './public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const config = require('./webpack.config.js');

const options = {
    //contentBase: './public',
    //hot: true,
    //host: 'localhost',
    //proxy: { '*': 'http://localhost:5000' }
};

// webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
//const server = new webpackDevServer(compiler, options);
//compiler.outputFileSystem = fs;

const server = new http.Server(app);
const io = require('socket.io')(server);

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
});

var posts = {
    0: {
        id: 0,
        content: {
            title: 'an example',
            text: '<h1>example</h1>\n<p>this is an example</p>',
            shared_link: ''
        },
        likes: 0,
        comments: [
            {username: 'AII', content: 'Hey yo'},
            {username: 'AII', content: 'this is an example'}
        ]
    },
    1: {
        id: 1,
        content: {
            title: 'oofsi',
            text: '<h1>second ex</h1> \n<p>where anything goes wrong</p>',
            shared_link: ''
        },
        likes: 1,
        comments: [
            {username: 'AII', content: 'Ooof'}
        ]
    }
}
var count = 0;


app.use(
    middleware(compiler, options)
);

app.use(require('webpack-hot-middleware')(compiler));


io.on('connection', function(socket){
    count ++;
    console.log(`${count} user connected with id: ${socket.id}`);
    socket.on('disconnect', function(){
        count --;
        console.log(`1 user disconnected, rest ${count}`);
    });
    socket.on('comment history', postId => {
        console.log('request history ...');
        console.log(posts[postId].comments);
        socket.emit(`comment history postId=${postId}`, posts[postId].comments);
    })
    socket.on('submit comment', msg => {
        posts[msg.postId].comments.push({username: msg.username, content: msg.comment});
        console.log('message: ' + msg.comment);
        io.emit(`new comment postId=${msg.postId}`, {username: msg.username, content: msg.comment});
    });
    socket.on('likes', id => {
        posts[id].likes ++;
        console.log(posts[id]);
    })
});


app.get('/', (req, res, next) => {
    var filename = path.join(compiler.outputPath,'index');
    
    compiler.outputFileSystem.readFile(filename, async (err, data) => {
        if (err) {
            return next(err);
        }
        res.set('content-type','text/html');
        res.send(data);
        res.end();
    });
});

app.post('/get-post', (req, res) => {
    let postId = req.query.postId;
    res.json({ content: posts[postId].content, likes: posts[postId].likes });
})

app.post('/postIds', (req, res) => {
    let keys = new Set(Object.keys(posts));
    console.log(keys);
    res.json({postIds: Object.keys(posts)});
})

app.post('/save-post', (req, res) => {
    if (req.body.password != '2311') return;
    let idx = Math.max(...Object.keys(posts))+1;
    console.log(idx);
    posts[idx] = {
        id: idx,
        content: {
            title: req.body.title, 
            text: req.body.content, 
            shared_link: req.body.shared_link
        },
        likes: 0,
        comments: []
    };
    console.log(posts);
    res.json({
        answer: 'y',
    });
})

app.post('/admin-verify', (req, res) => {
    if (req.body.pass != '2311') res.json({answer: 'n'});
    res.json({
        answer: 'y'
    })
})

process.on('SIGINT', _ => {
    console.log('now you quit!');
    process.exit();
})