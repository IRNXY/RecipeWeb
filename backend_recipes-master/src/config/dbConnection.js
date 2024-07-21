const {DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD} = process.env;
const fs = require('fs');
// Get the client
const mysql = require('mysql2');

console.log(DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD);

// Create the connection to database
const pool = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,

});

pool.connect(function (err) {
    if (err) throw err;
    console.log("Connected!" + " " + DB_NAME);

})

fs.readFile(__dirname + '/' + 'sqlScripts/init.sql', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading SQL file:', err);
        return;
    }

    // Split the SQL file into individual statements
    const sqlStatements = data.split(';');

    // Execute each SQL statement one by one
    for (const statement of sqlStatements) {
        if (statement.trim()) {
            try {
                // Execute the SQL statement
                await pool.promise().query(statement);
                console.log('Executed SQL statement:', statement);
            } catch (error) {
                console.error('Error executing SQL statement:', statement, error);
            }
        }
    }

    // Close the MySQL connection pool
    // connection.end();
});


module.exports = pool;

//docker run --name csit128DB -e MYSQL_PASSWORD=csit128userPassword -e MYSQL_USER=csit128user -e MYSQL_ROOT_PASSWORD=12345678 -e MYSQL_ROOT_HOST=localhost -e MYSQL_DATABASE=csit128projectDB -p 3306:3306 -d mysql:latest