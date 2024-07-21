const recipeRepository = require("../dataAccess/recipeRepository");

function createRecipe(recipe) {
    re
}

async function getAllRecipes() {
    return await recipeRepository.getAllRecipes("USER").then(
        result => {
            return result
        }
    );

}


async function getRecipeById(recipeId) {
    return await recipeRepository.getRecipeById(recipeId).then(
        result => {
            return result[0]
        }
    );

}

module.exports = {
    getAllRecipes,
    getRecipeById
}