const express = require('express');
const path = require('path');
const hbs = require('./backend/handlebars/config').instance();
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
var cookieParser = require('cookie-parser')
const morgan = require('morgan');
const {stream,customLog,logErrors,logErrorsMiddleware} = require('./backend/helpers/logger');
// const {toHttps,cert} = require('./backend/middlewares/security/https');

// Initializations
const app = express();
require("dotenv").config();

// Settings
app.set('port', process.env.PORT);
app.set('host', process.env.HOST || '');
app.set('views', path.join(__dirname, 'backend/views'));

// ? Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// ? handlebars
app.set('view engine', '.hbs');
app.engine('.hbs', hbs.engine);

// ? Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logErrorsMiddleware);

// ? Logger with Morgan
morgan.token('custom', customLog);
app.use(morgan(':custom', { stream: stream })); // todo: logger for morgan

// Routes
app.use(require('./backend/routes/index.routes'));
app.use(require('./backend/routes/api.routes'));
app.use(require('./backend/routes/auth.routes'));
app.use(require('./backend/routes/client.routes'));
app.use(require('./backend/routes/dashboard.routes'));

// ? Start the server
http.createServer(app).listen(app.get('port'), () => {
    console.log(`[OK] SERVER STARTED ON PORT ${app.get('port')}`)
});
if(process.env.NODE_ENV === 'prod'){
    // ? Security and HTTPS
    app.enable('trust proxy');
    // app.use(toHttps);
    https.createServer(cert(), app).listen(443, () => {
        console.log(`[OK] PRODUCTION SERVER STARTED`);
    });
}