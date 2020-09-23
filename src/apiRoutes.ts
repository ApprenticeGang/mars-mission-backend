import express from 'express';
import "dotenv/config";
import {getRoverImages} from "./services/nasaService";


const router = express.Router()


router.get("/rovers/:name/images", async (request, response) => {
    const roverName = request.params.name;
    const images = await getRoverImages(roverName);
    response.json(images);
});


export {router};