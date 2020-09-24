import {db} from "./database";

export interface Editor {
    id: number;
    email: string;
    salt: string;
    hashed_password: string;
}

interface NewEditor {
    email: string;
    salt: string;
    hashedPassword: string;
}

export const getEditors = async (): Promise<Editor[]> => {
    return db
        .select("*")
        .from<Editor>("admin");
};

export const deleteEditorById = async (id: number): Promise<void> => {
    await db
        .delete()
        .from<Editor>("admin")
        .where("id", id);
};

export const getEditorByEmail = (email: string): Promise<Editor | undefined> => {
    return db('admin')
        .select()
        .from<Editor>("admin")
        .where("email", email)
        .first();
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