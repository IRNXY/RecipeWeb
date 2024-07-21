const pool = require("../config/dbConnection");

async function getAllCategories() {
    let query = 'SELECT * FROM category;';
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}

module.exports = {
    getAllCategories,
}