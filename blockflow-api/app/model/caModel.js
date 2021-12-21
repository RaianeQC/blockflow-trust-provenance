const mongoose = require('../database/connection')

const CASchema = new mongoose.Schema({
    caname: {
        type: String
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    network: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Network',
        required: true

    },

    ipPublic : {
        type: String
    }, 

    ipPrivate :{
        type: String

    },

    publicDNS : {
        type: String
    },

    keyPrivate : {
        type: String
    },

    composeFileName :{
        type: String
    },

    configured: {
        type: Boolean
    },

    running: {
        type: Boolean
    }
})

const ca = mongoose.model('CA', CASchema);

module.exports = ca;