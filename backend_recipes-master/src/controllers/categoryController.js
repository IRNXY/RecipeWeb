const url = require('url');
const categoryService = require('../services/categoryService');

async function handleCategoriesRequest(req, res, endpoint) {
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
                let results = await categoryService.getAllCategories();
                console.log(results)

                // Send a response indicating success or failure
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(results));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }
        } else {
            res.writeHead(405, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Method Not Allowed'}));
        }
    }
}

module.exports = {
    handleCategoriesRequest
};