const mongoose = require("../database/connection")

const NetworkSchema = new mongoose.Schema({
    networkname: {
            type: String,
            required: true
    }, 
    description: {
        type: String,
        required: true
    },
    
    dirnetwork: {
        type: String,
        required: true
    },

    type : {
        type: String
    },

    organizations: [{type : mongoose.Schema.Types.ObjectId, ref : 'Organization'}],

    channels: {type : mongoose.Schema.Types.ObjectId, ref : 'Channel'},

    createdAt :{
        type: Date,
        default : Date.now
    }

})

const network = mongoose.model('Network', NetworkSchema);

module.exports = network;