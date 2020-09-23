import express  from 'express';
import "dotenv/config";
import {getRoverImages} from "./services/nasaService";
import {getArticles} from "./database/articles";
import {getTimelineForRover} from "./database/timeline";
import {RoverName} from "./models/requestModels";


const router = express.Router()

router.get("/rovers/:name/images", async (request, response) => {
    const roverName = request.params.name;
    const images = await getRoverImages(roverName);
    response.json(images);
});

router.get("/rovers/:name/timeline", async (request, response) => {
    const roverName = request.params.name as RoverName;
    const timeline = await getTimelineForRover(roverName);
    response.json(timeline.map(timelineItem => {
        return {
            id: timelineItem.id,
            roverName: timelineItem.rover_name,
            imageUrl: timelineItem.image_url,
            heading: timelineItem.heading,
            body: timelineItem.timeline_entry,
            date: timelineItem.date,
        }
    }));
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