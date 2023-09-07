const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    id:{
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    table: {
        type: String,
        required: true
    },
    row:{
        type: String,
        required: true
    },
    who: {
        type: String,
        required: true
    },
    what: {
        type: String,
        required: true
    },
    when: {
        type: Date,
        required: true
    }
});

const Report = mongoose.model('Report', ReportSchema);

exports.get = async (resolve) => {
    const report = await Report.find();
    resolve({
        status: 200,
        data: report
    });
};

exports.getByTable = async (table, resolve) => {
    const report = await Report.find({table: table});
    resolve({
        status: 200,
        data: report
    });
};

exports.getById = async (id, resolve) => {
    const report = await Report.findById(id);
    resolve({
        status: 200,
        data: report
    });
};

exports.create = async (report, resolve) => {
    const newReport = new Report(report);
    await newReport.save();
    resolve({
        status: 200,
        data: newReport
    });
}