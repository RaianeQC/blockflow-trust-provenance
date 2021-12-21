
const Peer = require('../model/peerModel')
const Network = require('../model/networkModel')

module.exports = {

    async listjoinnetwork(req, res){

        const idUser = '5f1617bbfa952a21598667d2'; 

        let networksPeer = await Peer.find().where('user').equals(idUser).where('joinNetwork').equals('false').populate('network');
        
        return res.send(networksPeer);


    },

    async detailsjoinnetwork(req, res){

        const peerid = req.params.peerid;

        console.log(peerid);

        let networksPeer = await Peer.findById(peerid).populate('network').populate('organization');

        let network = await Network.findById(networksPeer.network._id).populate('channels');       
        
        return res.send({networksPeer, network});

    },

    async joininnetwork(req, res){

        const peerid = req.params.peerid;

        let peer =  await Peer.findOneAndUpdate({_id : peerid }, {joinNetwork : true },{useFindAndModify: false});

        let networksPeer = await Peer.findById(peerid);

        let idNetwork = networksPeer.network._id;

        let network =  await Network.findById(idNetwork);

        let networkType = network.type;

        return res.send({ idNetwork , networkType });


    }

   

}