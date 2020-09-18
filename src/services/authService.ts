import crypto from "crypto";
import {insertEditor} from "../database/database";

const lengthOfSalt = 10;

const getHashedPassword = (password: string, salt: string): string => {
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
