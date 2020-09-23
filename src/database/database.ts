import knex from "knex";
import { Editor } from "../models/databaseModels";

interface NewEditor {
    email: string;
    salt: string;
    hashedPassword: string;
}

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        await db.raw("SELECT 1 AS db_is_up");
        return true;
    } catch {
        return false;
    }
};

export const insertEditor = async (editor: NewEditor): Promise<void> => {
    await db
        .insert({
            email: editor.email,
            salt: editor.salt,
            hashed_password: editor.hashedPassword
        })
        .into<Editor>('admin');

};

export const getAdminByEmail = (email: string): Promise<Editor | undefined> => {
    return db('admin')
        .select()
        .from<Editor>("admin")
        .where("email", email)
        .first();
};
