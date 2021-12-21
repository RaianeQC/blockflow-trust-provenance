const mongoose = require("../database/connection")

const ChannelSchema = new mongoose.Schema({
    channelName : {
            type: String,
            required: true
    },
    channelConfigPath: {
        type: String,
    },
    network: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Network',
        required: true

    },
    organizations: [{type : mongoose.Schema.Types.ObjectId, ref : 'OrganizationChannel'}],
    createdAt : {
            type: Date,
            default: Date.now
    }
    
})

const channel = mongoose.model('Channel', ChannelSchema);

module.exports =  channel;