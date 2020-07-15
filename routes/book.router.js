
const express = require('express');
const { db } = require('../util');
const { responses } = require('../responses');
const router = express.Router();

router.get('/valid', [validRoute, responses.success]);
router.get('/invalid', [invalidRoute, responses.success]);


async function validRoute(req, res, next) {
	const sql = 'SELECT * FROM books'
	try {
		const [response] = await db.query(sql);
		res.locals.data = response;
		next();
	} catch(e) {
		responses.badRequest(res);
		next(e);
	}
}

async function invalidRoute(req, res, next) {
	const sql = 'SELECT * FROM books where invalidColumn = ?';
	try {
		const [response] = await db.query(sql, [1]);
		res.locals.data = response;
		next();
	} catch(e) {
		responses.badRequest(res);
		next(e);
	}
}

module.exports = router;
