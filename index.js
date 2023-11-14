const uuid = require('uuid');
const express = require('express');
const jwt = require('jsonwebtoken');
const onFinished = require('on-finished');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretKey = 'Secret123!';

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token){
        return res.status(401).send('Access denied');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err){
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
}

app.get('/', auth, (req, res) => {
    res.send('Authorized successfully');
});


app.get('/logout', (req, res) => {
    sessions.destroy(req, res);
    res.redirect('/');
});

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
]

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        if (user.login == login && user.password == password) {
            return true;
        }
        return false
    });

    if (user) {
        const payload = {
            username: user.username,
            login: user.login
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: '12h' });
        res.json({ token: token });
    }

    res.status(401).send('Unauthorized');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
