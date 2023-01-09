// Express

const express = require('express');
const app = express();

const CONFIG_MODULE: any = require('config');

/*
 *	Mongoose
 *
 *	Object Adapter for MongoDB
 *	MongoDB encapsulation. (abstraction layer)
 *
*/

let connect_url: string = "";

if (CONFIG_MODULE.mongodb) {
	const db = CONFIG_MODULE.mongodb;

	connect_url = 'mongodb://' + db.host + '/' + db.authdb;

	if (CONFIG_MODULE.mongodb.user) {
		connect_url = 'mongodb://' + db.user + ':' + db.password + '@' + db.host + '/' + db.authdb;
	}

}

console.log(connect_url);

const MONGOOSE_MODULE = require('mongoose');

// Only once when connecting to DB
MONGOOSE_MODULE.connection.once('open', () => {

	const path = require('path');
	const createError = require('http-errors');
	const cookieParser = require('cookie-parser');

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));

	app.set('views', './views');
	app.set('view engine', 'jade');

	app.use(express.json());
	app.use(express.urlencoded({extended: false}));
	app.use(cookieParser());
//	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.static('./public'));

	const bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({extended: true}));

	/*	Session
	*
	* Persist Express cookie session in database
	*/
	/* --------------------begin-------------------- */

	const SESSION_MODULE = require('express-session');						// Express Session
	const MONGOSTORE_CLASS = require('connect-mongo');						// Associating an encrypted cookie with a session stored in the database

	app.use(SESSION_MODULE({												// Connection between session and MongoDB
		name: 'login',	                                           			// session name
		secret: 'To be, or not to be.',										// session encryption key
		resave: false,														//
		rolling: true,		                                       			//
		saveUninitialized: true,											//
		cookie: {maxAge: 365 * 24 * 60 * 60 * 1000},						// Cookie side setting
		store: MONGOSTORE_CLASS.create({									// MongoDB side connection object
			mongoUrl: connect_url,
//			mongooseConnection: MONGOOSE_MODULE.connection,					// Mongoose connection
			ttl: 365 * 24 * 60 * 60,
//			clear_interval: 60 * 60,
		}),
	}));

	/* --------------------end-------------------- */

	/*	Passport
	*
	*   authentication module
	*	Create account records, password authentication/hashing, etc.
	*	login() and logout() methods are added to the request object.
	*	https://knimon-software.github.io/www.passportjs.org/guide/login/
	*	https://knimon-software.github.io/www.passportjs.org/guide/logout/
	*
	*	Cooperation approval
	*	https://knimon-software.github.io/www.passportjs.org/guide/authorize/
	*/

	/* --------------------begin-------------------- */

	const PASSPORT_MODULE = require('passport');									// Passport authentication module
	const LOCAL_STRATEGY_PLUGIN = require('passport-local').Strategy;				// Passport plugin for password authentication
	const LocalAccount = require('./models/account');								// Mongoose account definition

	PASSPORT_MODULE.serializeUser((user: any, done: any) => {
		done(null, user);
	});
	PASSPORT_MODULE.deserializeUser((user: any, done: any) => {
		done(null, user);
	});

	PASSPORT_MODULE.use(new LOCAL_STRATEGY_PLUGIN(LocalAccount.authenticate()));	// Mongoose account definition - password authentication

	app.use(PASSPORT_MODULE.initialize());											// Required before using Passport
	app.use(PASSPORT_MODULE.session());												// Required before using Passport

	/* --------------------end-------------------- */


	/*	Application	*/
	/* --------------------begin-------------------- */

	// Already logged in?
	app.get('/user', (req: any, res: any) => {
		if (req.user) {
			res.json({status: 0, value: req.user});
		} else {
			res.json({status: -1, value: null});
		}
	});

	// login
	app.post('/login', (req: any, res: any) => {
		if (!req.user) {
			PASSPORT_MODULE.authenticate('local', (error: any, account: any) => {
				if (!error) {
					if (account) {
						req.login(account, (error: any) => {
							if (!error) {
								res.json({status: 0, value: req.user, message: 'OK'});
							} else {
								res.json({status: -1, value: {}, message: error.message});
							}
						});
					} else {
						res.json({status: -2, message: 'user found or password missmatch.'});
					}
				} else {
					res.json({status: -1, message: error.message});
				}
			})(req, res);
		} else {
			res.json({status: -2, message: 'already..'});
		}
	});

	// logout
	app.get('/logout', (req: any, res: any) => {
		if (req.user) {
			req.logout();
			res.json({status: 0, value: null, message: 'OK'});
		} else {
			res.json({status: -1, value: {}, message: 'not logged in.'});
		}
	});

	// regist
	app.post('/register', (req: any, res: any) => {
		if (req.user) {
			LocalAccount.register(new LocalAccount({username: req.body.username}), req.body.password).then(() => {
				res.json({status: 0, value: null, message: 'OK'});
			}).catch((error: any) => {
				res.json({status: -1, message: error.message});
			});
		} else {
			res.json({status: -1, value: {}, message: 'not logged in.'});
		}
	});

	//const passwordRouter = require('./routes/password/api');

	//app.use('/password', passwordRouter);

	/* --------------------end-------------------- */

	/* error handle */
	/* --------------------begin-------------------- */

	app.use((req: any, res: any, next: any) => {
		next(createError(404));
	});

	app.use((err: any, req: any, res: any, next: any) => {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};
		res.status(err.status || 500);
		res.render('error');
	});

	/* --------------------end-------------------- */

});

/* database */
/* --------------------begin-------------------- */

// When the database is closed
MONGOOSE_MODULE.connection.on('closed', () => {
	console.log('closed');
});

// database disconnected
MONGOOSE_MODULE.connection.on('disconnected', () => {
	console.log('disconnected');
});

// When reconnecting to the database
MONGOOSE_MODULE.connection.on('reconnected', () => {
	console.log('reconnected');
});

// Database connection error
MONGOOSE_MODULE.connection.on('error', (error: any) => {
	console.log('error');
});

// Mongo connectivity options
const options = {
	keepAlive: 1,
	connectTimeoutMS: 1000000,
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

MONGOOSE_MODULE.connect(connect_url, options).catch((error: any) => {   // Mongoose connect

});

/* --------------------end-------------------- */

module.exports = app;

