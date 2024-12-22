import firebase from '../firebase.js';
import { collection, getDocs, query, where, doc, getDoc, setDoc, writeBatch} from 'firebase/firestore';
import { parse } from 'csv';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import generateOccurrences from '../utils/generateOccurances.js';

// Get classes
async function getClasses(req, res) {
    try {
        const querySnapshot = await getDocs(collection(firebase.db, "class"));
        let classes = [];
        querySnapshot.forEach((doc) => {
            console.log(doc);
            classes.push(doc.data());
        });

          return res.status(201).json({ message: 'classes returned successfully!', classes: classes });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}


async function getClassById(req, res) {
    try {
        const { id } = req.params 
        if (!id) {
            return res.status(400).json({ message: 'class id required'});
        }

        const docRef = doc(firebase.db, "class", id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap) {
            return res.status(404).json({ message: 'class does not exist'});
        }

        return res.status(200).json({ message: 'class returned successfully!', class: docSnap.data() });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

// Get Classes by student id
async function getStudentClasses(req, res) {
    try {
        // ---- checks if student exists ----//
        const { id } = req.params 
        if (!id) {
            return res.status(400).json({ message: 'student id required'});
        }

        const docRef = doc(firebase.db, "users", id);
        const docSnap = await getDoc(docRef);

        // console.log("snapshot student:\n\n ", docSnap.data());
        
        if (!docSnap) {
            return res.status(404).json({ message: 'student does not exist'});
        }
       

        const querySnapshot = await getDoc(collection(firebase.db, "class"));
        querySnapshot.forEach((doc) => {
            console.log(doc);
            classes.push(doc.data());
        });

        if (classes.length == 0) {
            return res.status(404).json({ message: 'student classes does not exist'});
        }


          return res.status(201).json({ message: 'classes returned successfully!', classes: classes });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

const parseCSV = (path) => {
    return new Promise((resolve, reject) => {
      const results = {};
      
      fs.createReadStream(path)
        .pipe(parse())
        .on('data', (row) => {
          results[row[0]] = row[1];
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
};

const createClass = async (req, res) => {
    try {
        const studentList = req.file;
        const name = req.body.name;
        const className = req.body.className;
        const startDateTime = req.body.startDateTime;
        const duration = req.body.duration;
        const occurance = req.body.occurance;
        const lessonCount = req.body.lessonCount;
        const lecturerId = req.body.lecturerId;

        if (!studentList || !className || !name || !startDateTime || !duration || !occurance || !lessonCount || !lecturerId) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }

        const newClass = {
            id: uuidv4(),
            name: name,
            className: className,
            startDateTime: startDateTime,
            duration: duration,
            occurance: occurance,
            lessonCount: lessonCount,
        }

        // Create the class in the database
        const classRef = doc(firebase.db, "class", newClass.id);
        await setDoc(classRef, newClass);

        // Parse the CSV
        const results = await parseCSV(studentList.path);
        fs.unlinkSync(studentList.path);
        // Loop through all the students in the class, and add the class to their profile
        Object.keys(results).forEach(async (studentId) => {
            const studentRef = doc(firebase.db, "users", studentId);
            const studentDoc = await getDoc(studentRef);
            const studentData = studentDoc.data();
            studentData.classes.push(newClass.id);
            await setDoc(studentRef, studentData);
        });

        // Add to the Lecturer Class List too
        const lecturerRef = doc(firebase.db, "users", lecturerId);
        const lecturerDoc = await getDoc(lecturerRef);
        const lecturerData = lecturerDoc.data();
        lecturerData.classes.push(newClass.id);
        await setDoc(lecturerRef, lecturerData);

        // Batch Create Attendance Records
        const batchWrite = writeBatch(firebase.db);
        if (occurance !== "oneTime") {
            const classOccurances = generateOccurrences(Number(startDateTime), occurance, lessonCount);
            classOccurances.forEach((classOccurance) => {
                const newAttendance = {
                    "dateTime": Number(classOccurance),
                    "classId": newClass.id,
                    "attendees": [],
                    "expectedAttendees": Object.keys(results).length
                }

                const newAttendanceRef = doc(firebase.db, "attendance", `${newClass.id}-${classOccurance}`);
                batchWrite.set(newAttendanceRef, newAttendance);
            })
        }

        await batchWrite.commit();

        newClass["studentList"] = results;
        return res.status(200).json({
            status: "success",
            message: "Class created successfully",
            classData: newClass
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

const getLecturerClasses = async (req, res) => {
    try {
        const { id } = req.params 
        
        const lecturerRef = doc(firebase.db, "users", id);
        const lecturerDoc = await getDoc(lecturerRef);
        const lecturerData = lecturerDoc.data();
        const classIds = lecturerData.classes;

        const lecturerClasses = [];
        for (let i = 0; i < classIds.length; i++) {
            const classId = classIds[i];
            const classRef = doc(firebase.db, "class", classId);
            const classDoc = await getDoc(classRef);
            lecturerClasses.push(classDoc.data());
        }

        return res.status(200).json({
            status: "success",
            classes: lecturerClasses
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

const getClassOccurrences = async (req, res) => {
    try {
        const { id } = req.params 
        
        const attendanceCol = collection(firebase.db, "attendance");
        const getAttendanceWithClassId = query(attendanceCol, where("classId", "==", id));
        const querySnapshot = await getDocs(getAttendanceWithClassId);

        let occurances = [];
        querySnapshot.forEach((doc) => {
            occurances.push(doc.data());
        });

        return res.status(200).json({
            status: "success",
            occurrences: occurances
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

const getClassAttendance = async (req, res) => {
    try {
        const { id, timeslot } = req.params;
        
        const attendanceCol = collection(firebase.db, "attendance");
        const getAttendanceWithClassId = query(attendanceCol, where("classId", "==", id), where("dateTime", "==", Number(timeslot)));
        const querySnapshot = await getDocs(getAttendanceWithClassId);

        let attendance = [];
        querySnapshot.forEach((doc) => {
            attendance = doc.data();
        });

        return res.status(200).json({
            status: "success",
            attendance: attendance
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

const getStudentsInClass = async (req, res) => {
    try {
        const { id } = req.params 
        
        const userCol = collection(firebase.db, "users");
        const getStudentsInClass = query(userCol, where("classes", "array-contains", id), where("role", "==", "student"));
        const querySnapshot = await getDocs(getStudentsInClass);

        let students = [];
        querySnapshot.forEach((doc) => {
            students.push(doc.data());
        });

        return res.status(200).json({
            status: "success",
            students: students
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

export default { 
    getClasses,
    createClass,
    getStudentClasses,
    getClassById,
    getLecturerClasses,
    getClassOccurrences,
    getStudentsInClass,
    getClassAttendance,
}
