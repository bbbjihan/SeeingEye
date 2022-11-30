var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');
const fsExtra = require('fs-extra');
let {PythonShell} = require('python-shell');
const fs = require('fs');

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

router.get('/productInform.js', function(req,res){
    res.sendFile(path.join(__dirname + '/../productInform.js'));
});

router.get('/name.mp3', function(req,res){
    res.sendFile(path.join(__dirname + '/../name.mp3'));
});

router.get('/type.mp3', function(req,res){
    res.sendFile(path.join(__dirname + '/../type.mp3'));
});

router.get('/nutrient.mp3', function(req,res){
    res.sendFile(path.join(__dirname + '/../nutrient.mp3'));
});

router.get('/ingredient.mp3', function(req,res){
    res.sendFile(path.join(__dirname + '/../ingredient.mp3'));
});

router.get('/allergy.mp3', function(req,res){
    res.sendFile(path.join(__dirname + '/../allergy.mp3'));
});

router.get('/howToCook.mp3', function(req,res){
    res.sendFile(path.join(__dirname + '/../howToCook.mp3'));
});

router.get('/taste.mp3', function(req,res){
    res.sendFile(path.join(__dirname + '/../taste.mp3'));
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
            res.redirect('/print?' + index);
        }
    });
});

router.get('/print', function(req,res){
    fsExtra.emptyDirSync(__dirname + '/../yolov5/data/images');
    res.sendFile(path.join(__dirname + '/../pages/print.html'));
})

const textToSpeech = require('@google-cloud/text-to-speech');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient();
const jsonFile = fs.readFileSync('./productInform.json', 'utf8');
const jsonData = JSON.parse(jsonFile);

async function createAudio(index, fileName) {
    // The text to synthesize
    data = jsonData.products
    let text = "오류가 발생했습니다.";
    if(fileName == 'name'){
        text = data[index].name;
    }else if(fileName == 'type'){
        text = data[index].type;
    }else if(fileName == 'nutrient'){
        text = data[index].nutrient;
    }else if(fileName == 'ingredient'){
        text = data[index].ingredient;
    }else if(fileName == 'allergy'){
        text = data[index].allergy;
    }else if(fileName == 'howToCook'){
        text = data[index].howToCook;
    }else if(fileName == 'taste'){
        text = data[index].taste;
    }
  
    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'ko-KR', ssmlGender: 'NEUTRAL'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };
  
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(fileName + '.mp3', response.audioContent, 'binary');
    //console.log('Audio content written to file:' + fileName + '.mp3');
}
router.get('/inform',function(req,res){
    const index = req.url[8];
    createAudio(index, 'name');
    createAudio(index, 'type');
    createAudio(index, 'nutrient');
    createAudio(index, 'ingredient');
    createAudio(index, 'allergy');
    createAudio(index, 'howToCook');
    createAudio(index, 'taste');
    //console.log(req.url)
    res.redirect('/print?' + index);
})

module.exports = router;