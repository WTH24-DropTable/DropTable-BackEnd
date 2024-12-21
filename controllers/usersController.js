import firebase from '../firebase.js';
import { collection, getDocs, getDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import uploadImage from '../utils/uploadImage.js';
import dotenv from 'dotenv';
dotenv.config();

// get student users for class (by class id)
async function getStudents(req, res) {
    try {
        const { classId } = req.params;

        if (!className) {
            return res.status(404).json({ message: 'please enter a class'});
        }

        const docRef = doc(firebase.db, "class", classId);
        const docSnap = await getDoc(docRef);

        // console.log("snapshot class:\n\n ", docSnap.data());
        if (!docSnap) {
            return res.status(404).json({ message: 'class does not exist'});
        }

        // --- get all and return only students from the class --- //

        const q = query(collection(firebase.db, "users"), 
        where(classId, "in", "classes"),
        where("role", "==", "student"));
        const querySnapshot = await getDocs(q);

        let students = [];
        querySnapshot.forEach((doc) => {
            // console.log(doc);
            students.push(doc.data());
        });

        if (classes.length == 0) {
            return res.status(404).json({ message: 'student classes does not exist'});
        }

        return res.status(201).json({ message: 'classes returned for student successfully!', students: students });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

// get user by id
async function getStudent(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ message: 'please enter an id'});
        }

        const docRef = doc(firebase.db, "users", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap) {
            return res.status(404).json({ message: 'student does not exist'});
        }
        const student = docSnap.data()
        return res.status(200).json({ message: 'student returned successfully!', student: student });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

async function uploadUserImage(req, res) {
    try {
        const userImage = req.file;
        const userId = req.body.userId;

        if (userId === undefined) {
            throw {
                status: 400,
                message: "Missing required fields"
            }
        }

        const imageUrl = await uploadImage(userImage, "profilepic", userId);
        
        const userRef = doc(firebase.db, "users", userId);
        const updatedUser = await updateDoc(userRef, {
            "profilePic": imageUrl,
            "isNew": false,
        });

        return res.status(200).json({
            status: "success",
            updatedUser: updatedUser,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

async function getProfilePictures(req, res) {
    try {
        const q = query(collection(firebase.db, "users"), where("profilePic", "!=", null));
        const querySnapshot = await getDocs(q);

        let links = [];
        querySnapshot.forEach((doc) => {
            const studentData = doc.data();
            if (studentData.profilePic) {
                links.push({ name: studentData.name, imagePath: studentData.profilePic });
            }
        });

        if (links.length === 0) {
            return res.status(404).json({ message: 'No profile pictures found' });
        }

        return res.status(200).json({ message: 'Profile pictures returned successfully!', links: links });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

async function updatePassword(req, res) {
    try {

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export default {
    getStudents,
    getStudent,
    uploadUserImage,
    getProfilePictures,
    updatePassword
}