const express = require("express");
const {generateFile} = require('./generateFile')
const app = express();
const mongoose = require("mongoose")
const cors = require('cors');
const {executeCpp} = require("./executeCpp");
const {executePy} = require("./executePy");

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());
const {addJobToQueue} = require('./jobQueue');
const Job = require("./Job");

mongoose.connect('mongodb://0.0.0.0/compilerapp')
  .then(() => {
    console.log('Connected to MongoDB');
    // Your code after successful connection
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


app.get('/status', async (req, res) => {
    const jobId = req.query.id;
    console.log("status requested", jobId);
    if(jobId === undefined){
        return res.status(400).json({success: false, error: "missing id param"})
    }
    try {
        const job = await Job.findById(jobId);

        if(job === undefined){
            return res.status(404).json({success: false, error: "invalid job ID"});
        }
        return res.status(200).json({success: true, job});

    } catch (err) {
        return res.status(400).json({success: false, error: JSON.stringify(err)});
    }
    
});

app.post("/run", async(req, res) => {
    

    const {language, code} = req.body;

    if(code === undefined) {
        return res.status(400).json({success: false, error: "Empty code body"});
    }

    let job;

    try {
    let output;

    const filepath = await generateFile(language, code);
    job = await new Job({language, filepath}).save();
    const jobId = job._id;
    addJobToQueue(jobId);
    console.log(job);

    res.status(201).json({success: true, jobId});
    }catch (err){
        return res.status(500).json({success: false, err: JSON.stringify(err)});
    }

})
  
app.listen(5000, () => {
    console.log('Server started on port 5000');
});