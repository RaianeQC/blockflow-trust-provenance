const mongoose = require('../database/connection')

const QualifiedGenerationSchema = new mongoose.Schema({ 

    idQualifiedGeneration: {
        type: String
    },
    
    programExecution: {
        type: String
    },

    generationId: {
        type: String 
    },

    entityValue: {
        type: String 
    }
      
})

const qualifiedGeneration = mongoose.model('QualifiedGeneration', QualifiedGenerationSchema);

module.exports = qualifiedGeneration;