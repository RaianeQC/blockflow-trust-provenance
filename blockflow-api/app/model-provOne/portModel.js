const mongoose = require('../database/connection')

const PortSchema = new mongoose.Schema({ 

    idPort: {
        type: String
    },
    
    portType: {
        type: String
    },

    portValue: {
        type: String 
    }
      
})

const port = mongoose.model('Port', PortSchema);

module.exports = port;