const mongoose = require('../database/connection')


const NetworkExperimentsJoinSchema = new mongoose.Schema({
    peer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Peer',
    }

});


const networkexperimentsjoin = mongoose.model('NetworkExperimentsJoin', NetworkExperimentsJoinSchema);

module.exports = networkexperimentsjoin;