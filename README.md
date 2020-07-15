# Express session truncated response bug

## Set up
After intial download run

	npm update
	npm install

Use the provided sql script 'books.sql' to import the test database

Fill in the .env file with your mysql credentials

The environment variable USE\_SESSION\_STORE being set to 'TRUE' tells the program to use the session store. This is set to false initally

To start this program run 

	npm start

Make a get request to localhost:8080/books/valid and verify that the response is valid JSON

Make a get request to localhost:8080/books/invalid and verify that the response is valid JSON.

Change the environment variable USE\_SESSION\_STORE to TRUE

Make a get request to localhost:8080/books/valid and verify that the response is valid JSON

Make a get request to localhost:8080/books/invalid and verify that the response is invalid JSON. (Content length mismatch -  actual response is missing the end '}')

This bug has something to do with either express-mysql-session or express-session
