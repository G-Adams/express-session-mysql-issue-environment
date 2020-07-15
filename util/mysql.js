const driver = require('mysql');

/**
 * Sends a query to the database
 * @param {Connection} conn connection to the database
 * @param {String} sql sql string to execute
 * @param {Array} values values to be put into prepared sql
 */
function queryDatabase(conn, sql, values) {
	return new Promise((res, rej) => {
		const callback = (err, result, fields) => {
			conn.release();
			if (err) {
				rej(err);
			} else {
				res([result, fields]);
			}
		};
		if (!values) {
			conn.query(sql, callback);
		} else {
			conn.query(sql, values, callback);
		}
	});
}

const db = {
	/**
     * Creates a connection pool
     * @param {Object} options the options for the connection other than the defaults
     */
	connect() {
		if (!this.pool) {
			this.pool = driver.createPool({
				host: process.env.DB_HOST || 'localhost',
				port: process.env.DB_PORT || 3306,
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_DATABASE || 'express-session-test',
			});
		}
	},
	/**
     * gets a connection for the connection pool
     */
	getConnection() {
		this.connect();
		return new Promise((res, rej) => {
			this.pool.getConnection((err, connection) => {
				if (err) {
					rej(err);
				} else {
					res(connection);
				}
			});
		});
	},
	/**
     * Runs a database query
     * @param {String} query sql query
     * @param {Array} values the prepared values
     */
	async query(query, values = []) {
		return this.getConnection()
			.then(async (conn) => queryDatabase(conn, query, values));
	},
};

module.exports = db;
