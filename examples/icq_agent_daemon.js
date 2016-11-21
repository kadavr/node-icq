"use strict";

var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');


var log4js = require('log4js');
log4js.configure('log4js.json');
var logger = log4js.getLogger('out');

var ICQ = require('../lib/node-icq');


var im = new ICQ({
    "uin"     : "dd",
    "password": "dd",
    "token"   : "ic17mFHiwr52TKrx"//aka devid, "web icq"
});

// im.on('session:start', function () {
// 	im.setState('online');
// });

im.on('im:message', function(message) {
	// /dev/null
});

im.on('session:remote_problem', function(code, params){
	logger.error("session:remote_problem: code - " + code + ", params - " + JSON.stringify(params));
});

app.use(bodyParser.json());
app.post('/icq', function(req, res){
	
	req.body.recipient.forEach(function(uin_or_email){
		im.send(uin_or_email, req.body.message );
	});

  	res.json(req.body);
});

process.on("SIGINT", function () {
	im.on('session:end', function (endCode) {
		process.exit();
	});
	im.disconnect();
});

http.listen(3000, function(){
  console.log('listening on *:3000');
  im.connect();
  im.setState('online');
});