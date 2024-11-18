import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './api/routes/userRoutes';
import ticketRoute from './api/routes/ticketRoutes';
require('dotenv').config();
const app = express();


app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));


app.use(cookieParser());


app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next(); 
});
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tickets',ticketRoute) 
app.use((req, res, next) => {
    console.log("Reached end of middleware chain");
    res.status(404).send("Not Found");
});

export default app;
