const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./configs/config');
let middleware = require('./middleware');
let cors = require('cors');

class HandlerGenerator {
    login(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        console.log("entro al login:", username, ",", password)

        // For the given username fetch user from DB
        let mockedUsername = 'admin';
        let mockedPassword = 'password';
        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
                console.log("valido OK:", username, ",", password)

                //esta es la respuesta que va al front-end
                let token = jwt.sign({ isAuthenticated: true, usuarioRol: 'admin', usuarioId: username },
                    config.secret, {
                        expiresIn: '1h' // expires in 1 hour
                    }
                );
                console.log("token:", token)
                    // return the JWT token for the future API calls
                res.json({
                    status: 200,
                    isAuthenticated: true,
                    id: 1,
                    username: username,
                    firstName: "nombre",
                    lastName: "apellido",
                    token: token
                });
            } else {
                res.status(403).json({
                    isAuthenticated: false,
                    message: 'Usuario o contraseña incorrectos.'
                });
            }
        } else {
            res.status(400).json({
                isAuthenticated: false,
                message: 'Solicitud incorrecta'
            });
        }
    }

    index(req, res) {
        res.json({
            isAuthenticated: true,
            message: 'Index page'
        });
    }

    user(req, res) {
        res.json({
            id: "usuario",
            email: "usuario",
            name: {
                first: "usuario",
                middle: "usuario",
                last: "usuario",
            },
            picture: "usuario",
            role: "admin",
            userStatus: true,
            dateOfBirth: new Date(),
            address: {
                line1: "usuario",
                line2: "usuario",
                city: "usuario",
                state: "usuario",
                zip: "usuario",
            },
            phones: []
        });
    }

    users(req, res) {
        res.json({
            items: [{
                    id: "string",
                    email: "string",
                    name: {
                        first: "string",
                        middle: "s",
                        last: "string",
                    },
                    picture: "string",
                    role: "nutricionista",
                    userStatus: true,
                    dateOfBirth: new Date(),
                    address: {
                        line1: "string",
                        line2: "string",
                        city: "string",
                        state: "string",
                        zip: "string",
                    },
                    phones: []
                },
                {
                    id: "string2",
                    email: "admin",
                    name: {
                        first: "admin",
                        middle: "admin",
                        last: "admin",
                    },
                    picture: "string2",
                    role: "admin",
                    userStatus: true,
                    dateOfBirth: new Date(),
                    address: {
                        line1: "string2",
                        line2: "string2",
                        city: "string2",
                        state: "string2",
                        zip: "string2",
                    },
                    phones: []
                }
            ]
        });
    }
}

// Starting point of the server
function main() {
    let app = express(); // Export app for other routes to use
    let handlers = new HandlerGenerator();
    const port = process.env.PORT || 8000;
    app.use(cors());
    app.use(bodyParser.urlencoded({ // Middleware
        extended: true
    }));
    app.use(bodyParser.json());
    // Routes & Handlers
    app.post('/login', handlers.login);
    app.get('/', middleware.checkToken, handlers.index);
    app.get('/user/:id', middleware.checkToken, handlers.user);
    app.get('/usuarios', middleware.checkToken, handlers.users);

    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
}

main();