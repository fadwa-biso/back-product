const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

module.exports = [
  express.json(),
  express.urlencoded({ extended: true }),
  cookieParser(),
  morgan("dev"),
];