var express = require("express");
var routes = require('../routes/routes');

var app = express();
var port = 8080;

app.use(express.json());
app.use('/',routes);

app.listen(port,() => {
    console.log("server opened on port " + port)
});