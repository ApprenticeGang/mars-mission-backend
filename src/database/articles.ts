import {db} from "./database";

export interface Article {
    id: number;
    image_url: string | null;
    title: string;
    summary: string | null;
    article_url: string;
    publish_date: string | null;
}

export interface NewArticle {
    imageUrl: string;
    title: string;
    summary: string;
    articleUrl: string;
    publishDate: string;
}


export const getArticles = (): Promise<Article[]> => {
    return db
        .select("*")
        .from<Article>('news');
};

export const insertArticle = async (newArticle: NewArticle): Promise<void> => {
    await db()
        .insert({
            image_url: newArticle.imageUrl,
            title: newArticle.title,
            summary: newArticle.summary,
            article_url: newArticle.articleUrl,
            publish_date: newArticle.publishDate
        })
        .into<Article>('news');
};

