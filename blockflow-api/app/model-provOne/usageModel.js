const mongoose = require('../database/connection')

const UsageSchema = new mongoose.Schema({ 

    hadInputPort: {
        type: String
    },
    
    hadEntity: {
        type: String
    },

    idUsage: {
        type: String 
    }
      
})

const usage = mongoose.model('Usage', UsageSchema);

module.exports = usage;