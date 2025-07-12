const express = require('express');
// require {'dotenv'}.config();   // eng ali typing way..
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
dotenv.config();

module.exports = [
    express.json(),
    express.urlencoded(),
    cookieParser(),
    cors(),
    morgan('dev'),
]
