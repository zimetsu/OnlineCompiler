const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: ["cpp", "py"]
    },
    submittedAt: {
      type: Date,
      default: Date.now  
    },
    startedAt: {
        type: Date,  
    },
    completedAt: {
        type: Date
    },
    output: {
        type: String
    },
    filepath: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "success", "error"]
    }

    
});
const Job = new mongoose.model('Job', JobSchema);
module.exports = Job;