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

var posts = {};
var articlesPath = './articles';
fs.readdir(articlesPath, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }
  
    files.forEach((file, index) => {
        /**
         * for each file (a post) in a (predefined) dir, load the content to the dict and also
         * load the supp. info from JSON file of same name in logs folder if already existed, otherwise create one
         */
        let p = path.join(articlesPath, file);
        let name = path.parse(file).name;
        if (fs.lstatSync(p).isDirectory()) {
            return;
        }
        let info = {likes: 0, comments: [], hashtags: []};
        try {
            info = JSON.parse(fs.readFileSync(path.join(articlesPath, 'logs', name + '.json')))
            console.log(info);
        } catch (err) {
            console.error(err);
        }
        try {
            const data = fs.readFileSync(path.join(articlesPath, file), 'utf8');
            posts[index] = {
                content: {
                    title: name,
                    text: data,
                    shared_link: '',
                    hashtags: info.hashtags
                },
                likes: info.likes,
                comments: info.comments
            }
        } catch (err) {
            console.log(err);
        }
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
        posts[msg.postId].comments.push({username: msg.username, content: msg.comment});
        console.log('message: ' + msg.comment);
        io.emit(`new comment postId=${msg.postId}`, {username: msg.username, content: msg.comment});
    });
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
    res.json({ title: posts[postId].content.title });
    console.log(posts[postId].content.title );
})

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
            shared_link: req.body.shared_link,
            hashtags: []
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
    for (const id in posts) {
        let name = posts[id].content.title;
        let info = {likes: posts[id].likes, comments: posts[id].comments, hashtags: posts[id].content.hashtags};
        fs.writeFileSync(path.join(articlesPath, 'logs', name + '.json'), JSON.stringify(info, undefined, 4));
        console.log(path.join(articlesPath, 'logs', name + '.json'));
    }
    
    process.exit();
})