import "dotenv/config";
import express from 'express';
import {checkNasaApi} from './nasa/nasaApi';
import { checkDatabaseConnection } from "./database/database";

const app = express();

app.get('', async(request, response) => {
    response.json({
        "API": "OK",
        "nasaAPI": await checkNasaApi()? "OK": "ERROR",
        "database": await checkDatabaseConnection()? "OK": "ERROR",
    });
});

export { app };