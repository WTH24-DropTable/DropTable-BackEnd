import firebase from '../firebase.js';
import { collection, getDocs, getDoc, Timestamp } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

// For every classId, returns the number of present and not-present users
const getAttendanceByClass = async (req, res) => {

}

// For a specific userId, returns the classes that the user attended, and the classes that the user missed
const getClassesAttended = async (req, res) => {

}

// For a specific classId, mark a User Present / Late
const markAttendance = async (req, res) => {

}

// For a specific userId, returns all the classes that the user has to attend
const getUserClasses = async (req, res) => {

}

export default {
    getAttendanceByClass,
    getClassesAttended,
    markAttendance,
    getUserClasses
}