const result = require('dotenv').config({ path: `${__dirname}/.env` });

if (result.error) {
	console.error(result.error);
}
const express = require('express');

const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./util/mysql');
const mysqlConn = db.pool;
const storeOptions = {
	host: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 3306,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
};
const sessionStore = new MySQLStore(storeOptions, mysqlConn);
if(process.env.USE_SESSION_STORE === 'TRUE') {
	app.use(session({
		secret: process.env.SESSION_SECRET || 'secret',
		resave: true,
		saveUninitialized: true,
		rolling: true,
		store: sessionStore,
		cookie: {
			sameSite: 'lax',
			secure: !!process.env.SECURE_CONTEXT,
			maxAge: parseInt(process.env.SESSION_LENGTH, 10) || 1440000,
		},
	}));
} else {
	app.use(session({
		secret: process.env.SESSION_SECRET || 'secret',
		resave: true,
		saveUninitialized: true,
		rolling: true,
		cookie: {
			sameSite: 'lax',
			secure: !!process.env.SECURE_CONTEXT,
			maxAge: parseInt(process.env.SESSION_LENGTH, 10) || 1440000,
		},
	}));
}

// Set the response headers
app.use((req, res, next) => {
	// set the allowed origins for CORS requests
	const allowedOrigins = ['http://localhost'];
	const { origin } = req.headers;

	if (allowedOrigins.indexOf(origin) > -1) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE',
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
	);
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

const routes = require('./routes');
app.use('/', routes);

app.listen(process.env.PORT || 8080, () => {
	console.log(`Server Listening on port ${process.env.PORT || 8080}`);
});