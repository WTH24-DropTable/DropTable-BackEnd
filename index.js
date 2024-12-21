import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { app } from './firebase.js';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use(express.json());

// Controllers
const userController = require('./controllers/userController');
const classController = require('./controllers/classController')

// Routes
import medicalCertificatesRoutes from './routes/medicalcertificates.routes.js';

// API Routes
app.use('/api/medicalcertificate', medicalCertificatesRoutes);

app.listen(8080, () => {
    console.log("Server is running on port 8080: http://localhost:8080/api");
})