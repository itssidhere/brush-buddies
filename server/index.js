const express = require('express');

require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cors = require('cors');

const artistRouter = require('./routers/artist-router');

const app = express();

// Connect Database
connectDB();
app.use(cors());
// Init Middleware
app.use(express.json({ extended: false }));

//create a get request to get all the artists in artist collection

app.use('/api/users', artistRouter);



app.listen(port, () => console.log(`Server started on port ${port}`));
