import "dotenv/config";
import express from 'express';
import { checkNasaApi } from './nasa/nasaApi';
import { checkDatabaseConnection } from "./database/database";
import nunjucks from "nunjucks";

const app = express();
const port = process.env.PORT || 3000;

app.get('', async (request, response) => {
    response.json({
        "API": "OK",
        "nasaAPI": await checkNasaApi() ? "OK" : "ERROR",
        "database": await checkDatabaseConnection() ? "OK" : "ERROR",
    });
});

//Nunjucks
const PATH_TO_TEMPLATES = "./templates";
nunjucks.configure(PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
});


app.get("/home", (request, response) => {
    const model = {
        message: "Admin Site"
    }
    response.render('index.html', model);
});


//Listen on Port 
app.listen(port, () => { console.log(`Server running on ${port}`) });
