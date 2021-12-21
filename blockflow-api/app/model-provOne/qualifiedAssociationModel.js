const mongoose = require('../database/connection')

const QualifiedAssociationSchema = new mongoose.Schema({ 
    agent: {
        type: String
    },
    hadPlan: {
        type: String 
    },
    idProgramExecution: {
        type: String

    },
    programExecutionName: {
        type: String

    },
    idAssociation: {
        type: String

    }
   
    
})

const qualifiedAssociation = mongoose.model('QualifiedAssociation', QualifiedAssociationSchema);

module.exports = qualifiedAssociation;