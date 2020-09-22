import "dotenv/config";
import express, { response } from 'express';
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import "dotenv/config";
import { addNewsArticle } from "./database/database";

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

router.get("/editors/articles/new", (request, response) => {
    response.render('adminEditor.html');
});

router.post("/editors/articles/new", async (request, response) => {
    const newArticle = request.body;
    const result = await addNewsArticle(newArticle);
    const model = {
        articles: result,
    }
    response.render("/editors/articles/new")
});


export {router};