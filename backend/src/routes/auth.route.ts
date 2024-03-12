import express from "express";
import { check } from "express-validator";
import auth from "../controllers/auth.controller";
import verifyToken from "../middleware/auth";
const router = express.Router();
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  auth.login
);
router.get("/validate-token", verifyToken, auth.verifyUser);
router.post('/logout', auth.logout);
export default router;
