const db = require('../db/queries');
const { body, validationResult } = require("express-validator");

const validateFile = [
    body("fileName").trim()
];

const newFilePost = [
    validateFile,

];

module.exports = {
    newFilePost,
}