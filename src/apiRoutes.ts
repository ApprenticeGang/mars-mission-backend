import express  from 'express';
import "dotenv/config";
import {getRoverImages} from "./services/nasaService";
import {getArticles} from "./database/articles";


const router = express.Router()

router.get("/rovers/:name/images", async (request, response) => {
    const roverName = request.params.name;
    const images = await getRoverImages(roverName);
    response.json(images);
});

router.get("/articles", async(request, response) => {
    const dbArticles = await getArticles();
    response.json(dbArticles.map(dbArticle => {
        return {
            id: dbArticle.id,
            imageUrl: dbArticle.image_url,
            title: dbArticle.title,
            summary: dbArticle.summary,
            articleUrl: dbArticle.article_url,
            publishDate: dbArticle.publish_date,
        }
    }));
});

export {router};