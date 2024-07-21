const path = require('path');
const recipeRepository = require('../dataAccess/recipeRepository')
const recipeService = require('../services/recipeService');
require('../models/RecipeDto');
const url = require('url');
const RecipeDto = require("../models/RecipeDto");

async function handleRecipeRequest(req, res, endpoint) {
    if (req.method === 'GET') {
        // Handle GET request for /api/v1/recipe
        const parsedUrl = url.parse(req.url, true);
        const queryParams = parsedUrl.query;

        // Log the query parameters to the console
        console.log(queryParams);
        let userId;
        if (endpoint === 'all') {
            try {
                console.log(req.url);
                // get all recipes from db
                let results = await recipeService.getAllRecipes();

                // Send a response indicating success or failure
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(results));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }

        } else if (queryParams.id != null && queryParams.id !== '') {
            let recipeId = queryParams.id;

            try {
                console.log(req.url);
                // get all recipes from db
                let results = await recipeService.getRecipeById(recipeId);

                // Send a response indicating success or failure
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(results));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }

        }
    } else if (req.method === 'POST') {
        // Handle POST request for /api/v1/recipe
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            let recipe;
            try {
                // Parse the received JSON data
                const jsonData = JSON.parse(body);
                console.log('Received JSON:', jsonData);
                recipe = new RecipeDto(jsonData)
                // recipe.author_id = 2
                // Save the recipe data to the database or perform other operations
                await recipeRepository.createRecipe(recipe);

                // Send a response indicating success or failure
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Recipe created successfully'}));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }
        });
    } else if (req.method === 'PUT') {

        const parsedUrl = url.parse(req.url, true);
        const queryParams = parsedUrl.query;

        if (queryParams.id != null && queryParams.id !== '') {
            let recipeId = queryParams.id;

            try {
                console.log(req.url);
                // get all recipes from db
                let results = await recipeService.getRecipeById(recipeId);

                // Send a response indicating success or failure
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(results));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }

        }

    } else if (req.method === 'DELETE') {
        // Handle DELETE request for /api/v1/recipe:id
        const parsedUrl = url.parse(req.url, true);
        const queryParams = parsedUrl.query;

        if (queryParams.id != null && queryParams.id !== '') {
            let recipeId = queryParams.id;
            try {
                await recipeRepository.deleteRecipe(recipeId);

                // Send a response indicating success or failure
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Recipe deleted successfully'}));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }
        } else {
            // Send a 404 response if the URL does not match the expected pattern
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Invalid URL'}));
        }

    } else {
        res.writeHead(405, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Method Not Allowed'}));
    }
}

module.exports = {
    handleRecipeRequest
};