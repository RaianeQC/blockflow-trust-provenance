const installSmartContract = require('../blockchain-controller/install-chaincode')
const instantiateSmartContract = require('../blockchain-controller/instantiate-chaincode')
const Peer = require('../model/peerModel')
const Network = require('../model/networkModel')
const shell = require('shelljs')
const hfc = require('fabric-client');
const path = require('path');


module.exports = {
    async install(req, res){       

        const channelName = "mychannel";
        const peer = ["peer0.UFJF.com"];
        const userName = 'raiane'; 
        const orgName = 'UFJF'; 
        const chaincodeName =  "blockflow-chaincode";        
     
        const chaincodeVersion = "v0.6";
        const chaincodeType = "golang";
        const peerid = req.params.peerid;

        let networksPeer = await Peer.findById(peerid).populate('network').populate('organization');

        let pathNetworks = networksPeer.network.dirnetwork;

      
        const chaincodePath = 'github.com/chaincode';   

        
        console.log(chaincodeName);

        //const chaincodePathNetworks = pathNetworks;

        

        shell.cd(pathNetworks);

       

        hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
        hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

        


        let reponse = await installSmartContract.installChaincode(peer, chaincodeName, chaincodePath, pathNetworks, chaincodeVersion, chaincodeType, userName, orgName);
        
        //res.send(reponse);
    
    },

    async instantiate(req, res){
        const channelName = "mychannel";
        const peer = ["peer0.UFJF.com"];
        const userName = 'raiane'; 
        const orgName = 'UFJF';  
        const chaincodeName =  "blockflow-chaincode";        
        const chaincodeVersion = "v0.6";
        const chaincodeType = "golang";
        let args;
        let fcn;

        const peerid = req.params.peerid;

        let networksPeer = await Peer.findById(peerid).populate('network').populate('organization');

        let pathNetworks = networksPeer.network.dirnetwork;

        shell.cd(pathNetworks);

        console.log(pathNetworks);

        hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
        hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));

        console.log(userName, orgName );

        console.log(userName, orgName );

        let message = await instantiateSmartContract.instantiateChaincode(peer, channelName, chaincodeName, chaincodeVersion, chaincodeType, fcn, args, userName, orgName);
        
        res.send(message);
       
        
    
    }

}