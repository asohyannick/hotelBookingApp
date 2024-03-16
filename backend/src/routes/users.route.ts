import express from 'express';
import user from '../controllers/user.controller';
import { check } from 'express-validator';
import verifyToken from '../middleware/auth';
const router = express.Router();
// api/users/register
router.post('/register',[
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Eamil is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
        min:6,
    }),
], user.signup);
router.get('/me', verifyToken, user.fetchOneUser)
export default router;