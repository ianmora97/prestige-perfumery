const mongoose = require('mongoose');

const DashboardSchema= new mongoose.Schema({
    id:{
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: String,
        required: true
    },
    buttons: {
        type: Object,
        required: true
    }
});
const Dashbboard = mongoose.model('Dashbboard', DashboardSchema);

exports.get = async (resolve) => {
    const dashboard = await Dashbboard.find();
    resolve({
        status: 200,
        data: dashboard
    });
};

exports.create = async (dash, resolve) => {
    const newDashboard = new Dashbboard(dash);
    await newDashboard.save();
    resolve({
        status: 200,
        data: newDashboard
    });
};

exports.update = async (id, content, resolve) => {
    const dash = await Dashbboard.findByIdAndUpdate(id, content);
    resolve({
        status: 200,
        data: dash
    });
}

exports.getOne = async (name, resolve) => {
    const dash = await Dashbboard.findOne({name: name});
    resolve({
        status: 200,
        data: dash
    });
}