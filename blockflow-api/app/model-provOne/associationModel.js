const mongoose = require('../database/connection')

const AssociationSchema = new mongoose.Schema({ 
   
    hadPlanName: {
        type: String
    },
    hadPlanId: {
        type: String 
    },
    userAgentId: {
        type: String

    },
    userAgent: {
        type: String
    }

    
})

const association = mongoose.model('Association', AssociationSchema);

module.exports = association;