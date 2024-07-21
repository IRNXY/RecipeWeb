const pool = require('../config/dbConnection');

async function createRecipe(recipeDto) {
    const query = `
        INSERT INTO recipes (title, description, ingredients, instructions, cooking_time, serving_size, author_id,
                             category_id,
                             rating, created_at, modified_at, is_deleted, is_moderated, is_visible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), false, false, true)
    `;

    return new Promise((resolve, reject) => {
        pool.query(query, [recipeDto.title,recipeDto.description, recipeDto.ingredients, recipeDto.instructions, recipeDto.cooking_time, recipeDto.serving_size, Number(recipeDto.author_id), recipeDto.category_id, recipeDto.rating], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}

async function getRecipeById(id) {
    const query = 'SELECT r.*, c.catName as category FROM recipes r inner join category c on r.category_id = c.id  WHERE r.id = ?';
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                reject(err);
            } else resolve(results);
        });
    });
}

async function updateRecipe(id, updates) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(id);

    const query = `UPDATE recipes
                   SET ${fields.join(', ')},
                       modified_at = NOW()
                   WHERE id = ?`;

    return new Promise((resolve, reject) => {
        pool.query(query, [values], (err, results) => {
            if (err) {
                reject(err);
            } else resolve(results.affectedRows);
        });
    });
}

async function deleteRecipe(id) {
    const query = 'UPDATE recipes SET is_deleted = true, modified_at = NOW() WHERE id = ?';
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                reject(err);
            } else resolve(results.affectedRows);
        });
    });
}

async function getAllRecipes(role) {
    let query = 'SELECT id, title, description as description FROM recipes WHERE is_deleted = 0 ';
    return new Promise((resolve, reject) => {
        if (role === 'USER') {
            query += 'AND is_moderated = 1 AND is_visible = 1;';
        }
        pool.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}

// function getAllRecipesByAuthor(author_id, role) {
//     let query = 'SELECT * FROM recipes WHERE author_id = ?';
//     const values = [author_id];
//
//     if (role === 'USER') {
//         query += ' AND is_deleted = false AND is_moderated = true AND is_visible = true';
//     }
//
//     return pool.execute(query, values)
//         .then(([rows]) => rows)
//         .catch(err => Promise.reject(err));
// }


module.exports = {
    createRecipe,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getAllRecipes,
    // getAllRecipesByAuthor
};