const mongoose = require('mongoose');

function connection(){
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(db => console.log('[OK] MongoDB connected'))
    .catch(err => console.log(err));
}

connection();