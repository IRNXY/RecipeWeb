pool = require('../config/dbConnection');

async function checkUserExistsByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        pool.query(query, [email], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].count > 0);
            }
        });
    });
}

async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT u.id, u.email, u.password, r.roleName FROM users u inner join roles r on u.role_id = r.id  WHERE email = ?';
        pool.query(query, [email], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getUserById(id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT u.id, u.first_name, u.last_name, u.email, u.password, r.roleName FROM users u inner join roles r on u.role_id = r.id WHERE u.id = ?';
        pool.query(query, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function getAll() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE is_deleted = false';
        pool.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function createUser(userData) {
    return new Promise((resolve, reject) => {
        const queryString = "INSERT INTO users (email, first_name, last_name, password, created_at, modified_at, is_deleted, role_id) VALUE ( ?, ?, ?, ?, NOW(), NOW(), ?, ?)";
        pool.query(queryString, [userData.email, userData.firstName, userData.lastName, userData.password, 0, 2], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function changeUserData(userNewData) {
    return new Promise((resolve, reject) => {
        let array_parameters = [];
        let array_arguments = []

        const queryStringUpdate = "UPDATE users ";

        if ("firstname" in userNewData){
            array_parameters.push( "first_name = ?");
            array_arguments.push(userNewData.firstname);
        }
        if ("lastname" in userNewData){
            array_parameters.push( "last_name = ?");
            array_arguments.push(userNewData.lastname);
        }
        if ("password" in userNewData){
            array_parameters.push( "password = ?");
            array_arguments.push(userNewData.password);
        }
        array_arguments.push(userNewData.email);

        let queryStringSet = "SET " + array_parameters.join(" AND ")
        const queryStringWhere = " WHERE email = ?";
        const queryStringFull = queryStringUpdate + queryStringSet + queryStringWhere + ';';

        console.log(queryStringFull);
        console.log(array_arguments);

        pool.query(queryStringFull, array_arguments, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function deleteUser(id){
    return new Promise((resolve, reject) => {
        const queryStringe = 'UPDATE users SET is_deleted = true, modified_at = NOW() WHERE id = ?';
        pool.query(queryStringe, [id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}


module.exports = {
    checkUserExistsByEmail,
    getUserByEmail,
    getUserById,
    getAll,
    createUser,
    changeUserData,
    deleteUser,
};