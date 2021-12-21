const mongoose = require('../database/connection')

const OrdererSchema = new mongoose.Schema({
    orderername: {
        type: String
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

const orderer = mongoose.model('Orderer', OrdererSchema);

module.exports = orderer;