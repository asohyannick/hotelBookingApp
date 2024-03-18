import express, {Application,Request,Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import {v2 as cloudinary} from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});
// routes
import userRoutes from './routes/users.route';
import authRoutes from './routes/auth.route';
import hotelRoutes from './routes/my-hotels.route';
import fetchAllHotelsRoutes from './routes/hotels.route';
import bookingRoutes from './routes/my-booking';
mongoose.connect(process.env.MONGODB_URI_CONNNECTIONSTRING as string).then(() => {
    console.log('Connected to database:', process.env.MONGODB_URI_CONNNECTIONSTRING as string)
});
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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/my-hotels', hotelRoutes);
app.use('/api/hotels', fetchAllHotelsRoutes);
app.use('/api/my-bookings', bookingRoutes)
app.get("*", (eq:Request, res:Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
app.get('/', (req:Request, res:Response) => {
    res.send("API is working...");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
})