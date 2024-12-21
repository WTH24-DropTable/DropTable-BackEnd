import firebase from '../firebase.js';
import { collection, getDocs, getDoc } from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();


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

export default { 
    getClasses
}

