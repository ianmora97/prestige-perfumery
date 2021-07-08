const mongoose = require('mongoose')

const notifications = new mongoose.Schema({
    usuario:{
        type: Number,
        required: true
    },
    texto:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    icon:{
        type: String,
        required: true,
        default: '<i class="fas fa-exclamation-circle"></i>'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Notifications',notifications)