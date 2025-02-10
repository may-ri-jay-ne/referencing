// TXz3ZhFlyRwnh3x1 password for mongoose
// mongodb+srv://uzochukwufaustina:TXz3ZhFlyRwnh3x1@cluster0.vphma.mongodb.net/
// mongodb+srv://uzochukwufaustina:<db_password>@cluster0.vphma.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const express = require('express');

require("dotenv").config();
const DATABASE_URL = process.env.DATABASE_URL;

const mongoose = require("mongoose");
const routes = require("./routes/schoolRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(express.json());
app.use(routes);
app.use(studentRoutes);

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

