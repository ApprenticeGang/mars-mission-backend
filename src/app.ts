import "dotenv/config";
import express from 'express';
import {checkNasaApi, getRoverImages} from './nasa/nasaApi';
import { checkDatabaseConnection } from "./database/database";
import nunjucks from "nunjucks";

const app = express();
const NASA_API_KEY =  process.env.NASA_API_KEY;

//Nunjucks
const PATH_TO_TEMPLATES = "./templates";
nunjucks.configure(PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
});

app.get('', async(request, response) => {
    response.json({
        "API": "OK",
        "nasaAPI": await checkNasaApi() ? "OK" : "ERROR",
        "database": await checkDatabaseConnection() ? "OK" : "ERROR",
    });
});


app.get("/api/rovers/:name/images", async (request, response) => {
    const roverName = request.params.name;
    const images = await getRoverImages(roverName);
    response.json(images);
})

app.get("/home", (request, response) => {
    const model = {
        message: "Admin Site"
    }
    response.render('index.html', model);
});

export { app };