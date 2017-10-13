var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server, { origins: ['eeconf.local', 'localhost:4200'] });

app.use(bodyParser.json()); // gets body of HTTP request, attaches to req.body

// Respond to POST requests with url of /comment/<commentId>
app.post('/comment/:commentId', function(req, res) {
	console.log('request from EE', req.body);
	var eeComment = req.body;

	var entryUrl = eeComment.entry_url.replace('?', '/'); // a hack to get the url to be correct

	var commentUrl = entryUrl + '#comment-' + req.params.commentId;
	
	// notify socket client of new comment
	var message = {
			author: eeComment.name,
			comment: eeComment.comment, 
			date: new Date(eeComment.comment_date * 1000),
			location: eeComment.location,
			url: commentUrl 
		};
	io.sockets.emit('comment_' + eeComment.entry_id, message); // comments for a given entry
	io.sockets.emit('comment', message); // all comemnts
	res.sendStatus(200);
});

server.listen(8186);