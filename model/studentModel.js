const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type:String
    },
    gender:{
        type:String
    },
    email:{
        type:String
    },
    phoneNumber:{
        type:String
    },
    school:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'school'
    }],
})

const studentModel = mongoose.model( "student", studentSchema);

module.exports = studentModel;
