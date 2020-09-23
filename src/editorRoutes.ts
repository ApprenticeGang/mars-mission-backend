import "dotenv/config";
import express  from 'express';
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import "dotenv/config";
import {insertArticle} from "./database/articles";
import {insertTimelineItem} from "./database/timeline";

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

router.get("/articles/new", (request, response) => {
    response.render('adminAddNews.html');
});


router.post("/articles/new", async (request, response) => {
    const newArticle = request.body;
    await insertArticle(newArticle);
    response.render('adminAddNews.html')
});

router.get("/rovers/timeline/new", (request, response) => {
    response.render('adminAddTimeline.html');
});
router.post("/rovers/timeline/new", async (request, response) => {
    const newTimeline = request.body;
    await insertTimelineItem(newTimeline);
    response.render('adminAddTimeline.html')
});

export {router};