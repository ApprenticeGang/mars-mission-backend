import crypto from "crypto";
import { StringLiteral } from "typescript";
import { db, addAdmin} from "./database/database";
import { response, request } from "express";


export interface Admin{
    email: string;
    salt: string;
    hashed_password: string;
}

export const passwordFunction = (password: string , salt: string) => {
    const valueToHash = password + salt;
    return crypto
    .createHash('sha256')
    .update(password)
    .digest('base64')
};

//I want this function to get the email and passwords and send it to the database after making it hashed up.
export const addNewAdmin = (email: string, password: string) => {
    const lengthOfSalt = 10;
    const salt = crypto.randomBytes(lengthOfSalt).toString('base64');
    const hashedValue = passwordFunction(password, salt)
    return addAdmin({email:email, salt:salt, hashed_password:hashedValue})
        
};











//NOT FINISHED YET 

// export const tryLoginAdmin = async(email: string, password: string): Promise<Admin | null> => {
//     const admin = await getAdminByEmail(email);
//     ​console.log(admin, email, password)
//     if (!admin) {
//         return null;
//     }
//     if (passwordsMatch(admin.salt, password, admin.hash)) {
//         return admin;
//     }
//     return null;
// }
// const passwordsMatch = (salt: string, password: string, hashedValue: string): Boolean => {
//     const hashedAttempt = passwordFunction(password, salt);
//     return hashedAttempt === hashedValue;
// }