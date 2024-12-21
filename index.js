import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import { app } from './firebase.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Controllers
const userController = require('./controllers/userController');
const classController = require('./controllers/classController')

// Routes and Shenanigans
app.get("/api/classes", classController.getClasses);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});