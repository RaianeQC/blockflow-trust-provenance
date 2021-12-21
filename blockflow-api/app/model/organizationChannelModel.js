const mongoose = require("../database/connection")

const OrganizationChannelSchema = new mongoose.Schema({
    organizationName: {
            type: String,
            required: true
    }, 
    
    channel: {type : mongoose.Schema.Types.ObjectId, ref : 'Channel'},

    createdAt : {
        type: Date,
        default: Date.now
    }

})

const organizationchannel = mongoose.model('OrganizationChannel', OrganizationChannelSchema);

module.exports = organizationchannel;