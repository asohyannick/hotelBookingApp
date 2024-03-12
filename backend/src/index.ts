import express, {Application,Request,Response,NextFunction} from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
// import connectedDB from '../config/db.config';
import mongoose from 'mongoose';
// routes
import userRoutes from '../src/routes/users.route';
import authRoutes from '../src/routes/auth.route';
mongoose.connect(process.env.MONGODB_URI_CONNNECTIONSTRING as string);
const app:Application = express(); 
const PORT:number = parseInt(process.env.PORT ?? '8000') || 8000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials: true,
}));
// routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (req:Request, res:Response, next:NextFunction) => {
    res.send("API is working...");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
})