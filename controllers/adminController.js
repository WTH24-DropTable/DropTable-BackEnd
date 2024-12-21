import firebase from '../firebase.js';
import { collection, getDocs, doc, writeBatch, query, where } from 'firebase/firestore';
import { parse } from 'csv';
import fs from 'fs';

const parseCSV = (path) => {
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(path)
        .pipe(parse())
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
};

const createUsersFromMasterSheet = async (req, res) => {
    try {
        const masterStudentList = req.file;

        // Parse the CSV
        const parsedData = await parseCSV(masterStudentList.path);
        console.log(parsedData)
        fs.unlinkSync(masterStudentList.path);

        // Check if any of the users already exist
        const userRef = collection(firebase.db, "users");
        const userIdsToCheck = parsedData.map((row) => row[0]);
        const checkIdsExistQuery = query(userRef, where("id", "in", userIdsToCheck));
        
        const querySnapshot = await getDocs(checkIdsExistQuery);
        const existingUsers = querySnapshot.docs.map((doc) => doc.data().id);
        
        // Create the users that do not exist
        const createdUsers = [];
        const batchWrite = writeBatch(firebase.db);
        parsedData.forEach((user) => {
            if (!existingUsers.includes(user[0])) {
                const userDocRef = doc(userRef, user[0]);
                const newUser = {
                    id: user[0],
                    name: user[1],
                    course: user[2],
                    email: user[3],
                    password: user[0],
                    classes: []
                };
                batchWrite.set(userDocRef, newUser);
                createdUsers.push(newUser);
            }
        });

        await batchWrite.commit();

        return res.status(200).json({
            status: "success",
            createdUsers: createdUsers,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

export default {
    createUsersFromMasterSheet
}