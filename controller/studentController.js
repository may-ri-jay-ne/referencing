const studentModel = require('../model/studentModel');
const schoolModel = require('../model/schoolModel');


exports.createStudent = async(req, res) =>{
    try {
       
       const findSchool = await schoolModel.findById(req.params.id)
       console.log(findSchool);
       
        if(!findSchool) {
           return res.status(404).json({
                message: "Student not found"
            })
        };
        const {name, email, phoneNumber, gender} =req.body;
        const data = {
            name: name.toLowerCase(),
            email:email.trim(),
            phoneNumber,
            gender
        };

        const newStudent = new studentModel(data);
        newStudent.school = req.params._id
// to add the student inside the school database where students is mapped to an empty array
        await newStudent.save();
        // find the school id you want to add a student to, push the student inside the school
        findSchool.school.push(newStudent._id);
        await findSchool.save();
        res.status(200).json({
            message: "Student created succesfully",
            data: newStudent
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
};

exports.getAllStudent = async(req, res) =>{
    try {
        const {id} = req.params;
        const findallStudent = await studentModel.findById();

        if(!findallStudent){
            return res.status(404).json({
                message:'student not found'
            })
        }

        res.status(200).json({
            message:'student find',
            data:findallStudent
        })

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
};

//get one student from the school
exports.getOneStudent = async(req,res)=>{
    try {
        const {id} = req.params;
        const findOne = await studentmodel.findById(id).populate("school", "fullName department -_id");
        
        if(!findOne){
            return res.status(404).json({
                message: 'Student not found'
            })
        }
        res.status(200).json({
            message:'Student found',
            data: findOne
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}