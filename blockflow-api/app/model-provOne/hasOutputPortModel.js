const mongoose = require('../database/connection')

const HasOuputPortSchema = new mongoose.Schema({ 

    hasOutputPortId: {
        type: String
    },
    
    portId: {
        type: String
    },
    
    programID: {
        type: String 
    },
    
    programName: {
        type: String 
    },
    
    inputPortValue: {
        type: String 
    }

    
      
})

const hasOuputPort = mongoose.model('HasOuputPort', HasOuputPortSchema);

module.exports = hasOuputPort;