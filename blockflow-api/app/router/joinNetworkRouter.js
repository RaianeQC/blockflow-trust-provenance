const express = require('express')

const JoinNetworkController = require('../controller/joinNetworkController')

const router = express.Router();


router.get('/listjoinnetwork', JoinNetworkController.listjoinnetwork)

router.get('/detailsjoinnetwork/:peerid', JoinNetworkController.detailsjoinnetwork)

router.post('/detailsjoinnetwork/:peerid', JoinNetworkController.detailsjoinnetwork)

router.post('/joininnetwork/:peerid', JoinNetworkController.joininnetwork)




module.exports = (app) => app.use('/api/joinnetwork', router);