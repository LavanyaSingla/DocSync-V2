import express from 'express';
import authController from '../controllers/authController.js'
import checkIsUserAuthenticated from '../middleware/authMiddleware.js';
import docController from '../controllers/docController.js';

const router = express.Router();
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/resetPassword', authController.resetPassword)
router.post('/reset/:id/:token', authController.resetPasswordEmail)




//protected routes
router.post("/changePassword", checkIsUserAuthenticated, authController.changePassword)
router.post("/createDocument", checkIsUserAuthenticated, docController.createDocument);
router.post("/fetchDocuments", checkIsUserAuthenticated, docController.fetchDocuments);
router.post("/document/:id", checkIsUserAuthenticated, docController.fetchDocumentById);
router.post("/renameDoc/document/:id", checkIsUserAuthenticated, docController.renameDoc);
router.post("/share/document/:id", checkIsUserAuthenticated, docController.shareDoc);



export default router;

