const handleProfile = (knex) => (req, res) => {
    const { id } = req.params;
    if (isNaN(id) === true) {
        return res.status(400).json('Invalid Input')
    }
    return knex.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('User not found')
            }
        })
        .catch(err => res.status(400).json('Error getting user'))
}

module.exports = { handleProfile }