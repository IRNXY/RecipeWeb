const categoryRepository = require('../dataAccess/categoryRepository');

async function getAllCategories() {
    return await categoryRepository.getAllCategories().then(
        result => {
            return result
        }
    );

}

module.exports = {
    getAllCategories,
}