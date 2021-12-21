const mongoose = require('../database/connection')

const ProgramExecutionSchema = new mongoose.Schema({ 
   
    startTime: {
        type: String
    },
    endTime: {
        type: String 
    },
    programName: {
        type: String

    }
   
    
})

const programExecution = mongoose.model('ProgramExecution', ProgramExecutionSchema);

module.exports = programExecution;