import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import courseroute from './routes/course.route.js';
import userroute from './routes/user.route.js';
import adminroute from './routes/admin.route.js';
import orderroute from './routes/order.route.js';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 3000;
const dburl = process.env.mongo_url;

const app = express();

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));
app.use(cors({
  origin: process.env.frontend_url,
  credentials: true,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB first
mongoose.connect(dburl)
  .then(() => {
    console.log("Connected to MongoDB");

    // Routes (defined only after DB is ready)
    app.use("/api/v1/courses", courseroute);
    app.use("/api/v1/user", userroute);
    app.use("/api/v1/admin", adminroute);
    app.use("/api/v1/conferm", orderroute);

    // Default route
    app.get('/', (req, res) => {
      res.send('Backend is running!');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
