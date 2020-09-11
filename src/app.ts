import "dotenv/config";
import express from 'express';
import {checkNasaApi} from './nasa/nasaApi';

const app = express();
const port = process.env.PORT || 3000;

app.get('', async(request, response) => {
    response.json({
        "API": "ok",
        "nasaAPI": await checkNasaApi()? "ok": "error"


    });
});

app.listen(port, () => { console.log(`server is running on port ${port}`) });