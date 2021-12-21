const express = require('express');

const router = express.Router();

const IdentityController = require('../controller/identityController')

/*const middleware = require('../middleware');

router.use(middleware)*/

router.post('/createIdentity/:peerid', IdentityController.create);

router.get('/findIdentity', IdentityController.exist);


module.exports = (app) => app.use('/api/identity', router);