import dotenv from 'dotenv'
dotenv.config();
import express , {Request,Response, NextFunction} from 'express'
import { notFoundMiddleware,errorHandlerMiddleware,multerErrorHandler } from './error';
import {Server as SocketIOServer} from 'socket.io'
import http from 'http'
import middleware from './middleware';
const app = express();
const server = http.createServer(app);
import routes from './routes'

// apply generate middleware
app.use(middleware)

// Initialize Socket.IO and attach to 'req'
const io = new SocketIOServer(server,{
    cors:{
        origin:"*",
        methods:["GET","POST",'PUT','PATCH','DELETE']
    }
});

// Middleware to attach 'io' before routes execute

app.use((req:Request,_res:Response,next:NextFunction)=>{
    (req as any).io = io;
    next()
})


// load routes after attaching io
app.use(routes);

// Error handling middleware
app.use(notFoundMiddleware);
app.use(multerErrorHandler);
app.use(errorHandlerMiddleware)

export {server,io}