const routes = require('express').Router();

const { createSchools } = require('../controller/schoolController');


routes.post('/school', createSchools);

module.exports = routes;