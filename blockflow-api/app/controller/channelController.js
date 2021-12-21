
const createChannel = require('../blockchain-controller/create-channel.js');
const joinChannel = require('../blockchain-controller/join-channel');
const hfc = require('fabric-client');
const path = require('path');
const shell = require('shelljs')


module.exports = {
    async create(req, res){

        const orgName = 'UFJF';

        const username = 'raiane';

        const pathNetworks = req.query.dir;

        const channelConfigPath = req.query.channelConfigPath;

        const channelName = req.query.channelName;

        shell.cd(pathNetworks);
        
        hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
        hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
       
        createChannel.createChannel(channelName.toLowerCase(), pathNetworks+channelConfigPath, orgName)
  

    },

    async joinnetworkchannel(req, res){

        const pathNetworks= req.query.dirnetwork;
        const channelName = req.query.channelName;
        const peer = req.query.peerName;

        const orgName = 'UFJF';

        const username = 'raiane';

        shell.cd(pathNetworks);
        
        hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
        
        hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));
       
        joinChannel.joinChannel(channelName.toLowerCase(), peer, username, orgName);

    }


}
