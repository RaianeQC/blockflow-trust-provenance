const mongoose = require('../database/connection')

const QualifiedUsageSchema = new mongoose.Schema({ 

    programExecution: {
        type: String
    },
    
    idProgramExecution: {
        type: String
    },

    usageId: {
        type: String 
    },

    idQualifiedUsage: {
        type: String 
    },

    entityValue: {
        type: String 
    }
      
})

const qualifiedUsageSchema = mongoose.model('QualifiedUsage', QualifiedUsageSchema);

module.exports = qualifiedUsage;