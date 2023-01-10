const router = require('express').Router();

const Artist = require('../models/Artist');

const auth = require('../middleware/auth');

//redirect get and post request 

router.post('/artists/login', async (req, res) => {
    try {

        const artist = await Artist.findByCredentials(req.body.name, req.body.password)
        const token = await artist.generateAuthToken();
        res.send({ artist, token });
    }
    catch (e) {

        res.status(400).send('Unable to login');
    }
});

router.get('/artists/me', auth, async (req, res) => {
    res.send(req.artist);
});

router.get('/', (req, res) => {

    const artist = Artist.find();
    artist.then(data => {
        res.json(data);
    })
});

router.post('/artists', async (req, res) => {

    const artist = new Artist(req.body);

    try {
        await artist.save();
        const token = await artist.generateAuthToken();

        res.status(201).send({ artist, token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }

}
);

module.exports = router;