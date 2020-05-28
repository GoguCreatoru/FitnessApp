//Express
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");


//Passport and session
var passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

//parse requests ( application/json )
app.use(bodyParser.json());

//parse requests ( application/x-www-form-urlencoded )
app.use(bodyParser.urlencoded({ extended:true }));

// add Database to server
const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() =>{
    console.log("Drop and re-sync database.");
});

require("./app/routes/user.routes")(app);

// set port and start server

const PORT = process.env.PORT || 8080;
https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
}, app)
.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}.`)
});