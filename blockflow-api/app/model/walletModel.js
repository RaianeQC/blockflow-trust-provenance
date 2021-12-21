const mongoose =require('../database/connection');


const WalletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },    
    network: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Network',
        required: true

    },
    directory : {
        type: String
       
    },
    keyPublic: {
        type: String
        
    },
    keyPrivate : {
        type: String
       
    }, 
    createdAt :{
        type: Date,
        default : Date.now
    }
})

const wallet = mongoose.model('Wallet', WalletSchema);

module.exports = wallet;