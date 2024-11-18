import { Router } from "express";
import bookTicket from "../controllers/seatBook";
import CheckLogin from "../middlewares/CheckLogin";
import theaterGenerations from "../controllers/theaterGeneration";
import blockTheSeat from "../controllers/seatBlock";
import makeSeatAvailable from "../controllers/makeSeatAvailable";
import seatData from "../controllers/seatData";

const routes = Router()
// routes.route('/book-ticket').post(CheckLogin,bookTicket)
routes.route('/book-ticket').post(bookTicket)
routes.route('/generate-theater').post(theaterGenerations)
routes.route('/seatsData').post(seatData);
routes.route('/block-the-seat').post(blockTheSeat)
routes.route('/make-seat-available').post(makeSeatAvailable)

export default routes