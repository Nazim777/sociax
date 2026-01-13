import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


// cors config
const corsConfig:cors.CorsOptions = {
    credentials:true,
    origin:'http://localhost:3000', // replce with actual frontend rul
}


const middleware:any = [
    morgan('dev'),
    cors(corsConfig),
    bodyParser.json(),
    cookieParser()
]


export default middleware;