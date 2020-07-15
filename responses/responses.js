const responses = {
	badRequest(res) {
		res.status(400).json({'badRequest': 'truncated'});
	},
	success(req, res, next) {
		res.status(200).json(res.locals.data);
		next();
	}
}

module.exports = responses;