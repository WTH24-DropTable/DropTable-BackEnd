import firebase from '../firebase.js';
import { collection, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

//Get Attendance
const getAttendance = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(firebase.db, "attendance"));
        let attendance = [];
        querySnapshot.forEach((doc) => {
            console.log(doc);
            attendance.push(doc.data());
        });

          return res.status(201).json({ message: 'attendance returned successfully!', attendance: attendance });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

//Create Attendance
const createAttendance = async (req, res) => {
    try {
        const { studentID, classID, status } = req.body;
        const docRef = await addDoc(collection(firebase.db, "attendance"), {
            studentID: studentID,
            classID: classID,
            timestamp: new Date().getTime(),
            status: status
        });
        return res.status(201).json({ message: 'attendance created successfully!', attendanceID: docRef.id });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

export default {
    getAttendance,
    createAttendance
}