const userService = require('../services/userService');

function handleAuthRequests(req, res, endpoint) {
    switch (endpoint) {
        case 'login':
            login(req, res);
            break
        case 'registration':
            registration(req, res);
            break
    }

}

function login(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                // Parse the received JSON data
                const jsonData = JSON.parse(body);
                console.log('Received JSON:', jsonData);

                const user = await userService.login(jsonData);
                // Respond with a success message
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Location': 'http://localhost:3000/home'
                });

                const response = {
                    userId: user.id,
                    role: user.roleName
                };
                res.end(JSON.stringify(response));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }
        });

    } else {
        res.writeHead(405, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Method Not Allowed'}));
    }
}

function registration(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                // Parse the received JSON data
                const jsonData = JSON.parse(body);
                console.log('Received JSON:', jsonData);
                let user = await userService.registerNewUser(jsonData);
                // Respond with a success message
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Location': 'http://localhost:3000/home'
                });

                const response = {
                    userId: user.id,
                    role: user.roleName
                };
                res.end(JSON.stringify(response));
            } catch (error) {
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: `${error}`}));
            }
        });
    } else {
        res.writeHead(405, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Method Not Allowed'}));
    }
}

module.exports = {
    handleAuthRequests
};