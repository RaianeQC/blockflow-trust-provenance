const express = require('express')
const router = express.Router();

const SmartContractController = require('../controller/smartContractController')

/*const middleware = require('../middleware');

router.use(middleware)*/

router.post('/install/:peerid', SmartContractController.install);

router.post('/instantiate/:peerid', SmartContractController.instantiate);




module.exports = (app) => app.use('/api/smartcontract', router);


