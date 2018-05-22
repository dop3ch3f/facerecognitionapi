const Clarifai = require('clarifai');
//clarifai api config
const app = new Clarifai.App({
    apiKey: 'fe39004f071c45d59db743cd74c24c94'
});

const handleApiCall = (req, res) => {
    const { input } = req.body;
    return app.models
        .predict(Clarifai.FACE_DETECT_MODEL, input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json("Error communicating with the server"))
}

const handleEntry = (knex) => (req, res) => {
    const { id } = req.body;
    if (isNaN(id) === true) {
        return res.status(400).json('Invalid Input')
    }
    return knex('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(value => {
            res.json(value[0])
        })
        .catch(err => res.status(400).json('Error getting entries'))
}

module.exports = { handleEntry, handleApiCall }