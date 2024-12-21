import { app } from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();


let serviceAccount = require("./wth24-droptable-firebase-adminsdk.json");

app.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export default app;