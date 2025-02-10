// const {model} = require('mongoose');
const schoolModel = require('../model/schoolModel');

//create school database 
exports.createSchools = async(req, res) =>{
    try {
        const {name, email, address, department} =req.body;
        const data = {
            name: name.trim(),
            email: email.trim(),
           address,
            department
        };
       const newSchool =  await schoolModel.create(data)
        res.status(200).json({
            message: 'School created succesfully',
            data: newSchool
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }
};

//get all the student
exports.getAllSchool = async(req, res) =>{
    try {
        const findallSchool = await schoolModel.find().populate("students", "name gender phoneNumber -_id");
        res.status(200).json({
            message: "All school found",
            data: findallSchool
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}