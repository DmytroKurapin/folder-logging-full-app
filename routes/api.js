const express = require('express');
const router = express.Router();

router.post('/login', function (req, res) {
    require('../controllers/authController').login(req, res);
});
router.post('/logout', function (req, res) {
    require('../controllers/authController').logout(req, res);
});
router.post('/start', function (req, res) {
    require('../controllers/monitoringController').start(req, res);
});
router.get('/status/:name', function (req, res) {
    require('../controllers/monitoringController').status(req, res);
});
router.post('/stop', function (req, res) {
    require('../controllers/monitoringController').stop(req, res);
});

module.exports = router;