const routes = require("express").Router();
const { createStudent, getAllStudent } = require("../controller/studentController");


routes.post('/student/:id', createStudent);
routes.get('/student', getAllStudent);

module.exports = routes;