import firebase from '../firebase.js';
import {arrayUnion,doc,addDoc, collection,getFirestore, updateDoc,getDocs, getDoc, Timestamp,query,where} from 'firebase/firestore';
import dotenv from 'dotenv';
dotenv.config();

// For every classId, returns the number of present and not-present users
const getAttendanceByClass = async (req, res) => {
    try {
      console.log(req.params)
      const  id  = req.params.classId
      console.log(id)
        if (!id) {
             return res.status(400).json({ message: 'classId required'});
         }
        let querySnapshop= await getDocs(query(collection(firebase.db,'users'),where('classes', 'array-contains', id)))
        let userIds=[]
        querySnapshop.forEach((doc)=>{
          userIds.push(doc.id)
          })
        console.log(userIds)

        querySnapshop= await getDocs(query(collection(firebase.db,'attendance'),where('classId', '==', id)))
        let atttendanceRate=[]
        querySnapshop.forEach((doc)=>{
            let attended=[]
            let forgotten=[]
            let attendees=doc.data().attendees
            console.log(attendees)
            userIds.forEach((user)=>{
              if (attendees.some(e=>e.userId===user)){
                attended.push(user)
              }else{
                forgotten.push(user)
              }
            })
            let cur={
              occuranceId:doc.id,
              "attended":attended,
              "forgotten":forgotten
            }
            atttendanceRate.push(cur)
          })
          
        
        

        return res.status(201).json({ atttendanceRate});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });    
    }
}

// For a specific userId, returns the classes that the user attended, and the classes that the user missed
const getClassesAttended = async (req, res) => {

}

// For a specific classId, mark a User Present / Late
const markAttendance = async (req, res) => {
    let userId=req.body.userId
    let classId=req.body.occuranceId
    let stat=req.body.stat
    if (!stat ||!userId ||!classId){
      res.status(400).json({message:'occuranceId and stat and userId required'})
    }
    let newEntry={
      "userId":userId,
      "status":stat
    }

//    let attendanceRef= await getDocs(query(collection(firebase.db,'attendance'),where('classId', '==', classId)))
//    let attendanceId;
//    attendanceRef.forEach((doc)=>{
//     attendanceId=doc.id })
//    if (!attendanceId){
//      res.status(400).json({message:'please input valid classId'})
//    }
    let arrUnion=await updateDoc(doc(firebase.db,'attendance',classId),{
      attendees:arrayUnion(newEntry)
    })
    res.status(200).json({message:arrUnion})

}

// creates the base attendance objects to store the users
const createAttendance = async (req, res) =>{
  try{
    let dateTime=req.body.dateTime
    let classId=req.body.classId
    if (!dateTime||!classId){
      res.status(400).json({message:'dateTime and classId required'})
    }
    const userRef = collection(firebase.db, "attendance");
    const newAttendance={
      "dateTime": dateTime,
      "classId":classId,
      "attendees":[]

    }
    const docRef = await addDoc(userRef, newAttendance)
    return res.status(200).json({"insertedId": docRef.id})

  }
  catch (err) {
          console.log(err);
          return res.status(500).json({ error: err.message });
      }

}

// For a specific userId, returns all the classes that the user has to attend
const getUserClasses = async (req, res) => {

}

// For a specific lecturer, return all the classes that the lecturer teaches
const getLecturerClasses = async (req, res) => {

}

export default {
    getAttendanceByClass,
    getClassesAttended,
    markAttendance,
    getUserClasses,
    getLecturerClasses,
    createAttendance
}
