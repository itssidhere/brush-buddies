const jwt = require('jsonwebtoken');
const Artist = require('../models/Artist');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const artist = await Artist.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!artist) {
            throw new Error();
        }

        req.artist = artist;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;

