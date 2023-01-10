const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const artistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 7,

    },
    genre: String,
    age: Number,
    isAlive: Boolean,
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

});

artistSchema.statics.findByCredentials = async (name, password) => {
    console.log(name);
    const user = await Artist.findOne({ name: name });

    if (!user) {
        throw new Error('Unable to find the artist');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Username or password is incorrect');
    }

    return user;

}

artistSchema.methods.generateAuthToken = async function () {
    const artist = this;
    const token = jwt.sign({ _id: artist._id.toString() }, process.env.JWT_SECRET);

    artist.tokens = artist.tokens.concat({ token });
    await artist.save();

    return token;

}

artistSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;