module.exports = function(req, res, next) {
	var messages,
		defaultType = 'success';

	// Make sure we have session support
	if(req.session == undefined ) {
		throw Error('qmessage needs sessions.');
	}

	//	request qmessage method
	req.qmessage = function(type, message) {
		req.session.qmessage = req.session.qmessage || {};

		//	Default if no type
		if(!message) {
			message = type;
			type = defaultType;
		}

		req.session.qmessage[type] = req.session.qmessage[type] || [];
		req.session.qmessage[type].push(message);
	};

	//	response qmessage method
	res.qmessage = function(type, message) {

		//	Default if no type
		if(!message) {
			message = type;
			type = defaultType;
		}
		res.locals.qmessages = res.locals.qmessages || {};
		res.locals.qmessages[type] = res.locals.qmessages[type] || [];
		res.locals.qmessages[type].push(message);
	};

	//	Override redirect
	res.oldRedirect = res.redirect;
	res.redirect = function() {
		for (var type in res.locals.qmessages) {
			//	Set in sequest session
			res.locals.qmessages[type].forEach(function(message) {
				req.qmessage(type, message);
			});
		}
		//	Run the redirect
		res.oldRedirect.apply(this, arguments);
	};

	//	Grab and queued messages
	if (req.session.qmessage) {
		messages = {};
		for (var type in req.session.qmessage) {
			req.session.qmessage[type].forEach(function(message) {
				messages[type] = messages[type] || [];
				messages[type].push(message);
			});
		}

		//	Remove qmessage
		delete req.session.qmessage;
	}

	res.locals.qmessages = messages;

	return next();
};