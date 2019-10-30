const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            res.status(401).send({error: 'Invalid Authentication'})
        }
        req.token = token
        next()
    } catch (e) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth