import { Router } from "express";
import  {loginUser, logoutUser, registerUser}  from "../controllers/userContoller"; 
import userDetails from "../controllers/userDetails";
import ticketDetails from "../controllers/ticketDetails";
const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/userDetails').get(userDetails)
router.route('/ticketDetails').get(ticketDetails)
export default router;
