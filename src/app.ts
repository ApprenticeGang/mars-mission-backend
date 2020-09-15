import "dotenv/config";
import express from 'express';
import {checkNasaApi, GetRoverImages} from './nasa/nasaApi';
import fetch from "node-fetch";
import { checkDatabaseConnection } from "./database/database";

const app = express();
const port = process.env.PORT || 3000;

const NASA_API_KEY =  process.env.NASA_API_KEY;

app.get('', async(request, response) => {
    response.json({
        "API": "OK",
        "nasaAPI": await checkNasaApi()? "OK": "ERROR",
        "database": await checkDatabaseConnection()? "OK": "ERROR",
    });
});

app.get("/api/rovers/:name/images", async (request, response) => {
    const roverName = request.params.name;
    const images = await GetRoverImages(roverName);
    response.json(images);
})

app.listen(port, () => { console.log(`server is running on port ${port}`) });

