import knex from "knex";
import {Editor} from "../models/databaseModels";

interface NewEditor {
    email: string;
    salt: string;
    hashedPassword: string;
}

interface NewArticle {
    imageUrl: string;
    title: string;
    summary: string;
    articleUrl: string;
    publishDate: string;
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


export interface Articles{
    id: number; 
    image_url: string;
    title: string; 
    summary: string;
    article_url: string;
    publish_date: string;

}

export const getArticles=(): Promise<Articles[]> => {
    return db.select("*").from<Articles>('news');
};
export const addNewsArticle = async (newArticle: NewArticle): Promise<void> => {
    return db('news')
        .insert({
            image_url: newArticle.imageUrl,
            title: newArticle.title,
            summary: newArticle.summary,
            article_url: newArticle.articleUrl,
            publish_date: newArticle.publishDate
        });
};
