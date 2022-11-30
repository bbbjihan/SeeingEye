var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');
const fsExtra = require('fs-extra');
let {PythonShell} = require('python-shell');
const fs = require('fs');
const jsonFile = fs.readFileSync(__dirname + '/../productInform.json', 'utf8');
const jsonData = JSON.parse(jsonFile);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'yolov5/data/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.jpg');
    }
});
  
const upload = multer({ storage: storage });

router.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/../pages/index.html'));
});

router.post('/send/image',upload.single("image"),function(req,res){
    var image;
    req.file ? image = `${req.file.filename}` : image = '';
    var PSOptions = {
        mode: 'text',
        pythonPath: '',
        pythonOptions: [],
        scriptPath: 'yolov5',
        args: []
    };

    PythonShell.run("detect.py",PSOptions,function(err,result){
        if (err) console.log(err);
        else {
            const index = result[0].split(" ");
            console.log(index);
            switch(index[0]){
                case '0':
                    res.redirect('/print/0');
                    break;
                case '1':
                    res.redirect('/print/1');
                    break;
                case '2':
                    res.redirect('/print/2');
                    break;
                case '3':
                    res.redirect('/print/3');
                    break;
                case '4':
                    res.redirect('/print/4');
                    break;
                default:
                    res.redirect('/print/err');
                    break;
            }
        }
    });
});

router.get('/print/:index', function(req,res){
    fsExtra.emptyDirSync(__dirname + '/../yolov5/data/images');
    let index = req.params.index;
    switch(index){
        case '0':
            res.sendFile(path.join(__dirname + '/../pages/print0.html'));
            break;
        case '1':
            res.sendFile(path.join(__dirname + '/../pages/print1.html'));
            break;
        case '2':
            res.sendFile(path.join(__dirname + '/../pages/print2.html'));
            break;
        case '3':
            res.sendFile(path.join(__dirname + '/../pages/print3.html'));
            break;
        case '4':
            res.sendFile(path.join(__dirname + '/../pages/print4.html'));
            break;
        default:
            res.sendFile(path.join(__dirname + '/../pages/printErr.html'));
            break;
    }
})

module.exports = router;