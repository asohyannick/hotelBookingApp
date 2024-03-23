import express, {Request, Response} from 'express';
import verifyToken from '../middleware/auth';
import my_booking from '../controllers/my_booking.controller';
const router = express.Router();
router.get('/', verifyToken, my_booking.fetchBookings);
export default router;