const db = admin.firestore();
import { collection, getDocs } from "firebase/firestore";

class Class {
    constructor(id, name, startDateTime, duration, occurance) {
        this.id = id;
        this.name = name;
        this.startDateTime = startDateTime;
        this.duration = duration;
        this.occurance = occurance;
    }
}

// bladdy bla bla convert json into usable data
const classConverter = {
    toFirestore: (classes) => {
        return {
            id: classes.id,
            name: classes.name,
            startDateTime: classes.startDateTime,
            duration: classes.duration,
            occurance: classes.occurance
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Class(data.id, data.name, data.startDateTime, data.duration, data.occurance);
    }
};

// Get classes
const getClasses = async (req, res) => {
    try {
          const querySnapshot = await getDocs(collection(db, "class"));
            querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            });

          return res.status(201).json({ message: 'classes returned successfully!', classes: querySnapshot });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getClasses
}