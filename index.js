import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import { app } from './firebase.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());
