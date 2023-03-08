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

let hbs = exphbs.create({
    helpers: {
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    },
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Global variables

// Routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/api.routes'));
app.use(require('./routes/auth.routes'));
app.use(require('./routes/client.routes'));
app.use(require('./routes/dashboard.routes'));


// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server list ener
app.listen(app.get('port'), app.get('host'), () => {
    console.log(`[OK] Server on port ${app.get('port')}`);
});