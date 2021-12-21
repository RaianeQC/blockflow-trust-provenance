const mongoose = require('../database/connection')

const ProgramSchema = new mongoose.Schema({ 
    nameProgram: {
        type: String
    },
    created: {
        type: String 
    },
    hasOutPort: {
        type: String

    },
    hasInPort: {
        type: String
    }

    
})

const program = mongoose.model('Program', ProgramSchema);

module.exports = program;