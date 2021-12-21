const mongoose = require('../database/connection')

const WasAssociatonWithSchema = new mongoose.Schema({ 
   
    agent: {
        type: String
    },
    
    idAgent: {
        type: String
    },
    programExecution: {
        type: String 
    },
    idProgramExecution: {
        type: String

    },
    idWasAssocietedWith: {
        type: String

    }
   
    
})

const wasAssociatonWith = mongoose.model('WasAssociatonWith', WasAssociatonWithSchema);

module.exports = wasAssociatonWith;