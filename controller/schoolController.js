// const {model} = require('mongoose');
const schoolModel = require('../model/schoolModel');
const cloudinary = require('../helper/cloudinary');
const fs = require('fs');
const sendMail = require('../helper/email');
const jwt = require('jsonwebtoken');
const signup = require('../helper/signUp');
const bcrypt = require('bcryptjs');

//create school database 
exports.createSchools = async(req, res) =>{
    try {
// to upload images on cloudinary using the file path
        
        const {name, email, address, department, password} =req.body;

        //create a profile picture for a user. this allows a user to add a profile picture when creating an account.
        const uploadImage = await cloudinary.uploader.upload(req.file.path, (err)=>{
            if(err){
                return res.status(400).json({
                    message: "This is a wrong image" + err.message
                })
            }
        });
        
        // //this takes the password the user inputs while being in an encrypt format
        const salt = await bcrypt.genSaltSync(10);
        const hash = await bcrypt.hashSync(password, salt);
        //store hash in password database

        const data = {
            name,
            email,
            address,
            password: hash,
            department,
            studentImageURL: uploadImage.secure_url ,
            studentImageId: uploadImage.public_id
        };

        // to delete image saved on local file after being uploaded on git
        fs.unlink(req.file.path, (err)=>{
            if (err){
                console.log(err.message)
            }else{
                console.log("File removed successfully")
            }
        })

       const newSchool =  await schoolModel.create(data);

       //this allows set a timer on how long a link/account is open or accessible to a user especially during verification
       const token = await jwt.sign({id:newSchool._id}, "secret_key", {expiresIn: "3m"})
    //    //this is used to get the url link from the brower which is sent to the user's email during sign-up
       const link = `${req.protocol}://${req.get('host')}/mail/${newSchool._id}/${token}`;
       const subject = "Welcome" + " " + name;
       const text = `Welcome ${newSchool.name}, click on this link to verify your mail using ${link}`;
       
       sendMail({subject:subject, html:signup(link, newSchool.name), email:newSchool.email});
       sendMail ({subject, text, email});
        res.status(200).json({
            message: ' New School created succesfully',
            data: newSchool
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }
};
exports.verifyEmail = async (req, res)=>{
    try{
        const {id} = req.params;
        //this confirm if this is a hosted route and it will return http or local host- https
        // console.log(req.protocol);
        //if it a local host it run on the terminal showing the host port
        // console.log(req.get('host'));
        const checkUser = await schoolModel.findById(id);

        if (!checkUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (checkUser.isVerified == true){
            return res.status(400).json({message: "Email already verified"})
        }
        //verify the  token the user input
        await jwt.verify(req.params.token,"secret_key", (error)=>{
            if(error)
            return res.status(404).json({
                message: "Link has expired"
            })

        })
        const verifyEmail = await schoolModel.findByIdAndUpdate(id, {isVerified:true});
        // if (!verifyEmail){
        //     return res.status(404).json({
        //         message: "Email already verified"
        //     })
        // }
        res.status(200).json({
            message: "User email verified successfully",
            data: verifyEmail

        })
 
    }catch(error){
        return res.status(500).json({
            message:error.message
        });
    }

}

exports.userLogin = async(req, res) =>{
    try {
        const {email, password}=  req.body;
        const checkEmail = await schoolModel.findOne({email})// to select details you want to display in response body .select('fullName', '_id', 'email', 'password');
        if(!checkEmail){
            return res.status(400).json({
                message: "Email not found"
            })
        }
        const checkPassword = await bcrypt.compare(password, checkEmail.password)
        if(!checkPassword){
            return res.status(400).json({
                messgae: "Incorrect password"
            })
        } if (checkEmail.isVerified == false){
            return res.status(400).json({
                message: "Email not verified"
            })
        }
// second method to get properties from response body instead of .select
        // const newData = {
        //     fullName:checkEmail.fullName,
        //     email: checkEmail.email,
        //     id:checkEmail._id
        // }

        //3rd method to return some properties in the response body using spread operator
        //const {isVerifed, imageURL, schholImageId, department, student, dateCreated, password,  ...others} = checkEmail._doc

        const token = await jwt.sign({id:checkEmail._id}, "secret_key", {expiresIn: '24hr'})
        res.status(200).json({
            message: 'Login successfully',
            data: checkEmail,
            // data: newData
            //dta: others,
            token
        }) 
    } catch (error) {
        return res.status(500).json({
            message: "Unable to login" + " " + error.message
        })
    }
}
//get all the student
exports.getAllSchool = async(req, res) =>{
    try {
        // get the lit of schools and provide the specified details needed
        const findallSchool = await schoolModel.find().populate("student");
        //const findallSchool = await schoolModel.find().populate("students", "name gender phoneNumber -_id");
        res.status(200).json({
            message: "All school found",
            data: findallSchool,
            total: findallSchool.length

        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

exports.getOneSchool = async(req,res)=>{
    try {
        const {id} = req.params;
        const findOneSchool = await schoolModel.findById(id).populate("student");
        
        if(!findOneSchool){
            return res.status(404).json({
                message: 'School not found'
            })
        }
        res.status(200).json({
            message:'School found',
            data: findOneSchool
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

exports.changeDP = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                message: "No image file uploaded"
            });
        }

        const { id } = req.params;
        const changeImage = await schoolModel.findById(id);
        
        if (!changeImage) {
            return res.status(404).json({
                message: "School not found"
            });
        }

        // Upload new image to Cloudinary
        const sendImage = await cloudinary.uploader.upload(req.file.path);

        // Delete the previous image from Cloudinary if it exists
        if (changeImage.schoolImageId) {
            await cloudinary.uploader.destroy(changeImage.schoolImageId);
        }

        // Delete local file
        await fs.promises.unlink(req.file.path);

        // Update with new image
        const updatedImage = await schoolModel.findByIdAndUpdate(
            id,
            {
                schoolImageURL: sendImage.secure_url,
                schoolImageId: sendImage.public_id
            },
            { new: true }
        );
        
        return res.status(200).json({
            message: "Image successfully updated",
            data: updatedImage
        });
        
    } catch (error) {
        // Clean up uploaded file if there's an error
        if (req.file) {
            await fs.promises.unlink(req.file.path).catch(console.error);
        }
        
        return res.status(500).json({
            message: error.message
        });
    }
};
// 