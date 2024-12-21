import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
app.use(express.json());

// Routes
import authRoutes from './routes/auth.routes.js';
import medicalCertificatesRoutes from './routes/medicalcertificates.routes.js';
import classRoutes from './routes/class.routes.js';
import adminRoutes from './routes/admin.routes.js';
import attendanceRoutes from './routes/attend.routes.js';

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/medicalcertificate', medicalCertificatesRoutes);
app.use('/api/class', classRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);

app.listen(8080, () => {
    console.log("Server is running on port 8080: http://localhost:8080/api");
})