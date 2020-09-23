import crypto from "crypto";
import {Editor, getEditorByEmail, insertEditor} from "../database/editors";

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

export const createEditor = async (email: string, password: string): Promise<void> => {
    const salt = createSalt();
    const hashedValue = getHashedPassword(password, salt);
    await insertEditor({
        email: email,
        salt: salt,
        hashedPassword: hashedValue
    });
};


export const matchHash = async (email: string, password: string): Promise<Editor | false> => {
    const adminResult = await getEditorByEmail(email);
    if (!adminResult) {
        return false;
    }

    const hashedValue = getHashedPassword(password, adminResult.salt);
    if (hashedValue == adminResult.hashed_password) {
        return adminResult;
    } else {
        return false;
    }
};
