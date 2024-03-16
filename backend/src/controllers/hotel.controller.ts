import express, { Request, Response } from "express";
import multer from "multer";
import Hotel from "../models/hotel.model";
import { HotelType, HotelSearchResponse, BookingType } from "../shared/types";
import cloudinary from "cloudinary";
import { validationResult } from "express-validator";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const createHotels = async (req: Request, res: Response) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  upload.array("imageFiles", 6)(req, res, async (error: any) => {
    if (error) {
      console.log("Error uploading images: ", error);
      return res.status(500).json({ message: "Something went wrong" });
    }

    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).send(hotel);
    } catch (error) {
      console.log("Error creating hotel: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
};

const getSingleHotel = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

const editMyHotel = async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

const updateMyHotel = async (req: Request, res: Response) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
  upload.array("imageFiles");
  try {
    const updatedHotel: HotelType = req.body;
    updatedHotel.lastUpdated = new Date();

    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: req.params.hotelId,
        userId: req.userId,
      },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json("Hotel not found");
    }

    const files = req.files as Express.Multer.File[];
    const updatedImageUrls = await uploadImages(files);
    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const AddSortingFilteringAndPaginationLogic = async (
  req: Request,
  res: Response
) => {
  try {
    const query = constructSearchQuery(req.query);
    let sortOptions = {};
    switch (req.query.sortOptions) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightASC":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const total = await Hotel.countDocuments();
    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json("Something went wrong");
  }
};

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

const hotelDetailPage = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (error: any) {
    res.status(500).json("Error fetching hotel");
    console.log(error.message);
  }
};

const stripePayments = async (req: Request, res: Response) => {
  //1. totalCost
  //2. hotelId
  //3. userId
  const { numberOfNights } = req.body;
  const hotelId = req.params.hotelId;
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return res.status(400).json("Hotel not found");
  }
  const totalCost = hotel.pricePerNight * numberOfNights;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost * 100,
    currency: "gbp",
    metadata: {
      hotelId: req.userId,
    },
  });
  if (!paymentIntent.client_secret) {
    return res.status(500).json("Error creating payment intent");
  }
  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  };
  res.send(response);
};

const hotelBooking = async (req: Request, res: Response) => {
  try {
    const paymentIntentId = req.body.paymentIntentId;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    );
    if (!paymentIntent) {
      return res.status(400).json("payment intent not found");
    }
    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      return res.status(400).json("Payment intent mismatch");
    }
    if (paymentIntent.status !== "succeeded") {
      return res
        .status(400)
        .json(`Payment intent not succeeded. Status: ${paymentIntent.status}`);
    }
    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,
    };
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId },
      {
        $push: { bookings: newBooking },
      }
    );
    if (!hotel) {
      return res.status(400).json("Hotel not found");
    }
    await hotel.save();
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64; // Fixed missing comma
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

const fetchAllMyHotels = async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort("-lastUpdatd");
    res.json(hotels);
  } catch (error) {
    console.log("errors", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};
export default {
  createHotels,
  getSingleHotel,
  editMyHotel,
  updateMyHotel,
  AddSortingFilteringAndPaginationLogic,
  hotelDetailPage,
  stripePayments,
  hotelBooking,
  fetchAllMyHotels,
};
