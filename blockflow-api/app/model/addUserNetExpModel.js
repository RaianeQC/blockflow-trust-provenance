const mongoose = require('../database/connection')

const AddUserNetExperimentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NetworkChannelExperiments',
        require: true,
    }
})

const addUserNetExperiment = mongoose.model('AddUserNetExperiment', AddUserNetExperimentSchema);

module.exports = addUserNetExperiment;

