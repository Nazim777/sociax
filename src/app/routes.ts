import {Router,Request,Response,NextFunction} from 'express'
import { authRoutes } from '../routes';
import { AuthMiddleware } from '../middleware';
const router:Router = Router();



/**
 * Routes for API version 01
 */
router.use('/api/v1/auth',authRoutes)

/**
 * ----- Health check for the application here ----
 * checking health of application at very first time...
 */
router.get('/health',(_req:Request,_res:Response,_next:NextFunction)=>{
    _res.status(200).json({
        message:'Successfull',
        data:{
            message:"Server up and running..."
        }
    })
})

/**
 * ---- Resource not found endpoint----
 * Not found of resource
 */
router.use((_req:Request,_res:Response,_next:NextFunction)=>{
    _res.status(400).send("Resource not found!")
})

export default router;