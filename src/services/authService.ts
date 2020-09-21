import crypto from "crypto";
import { insertEditor, getAdminByEmail } from "../database/database";
import { Editor } from "../models/databaseModels";

const lengthOfSalt = 10;


export const getHashedPassword = (password: string, salt: string): string => {
    const valueToHash = password + salt;
    return crypto
        .createHash('sha256')
        .update(valueToHash)
        .digest('base64');
};

const createSalt = (): string => {
    return crypto.randomBytes(lengthOfSalt).toString('base64');
};

export const createEditor = (email: string, password: string): Promise<void> => {
    const salt = createSalt();
    const hashedValue = getHashedPassword(password, salt);
    return insertEditor({
        email: email,
        salt: salt,
        hashedPassword: hashedValue
    });
};


export const matchHash = async (email: string, password: string): Promise<Editor | boolean> => {
    const adminResult = await getAdminByEmail(email);
    if (!adminResult) {
        return false;
    }

    const hashedValue = getHashedPassword(password, adminResult.salt);
    console.log(hashedValue, adminResult.hashed_password);
    if (hashedValue == adminResult.hashed_password) {
        return adminResult;
    } else {
        return false;
    }
};
