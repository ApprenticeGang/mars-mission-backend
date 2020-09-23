import "dotenv/config";
import express, { response } from 'express';
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import { request } from "http";

import { addNewsArticle } from "./database/database";
import { addTimelineEvent } from "./database/database";

const router = express.Router()


router.get("/sign-in", (request, response) => {
    response.render('adminSignIn.html');
});

router.get("/editors/new", (request, response) => {
    response.render('adminEditor.html');
});

router.post("/editors/new", async (request, response) => {
    const { email, password } = request.body as NewEditorRequest;

    if (!email || email === "") {
        return response.status(400).send("Please enter a valid email");
    }
    if (!password || password === "") {
        return response.status(400).send("Please enter a valid password");
    }
    await createEditor(email, password);
    return response.send("okay");
});

router.get("/rovers", async (request, response) => {
    response.render('rovers.html');
});

router.get("/rovers/:name", async (request, response) => {
    const name = request.params.name
    response.render('editRovers.html');
});

router.get("/articles/new", (request, response) => {
    response.render('adminAddNews.html');
});


router.post("/articles/new", async (request, response) => {
    const newArticle = request.body;
    const result = await addNewsArticle(newArticle);
    response.render('adminAddNews.html')
});

router.get("/rovers/timeline/new", (request, response) => {
    response.render('adminAddTimeline.html');
});
router.post("/rovers/timeline/new", async (request, response) => {
    const newTimeline = request.body;
    const result = await addTimelineEvent(newTimeline);
    response.render('adminAddTimeline.html')
});

export {router};

