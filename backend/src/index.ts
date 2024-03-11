import express, {Application,Request,Response,NextFunction} from 'express';
import cors from 'cors';
import 'dotenv/config';
const app:Application = express(); 
const PORT:number = parseInt(process.env.PORT ?? '8000') || 8000;
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.get('/', (req:Request, res:Response, next:NextFunction) => {
    res.send("API is working...");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
})