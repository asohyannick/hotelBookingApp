import express, {Request, Response} from 'express';
import Hotel from '../models/hotel.model';
import { HotelType } from '../shared/types';
const fetchBookings = async(req:Request, res:Response) => {
    try {

     const hotels = await Hotel.find({
        bookings: {$elemMatch: {userId: req.userId}}
     });

     const results = hotels.map((hotel) => {
        const userBookings = hotel.bookings.filter(
            (booking) => booking.userId === req.userId
        ) 
        const hotelWithUserBookings: HotelType = {
            ...hotel.toObject(),
            bookings: userBookings,
        };
        return hotelWithUserBookings;
     })
     res.status(200).send(results);
    } catch(error) {
        console.log(error);
        res.status(500).json("Unable to fetch bookings")
    }
}

export default {
    fetchBookings
}