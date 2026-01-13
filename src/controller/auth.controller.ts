import { Request,Response,NextFunction } from "express";
import { AuthService } from "../services";
import requestIp from 'request-ip'

class AuthController {
    private readonly authService:AuthService;

    constructor(authService:AuthService = new AuthService){
        this.authService = authService;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} _next
     */

    // region register controller
    public register = async(req:Request,res:Response, _next:NextFunction)=>{
        try {
            const userrRegister = await this.authService.register(req.body);
            if(!userrRegister.success) res.status(400).json(userrRegister);
            res.status(200).json(userrRegister)
            
        } catch (error) {
            _next(error)
            
        }

    }


    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} _next
     */

    public login = async(req:Request,res:Response,_next:NextFunction)=>{
        const reqBody = req.body;
        const ipAddress = requestIp.getClientIp(req) || req.ip;
        const userAgent = req.headers['user-agent'];
        try {
            const authLogin = await this.authService.loginUser({
                email:reqBody.email,
                password:reqBody.password,
                ipAddress:ipAddress || 'unknown',
                userAgent:userAgent || 'unknown'
            })

            if(!authLogin.success) return res.status(400).json(authLogin);
            res.status(200).json(authLogin)
        } catch (error) {
            _next(error)
        }
    }


    /**
     * ---- Refresh Token Controller ----
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public renewToken = async (req: Request, res: Response | any, next: NextFunction) => {
        // const refreshToken = req.headers['x-refresh-token'];
        const refreshToken = req.body.refreshToken;

        try {
            const authRenewToken = await this.authService.refreshAccessToken(refreshToken);
            if (!authRenewToken.success) return res.status(400).json(authRenewToken);
            res.status(200).json(authRenewToken);

        } catch (error) {
            next(error);
        }
    }

    /**
     * ---- Forgot Password Controller ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public async forgotPassword(_req: Request, res: Response) {
        res.status(200).send('Route for forgot password!');
    }

    /**
     * ---- User Logout ----
     * @param {Request} req 
     * @param {Response} res 
     */
    public logout = async (req: Request | any, res: Response | any, next: NextFunction) => {
        try {
            const requestUser = (req as any).user;
            const logoutUser = await this.authService.logout(requestUser.refreshToken);
            if (!logoutUser.success) return res.status(400).json({ success: false, msg: 'Can not logout!' });

            res.status(200).json({
                isAuth: false,
                success: true,
                msg: 'Logged-Out, session deleted!'
            });

        } catch (error) {
            next(error);
        }
    }

}


export default AuthController;