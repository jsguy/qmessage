var express = require('express'),
	http = require('http'),
	qmessage = require('../lib');

var app = express();

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	
	//	qmessage needs sessions
	//	Also, this must be before app.router setup
	app.use(express.cookieParser('shibboleet'));
	app.use(express.session());
	app.use(qmessage);
	
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', function(req,res){
	res.qmessage('success','Welcome to the app! This is a success message');
	res.qmessage('log','This is a log message');
	res.qmessage('error','This is an error message');
	res.render('index', {title: 'qmessage demo'});
});

app.get('/users', function(req, res){
	if(!req.session.isLoggedIn) {
		req.qmessage('Please log in, and you will be redirected back to the users page');
		res.redirect('/login?back=/users');
	} else {
		res.render('users', {title: 'users qmessage demo'});
	}
});

http.createServer(app).listen(3000, function(){
	console.log("Express server listening on port 3000");
});