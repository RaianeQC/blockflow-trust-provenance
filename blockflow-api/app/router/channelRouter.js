const express = require('express')

const ChannelController = require('../controller/channelController')

const router = express.Router();

//const middleware = require('../middleware');

//router.use(middleware)

router.post('/createchannel', ChannelController.create)


router.post('/joinnetworkchannel', ChannelController.joinnetworkchannel)




module.exports = (app) => app.use('/api/channel', router);