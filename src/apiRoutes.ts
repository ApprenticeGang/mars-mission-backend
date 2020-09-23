import express, { response } from 'express';
import "dotenv/config";
import {getRoverImages} from "./services/nasaService";
import {getArticles} from "./database/database"
import { request } from 'http';


const router = express.Router()


router.get("/rovers/:name/images", async (request, response) => {
    const roverName = request.params.name;
    const images = await getRoverImages(roverName);
    response.json(images);
});


router.get("/articles", async(request, response) => {
    const sqlResult = await getArticles();
    response.json(sqlResult);
});


export {router};