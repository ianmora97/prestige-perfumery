const exphbs  = require('express-handlebars');
const path = require('path');

/**
 * Functions that can be used in handlebars templates
 * @returns {Object} - Object with helper functions
 */
function helpers(){
    return {
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
        },
        indexPlus: function(value){
            return ++value;
        }
    }
}

/**
 * Create a handlebars instance 
 * @returns {Object} - Object with helper functions
 */
function instance(){
    return exphbs.create({
        helpers: helpers(),
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, '../views/layouts'),
        partialsDir: path.join(__dirname, '../views/partials'),
        extname: '.hbs',
    });
}


module.exports = {
    instance
}