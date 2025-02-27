const routes = require('express').Router();

const { createSchools, changeDP, getAllSchool, verifyEmail, userLogin, getOneSchool } = require('../controller/schoolController');
const upload = require('../helper/multer')


// routes.post('/school',createSchools);

routes.post('/school', upload.single('photo'), createSchools);
routes.patch('/schools/:id', upload.single('photo'), changeDP);
routes.get('/school', getAllSchool);
routes.get('/school/:id', getOneSchool);

// //using get instead of patch to run this on a browser instead of postman
// routes.get('/mail/:id', verifyEmail);
routes.post('/login', userLogin)
routes.get('/mail/:id/:token', verifyEmail)

module.exports = routes;