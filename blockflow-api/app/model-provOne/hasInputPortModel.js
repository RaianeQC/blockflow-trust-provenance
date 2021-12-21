const mongoose = require('../database/connection')

const HasInputPortSchema = new mongoose.Schema({ 

    hasInputPortId: {
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

const HasInputPort = mongoose.model('HasInputPort', HasInputPortSchema);

module.exports = hasInputPort;