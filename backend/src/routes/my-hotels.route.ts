import express from "express";
import hotel from "../controllers/hotel.controller";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
const router = express.Router();
// api/my-hotels
router.post(
  "/createHotels",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name field is required"),
    body("city").notEmpty().withMessage("City field is required"),
    body("country").notEmpty().withMessage("Country field is required"),
    body("description").notEmpty().withMessage("Description field is required"),
    body("type").notEmpty().withMessage("Hotel type field is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night field is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities field is required"),
  ],
  hotel.createHotels
);
router.get('/getHotels', verifyToken, hotel.getSingleHotel);

router.get('/:id', verifyToken, hotel.editMyHotel);
router.put('/:hotelId', verifyToken,
hotel.updateMyHotel)

export default router;
