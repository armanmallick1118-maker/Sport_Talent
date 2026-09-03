const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const controller = require('../controllers/scoutController');

router.get('/', verifyToken, controller.getScouts);
router.get('/me', verifyToken, controller.getMyProfile);
router.put('/me', verifyToken, controller.updateMyProfile);
router.post('/me/credential', verifyToken, upload.single('credential'), controller.uploadCredential);
router.get('/admin/verification-queue', verifyToken, controller.getVerificationQueue);
router.patch('/:id/verification', verifyToken, controller.updateVerification);
router.post('/:id/evaluation-requests', verifyToken, controller.requestEvaluation);
router.get('/:id', verifyToken, controller.getScoutById);

module.exports = router;
