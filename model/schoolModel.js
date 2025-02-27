const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: {
        type:String,
        require:true,
        lowercase: true,
        trim: true
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
    password:{
        type:String,
        require:true
    },
    isVerified:{
        type: Boolean,
        default:false
    },
    schoolImageURL:{
        type:String
    },
    schoolImageId:{
        type:String
    },
    dateCreated:{
        type:Date,
        default:()=>{
            const date = new Date
            return date.toISOString()
        }
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase: true
    },
    student:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'student'
    }],

}, {
    timestamps:true
});


const schoolModel = mongoose.model( "school", schoolSchema);

module.exports = schoolModel;