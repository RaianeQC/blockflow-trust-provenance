const mongoose = require('../database/connection')

const GenerationSchema = new mongoose.Schema({ 

    idGeneration: {
        type: String
    },
    
    hadOutputPort: {
        type: String
    },

    hadEntity: {
        type: String 
    }
      
})

const generation = mongoose.model('Generation', GenerationSchema);

module.exports = generation;