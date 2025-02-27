const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{ //cd is used to check for error. before sending to croudinary we must first save to folder
    cb(null, './upload')
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)

    }
});

const fileFilter = (req, file, cb)=>{
    const allowType = ['image/jpeg', 'image/png', 'image/svg', 'image/jpg']
    if(allowType.includes(file.mimetype)){
        cb(null, true) 
    }else{
        cb(new Error('Only images allowed'))
    }
};

const limits = {fileSize: 1024 * 1024}

const upload = multer({fileFilter, limits, storage});

module.exports = upload
