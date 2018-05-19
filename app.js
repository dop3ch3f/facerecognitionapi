const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex')({
    client: "pg",
    connection: {
        host: "127.0.0.1",
        user: "postgres",
        password: "root",
        database: "smart-brain"
    }
});
//initializing the express app
const app = express();

app.use(cors());
app.use(bodyParser.json());

//Home
app.get('/', (req, res) => {
    res.send(database.users);
});

//Sign in 
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return knex.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('Unable to get user'))
            } else {
                res.status(400).json('Wrong Credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong Credentials'))
});

//Profile
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    return knex.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('User not found')
            }
        })
        .catch(err => res.status(400).json('Error getting user'))
});

//Register
app.post('/register', (req, res) => {
    const { email, password, name } = req.body;
    const hash = bcrypt.hashSync(password);
    return knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .returning('*')
                    .then(user => {
                        res.json(user[0]);
                    })

            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Error inserting users'))

})


//Image
app.put('/image', (req, res) => {
    const { id } = req.body;
    return knex('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(value => {
            res.json(value[0])
        })
        .catch(err => res.status(400).json('Error getting entries'))
})

app.listen(3000, () => {
    console.log("Server listening at port 3000");
})