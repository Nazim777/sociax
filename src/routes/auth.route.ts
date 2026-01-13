import express from 'express'
import { emailChecker,validationReq,AuthMiddleware } from '../middleware'
import { AuthValidation } from '../utils/validation'
import { AuthController } from '../controller'

const router = express.Router();


const authController = new AuthController()


/**
 * ---login user---
 */

router.post('/login',validationReq(AuthValidation.loginUser),authController.login)

/**
 * ---register user----
 */

router.post('/register',emailChecker,validationReq(AuthValidation.registerUser),authController.register)


/**
 * ---renew access token
 */
router.post('/refresh_token', authController.renewToken);

/**
 * ---- Forgot Password ----
 */
router.get('/forgot_password', authController.forgotPassword);

/**
 * ---- Logout User ----
 */
router.get('/logout', AuthMiddleware.verifyUser, authController.logout);

export default router;
