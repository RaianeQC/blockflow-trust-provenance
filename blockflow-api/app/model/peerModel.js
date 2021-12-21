const mongoose = require('../database/connection')

const PeerSchema = new mongoose.Schema({
    peername: {
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    joinNetwork: {
        type : Boolean,
        default: false
        
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

const peer = mongoose.model('Peer', PeerSchema);

module.exports = peer;