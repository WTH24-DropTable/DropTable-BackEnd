import firebase from '../firebase.js';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();


// Get classes
async function getClasses(req, res) {
    try {
        const querySnapshot = await getDocs(collection(firebase.db, "class"));
        let classes = [];
        querySnapshot.forEach((doc) => {
            // console.log(doc);
            classes.push(doc.data());
        });

          return res.status(201).json({ message: 'classes returned successfully!', classes: classes });
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
       

        // --- get all classes and return only student classes --- //
        const classSnapshot = await getDocs(collection(firebase.db, "classes"))
        let classes = [];
        classSnapshot.forEach((doc) => {
            // console.log(doc);
            if (doc.data().id in docSnap.data().classes) {
                classes.push(doc.data());
            }
        });

        if (classes.length == 0) {
            return res.status(404).json({ message: 'student classes does not exist'});
        }


          return res.status(201).json({ message: 'classes returned for student successfully!', classes: classes });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

export default { 
    getClasses,
    getStudentClasses
}

