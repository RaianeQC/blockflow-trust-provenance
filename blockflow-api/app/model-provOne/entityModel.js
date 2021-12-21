const mongoose = require('../database/connection')

const EntitySchema = new mongoose.Schema({ 

    idEntity: {
        type: String
    },
    
    typeEntity: {
        type: String
    },
    valueEntity: {
        type: String 
    }
      
})

const entity = mongoose.model('Entity', EntitySchema);

module.exports = entity;