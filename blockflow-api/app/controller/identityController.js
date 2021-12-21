const Wallet = require('../model/walletModel');

const helper = require('../blockchain-controller/helper');

var path = require('path');
const fs = require('fs');

const Peer = require('../model/peerModel')
const Network = require('../model/networkModel')

var hfc = require('fabric-client');
const shell = require('shelljs')

module.exports = {


    async create (req, res) {

        const peerid = req.params.peerid;

        let peer =  await Peer.findById(peerid).populate('user').populate('organization')
        const orgName = peer.organization.organizationName;

        const username = peer.user.username;
        
        let networksPeer = await Peer.findById(peerid).populate('network').populate('organization');

        let pathNetworks = networksPeer.network.dirnetwork;

        console.log("Estou aqui"+pathNetworks)

        shell.cd(pathNetworks);

        console.log(pathNetworks);

        hfc.setConfigSetting('network-connection-profile-path',path.join( pathNetworks ,'/network-config.yaml'));
        hfc.setConfigSetting(orgName+'-connection-profile-path',path.join( pathNetworks, '/'+orgName+'.yaml'));


        helper.getRegisteredUser(username, orgName, true);

        let response= logger.debug('-- returned from registering the username %s for organization %s',username,orgName);
        if (response && typeof response !== 'string') {
            logger.debug('Successfully registered the username %s for organization %s ',username,orgName);
            //response.token = token;
            res.json(response);
        } else {
            logger.debug('Failed to register the username %s for organization %s with::%s',username,orgName,response);
            res.json({success: false, message: response});
        }
        



    },

    async create2 (req, res){

        const own = req.userId
        const username = req.username 
        const organization = req.organization 

        const walletPath = path.join(process.cwd(), 'wallet');


        /*if(!Wallet.findOne({ own })){

            console.log("hello");

            if(!fs.existsSync(walletPath+"/"+own)){
                    
                console.log(own+""+walletPath);

               fs.mkdirSync(walletPath+"/"+own);

               const directory =  walletPath+"/"+own;

                await Wallet.create({ 
                    own, 
                    directory
                });*/

                const directory =  walletPath+"/"+own;

                let response = await helper.getRegisteredUser(username, organization, true, own, directory )


                    
                    
                    logger.debug('-- returned from registering the username %s for organization %s',username,orgName);
                    if (response && typeof response !== 'string') {
                        logger.debug('Successfully registered the username %s for organization %s ',username,orgName);
                        //response.token = token;
                        res.json(response);
                    } else {
                        logger.debug('Failed to register the username %s for organization %s with::%s',username,orgName,response);
                        res.json({success: false, message: response});
                    }

                //}
        //}
      
        res.send({user: walletPath});
        

    },

    async exist (req, res){

         console.log("Exist");

         const own = req.userId;

         console.log(own);

         const wallet = Wallet.findOne({own});

         console.log(wallet.own);

         return  res.send("Paixao");
         
    }

}