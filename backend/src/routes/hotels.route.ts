import express from 'express';
import hotel from '../controllers/hotel.controller';
import { param } from 'express-validator';
import verifyToken from '../middleware/auth';
const router = express.Router();
router.get('/search', hotel.AddSortingFilteringAndPaginationLogic);
router.get('/', hotel.fetchAllMyHotels);
router.get('/:id',[
    param("id").notEmpty().withMessage("Hotel ID  is required")
], hotel.hotelDetailPage)
router.post('/:hotelId/bookings/payment-intent', verifyToken, hotel.stripePayments)
router.post('/:hotelId/bookings', verifyToken, hotel.hotelBooking);
export default router;

