import firebase from '../firebase.js';
import { collection, getDocs, getDoc, setDoc, doc } from 'firebase/firestore';
import { parse } from 'csv';
import fs from 'fs';

// Get classes
const getClasses = async (req, res) => {
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

// Get Class by name
const getClass = async (req, res) => {
    try {
        const { name } = req.params 
        if (!name) {
            return res.status(400).json({ message: 'class name required'});
        }

        const querySnapshot = await getDoc(collection(firebase.db, "class"));
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
        const className = req.body.className;
        const startDateTime = req.body.startDateTime;
        const duration = req.body.duration;
        const occurance = req.body.occurance;

        if (!studentList || !className || !startDateTime || !duration || !occurance) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }

        const newClass = {
            id: uuidv4(),
            className: className,
            startDateTime: startDateTime,
            duration: duration,
            occurance: occurance,
        }

        // Create the class in the database
        const classRef = doc(firebase.db, "class", newClass.id);
        await setDoc(classRef, newClass);

        // Parse the CSV
        const results = await parseCSV(studentList.path);
        fs.unlinkSync(studentList.path);

        // Loop through all the students in the class, and add the class to their profile
        Object.keys(results).forEach(async (studentId) => {
            const studentRef = doc(firebase.db, "students", studentId);
            const studentDoc = await getDoc(studentRef);
            const studentData = studentDoc.data();
            studentData.classes.push(newClass.id);
            await setDoc(studentRef, studentData);
        });

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

export default { 
    getClasses,
    createClass
}