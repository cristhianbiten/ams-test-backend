require("dotenv").config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const port = process.env.PORT;
const front = process.env.FRONTEND;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use(cors({ credentials: true, origin: front }));

// db connection
require("./config/db.js");

// routes
const router = require("./routes/Router.js");

app.use(router);

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
    }
);

