const mongoose = require('../database/connection');

const OrganizationSchema = new mongoose.Schema({
    organizationName: {
            type: String,
            required: true
    },
    numPeer:{
        type: String,
        required: true
    }, 
    peer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Peer',
        required: true
    }],
    network: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Network',
        required: true

    },
    createdAt :{
        type: Date,
        default : Date.now
    }
})

const organization = mongoose.model('Organization', OrganizationSchema);

module.exports = organization;