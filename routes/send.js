var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'yolov5/data/images')
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname, path.extname(file.originalname))+ '-' + Date.now());
    }
})
  
const upload = multer({ storage: storage })

router.post('/write',upload.single("image"),function(req,res){
    var today = new Date;
    var time = today.getTime();
    req.file ? image = `/images/${time}` : image = '';
    var datas = [time, image];
    writeModel.insertData(datas, ()=>{
        res.redirect('/');
    });
});

module.exports=router;