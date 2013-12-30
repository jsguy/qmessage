qmessage
===

Message queue for ExpressJS 3

Installation
===

Install via npm:

	npm install qmessage

In your app, require qmessage

	var qmessage = require('qmessage');

Add qmessage as middleware, this must be before app.router:

	app.use(express.cookieParser('secret'));
	app.use(express.session());
	app.use(qmessage);
	app.use(app.router);

Use
===

qmessage is exposed on both the `request` and `response` objects, so you can use it on either.

Response example (only available in the current response):

	app.get('/', function(req, res){
		res.qmessage('Welcome to the app');
		res.render('index');
	});

Request example (available after redirect on session):

	app.get('/users', function(req, res){
		if(!req.session.isLoggedIn) {
			req.qmessage('Please log in, and you will be redirected back to the users page');
			res.redirect('/login?back=/users');
		}
		...
	});

In the view, you can loop through the messages, for example (jade):

	if(qmessages)
		ul
			each idx, type in qmessages
				each message in qmessages[type]
					li(class=type) #{message}

This will set the class for the message type you specified on the LI - of course you can have multiple messages and so on.

A good way to use qmessage is with a notification framework, (for example to use with [Alertify](http://fabien-d.github.io/alertify.js/), you can do something like:

	if(qmessages)
		each idx, type in qmessages
			each message in qmessages[type]
				script.
					alertify.#{type}("#{message}");