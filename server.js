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


const prodConfig = require('./webpack.prod.js');
const devConfig = require('./webpack.dev.js');
const options = {};

if (process.argv.length < 3) console.error('Please precise mode!');
if (process.argv[2] != 'prod' & process.argv[2] != 'dev') {
    console.error('Wrong mode - only dev or prod is accepted!');
    return;
};
var compiler = null;
if (process.argv[2] == 'prod') compiler = webpack(prodConfig);
else compiler = webpack(devConfig);

const server = new http.Server(app);
const io = require('socket.io')(server);

const PORT = 80;

server.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
});

var posts = {};
var postsPath = './posts';
fs.readdir(postsPath, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
  
    files.forEach((file, index) => {
        /**
         * for each file (a post) in a (predefined) dir, load the content to the dict and also
         * load the supp. info from JSON file of same name in logs folder if already existed, otherwise create one
         */
        let p = path.join(postsPath, file);
        let name = path.parse(file).name;
        if (fs.lstatSync(p).isDirectory()) {
            return;
        }
        let info = {title: '', likes: 0, intro: '', comments: [], hashtags: []};
        try {
            info = JSON.parse(fs.readFileSync(path.join(postsPath, 'postinfo', name + '.json')))
            console.log(info);
        } catch (err) {
            console.error(err);
        }
        try {
            const data = fs.readFileSync(path.join(postsPath, file), 'utf8');
            posts[index] = info;
            posts[index].article = data;
        } catch (err) {
            console.log(err);
            posts[index].title = name;
        }
        posts[index].fn = name;
    })
});

var count = 0;

var admin = 'Wall-Q';
var chats = {};

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
        posts[msg.postId].comments.push({username: msg.username, content: msg.content, likes: msg.likes});
        console.log('message: ' + msg.content);
        io.emit(`new comment postId=${msg.postId}`, {username: msg.username, content: msg.content, likes: msg.likes});
    });

    socket.on('like comment', msg => {
        posts[msg.postId].comments[msg.commentId].likes ++;
    })
    socket.on('likes', id => {
        posts[id].likes ++;
        console.log(posts[id]);
    })

    //chat bot
    socket.on('new chat', msg => {
        io.emit('new chat', msg);
        console.log(msg);
    })

    socket.on('submit chat', msg => {
        console.log(msg);
        io.emit('new chat', msg);
    })

    socket.on('is typing', msg => {
        io.emit('is typing', msg);
    })

    socket.on('ask for hints', msg => {
        io.emit('ask for hints', msg);
        console.log(msg);
    })

    socket.on('hints', msg => {
        io.emit('hints', msg);
        console.log(msg);
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

app.post('/login', (req, res) => {
    if (req.body.username != 'redgunner' || req.body.password != 2311) res.json({answer: 'n'});
    res.json({answer: 'y'});
})

app.post('/get-post-title', (req, res) => {
    let postId = req.query.postId;
    res.json({ title: posts[postId].title });
    console.log(posts[postId].title );
})

app.post('/get-post', (req, res) => {
    let postId = req.query.postId;
    let post_ = JSON.parse(JSON.stringify(posts[postId]));
    post_.nbComments = post_.comments.length;
    delete post_.article;
    delete post_.comments;
    res.json(post_);
})

app.post('/get-full-post', (req, res) => {
    let postId = req.query.postId;
    let post_ = JSON.parse(JSON.stringify(posts[postId]));
    //delete post_.intro;
    delete post_.comments;
    res.json(post_);
})

app.post('/postIds', (req, res) => {
    let keys = new Set(Object.keys(posts));
    console.log(keys);
    res.json({postIds: Object.keys(posts)});
})

app.post('/admin-verify', (req, res) => {
    if (req.body.pass != '2311') res.json({answer: 'n'});
    res.json({
        answer: 'y'
    })
})

process.on('SIGINT', _ => {
    console.log('now you quit!');

    for (const id in posts) {
        let name = posts[id].fn;
        delete posts[id].fn;
        delete posts[id].article;
        fs.writeFileSync(path.join(postsPath, 'postinfo', name + '.json'), JSON.stringify(posts[id], undefined, 4));
        console.log(path.join(postsPath, 'postinfo', name + '.json'));
    }
    process.exit();
})