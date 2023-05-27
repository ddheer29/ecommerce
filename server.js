import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from 'cors';

// config env
dotenv.config();

//db config
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// REST APIs
app.get('/', (req, res)=>{
    res.send('<h1>Welcome to Ecommerce MERN app</h1>');
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white);
})