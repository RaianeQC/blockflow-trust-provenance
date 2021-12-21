const path = require('path');

const express = require('express');

const router = express.Router();

const multer = require('multer');

const Peer = require('../model/peerModel');
const Network = require('../model/networkModel')
const CA = require('../model/caModel');
const Orderer = require('../model/ordererModel');



var storage =  multer.diskStorage({ 
    destination: async function (req, file, cb) {

        console.log(req.body.ordererId2);
        
        if(req.body.peerId2 !== undefined){
            const peer = await Peer.findById(req.body.peerId2);
            const network = await Network.findById(peer.network._id);
            cb(null, network.dirnetwork+"/"+peer.peername);

        }else if(req.body.ordererId2 !== undefined){
            const orderer = await Orderer.findById(req.body.ordererId2);
            const network = await Network.findById(orderer.network._id);
            cb(null, network.dirnetwork+"/"+orderer.orderername)

        }else if(req.body.caId2 !== undefined){
            const ca = await CA.findById(req.body.caId2);
            const network = await Network.findById(ca.network._id);
            cb(null, network.dirnetwork+"/"+ca.caname);
        }
         
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});


const upload = multer({ storage })


const CreateNetworkController = require('../controller/createNetworkController')


const CreateNetworkAWSController = require('../controller/createNetworkAWSController')


router.post('/create', CreateNetworkController.createAndSaveNetwork);

router.post('/createawscloud', CreateNetworkAWSController.createAndSaveNetwork);


router.get('/details/:id', CreateNetworkController.getDetails)

router.post('/startnetwork', CreateNetworkController.startNetwork)

router.post('/stopnetwork', CreateNetworkController.stopNetwork)

router.get('/listPeerForAddNetwork/:id', CreateNetworkController.listPeerForAddNetwork)

router.get('/listPeerUserNetwork/:org', CreateNetworkController.listPeerUserNetwork)

router.get('/addPeerUserNetwork', CreateNetworkController.addPeerUserNetwork);

router.get('/listCANetwork/:id', CreateNetworkAWSController.listCAsNetworks);

router.get('/listOrdererNetwork/:id', CreateNetworkAWSController.listOrdererNetwork);



router.post('/ippublic', CreateNetworkAWSController.saveIPpublic);


router.post('/ipprivate', CreateNetworkAWSController.saveIPprivate);

router.post('/publicdns', CreateNetworkAWSController.savePublicDNS);

router.post('/uploadFileKeyCertificate', upload.single('customFile'), CreateNetworkAWSController.uploadFileKeyCerticate);


router.post('/ippublicca', CreateNetworkAWSController.saveIPpublicCA);

router.post('/ipprivateca', CreateNetworkAWSController.saveIPprivateCA);

router.post('/publicdnsca', CreateNetworkAWSController.savePublicDNSCA);

router.post('/uploadFileKeyCertificateCA', upload.single('customFile'), CreateNetworkAWSController.uploadFileKeyCerticateCA);


router.post('/ippublicorderer', CreateNetworkAWSController.saveIPpublicOrderer);

router.post('/ipprivateorderer', CreateNetworkAWSController.saveIPprivateOrderer);

router.post('/publicdnsorderer', CreateNetworkAWSController.savePublicDNSOrderer);

router.post('/uploadFileKeyCertificateOrderer', upload.single('customFile'), CreateNetworkAWSController.uploadFileKeyCerticateOrderer);


router.post('/chekedpeer', CreateNetworkAWSController.ckeckedPeer);

router.post('/chekedca', CreateNetworkAWSController.ckeckedCA);

router.post('/chekedorderer', CreateNetworkAWSController.ckeckedOrderer);


router.post('/createdconfignetwork/:id',CreateNetworkAWSController.createdconfignetwork); 


router.post('/upPeer/:id', CreateNetworkAWSController.upPeer);

router.post('/commandCloud/:id', CreateNetworkAWSController.commandCloud);

router.post('/upOrderer/:id', CreateNetworkAWSController.upOrderer);

router.post('/commandCloudOrderer/:id', CreateNetworkAWSController.commandCloudOrderer);

router.post('/upCA/:id', CreateNetworkAWSController.upCA);

router.post('/commandCloudCA/:id', CreateNetworkAWSController.commandCloudCA);


module.exports = (app) => app.use('/api/network', router);