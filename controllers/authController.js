import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import firebase from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';

const authLoginUser = async (req, res) => {
    try {
        const { studentId, password } = req.body;

        if (!studentId || !password) {
            return res.status(400).json({
                status: 'Error',
                message: "studentId and Password are required in the request body.",
            });
        }

        const userRef = doc(firebase.db, "users", studentId);
        const user = (await getDoc(userRef)).data();

        // Check if the User Exists
        if (!user) {
            return res.status(404).json({
                status: 'Error',
                message: `User with studentId "${studentId}" not found.`
            });
        }

        // Check if the User's Password is correct
        const checkPasswordMatch = await bcrypt.compare(password, user.password);
        if (!checkPasswordMatch) {
            return res.status(403).json({
                status: 'Error',
                message: "Incorrect Password",
            });
        }

        // Generate JWT Token
        const token = await jwt.sign(
            {
                id: user.id,
                name: user.name,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: 7200 * 1000
            }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 7200 * 1000
        });

        res.status(200).json({
            status: "Success",
            message: "Login Successful",
            studentId: user.id,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
}

const authLogoutUser = async (req, res) => {
    try {
        res.clearCookie('jwt'); // Clear the HttpOnly cookie
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
            error: err
        });
    }
} 

export default {
    authLoginUser,
    authLogoutUser
}