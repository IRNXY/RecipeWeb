const userService = require('../services/userService');
const userRepository = require("../dataAccess/userRepository");
const url = require("url");

function handleUserRequests(req, res, endpoint) {
    if (req.method === 'GET') {
        // Handle GET request for /api/v1/user
        // Your logic to handle GET request
        const parsedUrl = url.parse(req.url, true);
        const queryParams = parsedUrl.query;

        // Log the query parameters to the console
        console.log(queryParams);
        let userId;
        if (endpoint === 'all') {
            getAllUsers(req, res);
        } else if (queryParams.id != null && queryParams.id !== '') {
            userId = queryParams.id;
            getOneUser(req, res, userId);
        }
        // res.writeHead(200, {'Content-Type': 'application/json'});
        // res.end(JSON.stringify("Hello, this is user api"));

    } else if (req.method === 'POST') {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });

        // req.on('end', async () => {
        //     try {
        //         // Parse the received JSON data
        //         const jsonData = JSON.parse(body);
        //         console.log('Received JSON:', jsonData);
        //         await userService.registerNewUser(jsonData);
        //         // Respond with a success message
        //         res.writeHead(200, {'Content-Type': 'application/json', 'Location': 'http://localhost:3000/home'});
        //         res.end(JSON.stringify({message: 'Data received successfully'}));
        //     } catch (error) {
        //         res.writeHead(400, {'Content-Type': 'application/json'});
        //         res.end(JSON.stringify({error: `${error}`}));
        //     }
        // });
    } else if (req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                console.log('Received data:', data);

                await userRepository.changeUserData(data);

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Data received and saved successfully', receivedData: data}));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Invalid JSON'}));
            }
        });

    } else if (req.method === 'DELETE') {
        // Handle DELETE request for /api/v1/users/id=num

        if (endpoint.split("=")[0] === "id") {
            const userId = endpoint.split("=")[1];

            req.on('end', async () => {
                try {
                    // Parse the received JSON data
                    console.log('Received JSON:',);
                    // Delete the user data from database
                    await userRepository.deleteUser(userId);

                    // Send a response indicating success or failure
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({message: 'User deleted successfully'}));
                } catch (error) {
                    res.writeHead(400, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: `${error}`}));
                }
            });
            // End the request to trigger the 'end' event
            req.emit('end');
        } else {
            res.writeHead(405, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: 'Method Not Allowed'}));
        }
    }
}


async function getOneUser(req, res, userId) {
    try {
        // const userId = userService.getUserSession();
        // const userId = 2;
        const userData = await userRepository.getUserById(userId);

        // Respond with a success message
        res.writeHead(200, {'Content-Type': 'application/json', 'Location': 'http://localhost:3000/home'});
        res.end(JSON.stringify(userData[0]));
    } catch (error) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: `${error}`}));
    }
}

async function getAllUsers(req, res) {
    try {
        const userData = await userRepository.getAll();

        // Respond with a success message
        res.writeHead(200, {'Content-Type': 'application/json', 'Location': 'http://localhost:3000/home'});
        res.end(JSON.stringify(userData));
    } catch (error) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: `${error}`}));
    }
}

module.exports = {
    handleUserRequests
};
