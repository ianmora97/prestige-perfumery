const express = require('express')
const path = require('path');
const chalk = require('chalk');
var cors = require('cors')
const app = express();
require('dotenv').config();

app.set('port', process.env.PORT);
app.set('host', process.env.HOST);
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname)));

app.use(require('./routes/routes'));

app.listen(app.get('port'), () =>{
    console.log('[',chalk.bgMagenta('OK'),']',chalk.green('CORS-enabled'));
    console.log('[',chalk.bgMagenta('OK'),'] API Restful running on','http://'+app.get('host')+':'+ app.get('port'));
});