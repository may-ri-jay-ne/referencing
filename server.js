
const express = require('express');

require("dotenv").config()
const DATABASE_URL = process.env.DATABASE_URL;

const mongoose = require("mongoose");
const routes = require("./routes/schoolRoutes");
const studentRoutes = require("./routes/studentRoutes");
const multer = require('multer');

const app = express();
app.use(express.json());

app.use(routes);
app.use(studentRoutes);
app.use((err, req, res, next)=>{
    if(err)
        return res.status(400).json({
    message:err.message})
    next()
})

mongoose.connect(DATABASE_URL)
.then(() => {
    console.log("Database connection established")

    app.listen(PORT, ()=>{
        console.log(`Server is listening to PORT: ${PORT}`)
    });

}).catch ((err)=>{
    console.log("Unable to connect to DB because" + err)
})
const PORT = 5060;

