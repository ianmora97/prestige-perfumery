const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

// Initializations
const app = express();
require("dotenv").config();

// Settings
app.set('port', process.env.PORT);
app.set('host', process.env.HOST || '');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Global variables

// Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/api.routes'));
app.use(require('./routes/auth.routes'));
app.use(require('./routes/dashboard.routes'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server list ener
app.listen(app.get('port'), app.get('host'), () => {
    console.log(`Server on port ${app.get('port')}`);
});