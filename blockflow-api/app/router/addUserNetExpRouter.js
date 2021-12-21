const express = require('express');

const router = express.Router();

const middleware = require('../middleware');

router.use(middleware)

module.exports = (app) => app.use('/api/addUserExperiment', router);