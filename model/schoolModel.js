const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {
        type:String,
        require:true,
    },
    department:{
        type:String,
        enum:["Science", "Art", "Commercial"],
        message: "Deaprtment can either be Science, Art or Commercial" 
    },
    address:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    school:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'student'
    }],

}, {
    timestamps:true
});


const schoolModel = mongoose.model( "school", schoolSchema);

module.exports = schoolModel;