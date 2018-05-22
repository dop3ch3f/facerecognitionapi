const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
//initialize the db
const knex = require('knex')({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "root",
        database: "smart-brain"
    }
});
//importing controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const entry = require('./controllers/entries');
//initializing the express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

//Home
app.get('/', (req, res) => {
    res.send(database.users);
});

//Sign in 
app.post('/signin', signin.handleSignin(knex, bcrypt));
//Profile
app.get('/profile/:id', profile.handleProfile(knex));
//Register
app.post('/register', register.handleRegister(knex, bcrypt));
//Image entries
app.put('/image', entry.handleEntry(knex));
//Image Link
app.post('/imageurl', (req, res) => entry.handleApiCall(req, res));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server live @ ${process.env.PORT}`);
})