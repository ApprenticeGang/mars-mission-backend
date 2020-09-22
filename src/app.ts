import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import {getStatus} from "./services/statusService";
import {getRoverImages} from "./services/nasaService";
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import 'express-async-errors';

const app = express();

app.use(express.urlencoded({ extended: true }));

//Nunjucks
const pathToTemplates = "./templates";
nunjucks.configure(pathToTemplates, {
    autoescape: true,
    express: app
});

app.get('', async(request, response) => {
    const status = await getStatus();
    response.json(status);
});

app.get("/home", (request, response) => {
    response.render('index.html');
});

app.get("/admin/sign-in", async (request, response) => {
    response.render('adminSignIn.html');
})

app.get("/admin/editors/new", async (request, response) => {
    response.render('adminEditor.html');
})

app.post("/admin/editors/new", async (request, response) => {
    const { email, password } = request.body as NewEditorRequest;

    if (!email || email === "") {
        return response.status(400).send("Please enter a valid email")
    }
    if (!password || password === "") {
        return response.status(400).send("Please enter a valid password")
    }
    await createEditor(email, password)
    return response.send("okay")
});

/* istanbul ignore next */
app.use((err:any, req:any, res:any, next:any) => {
    if (err.message) {
        res.status(404);
        res.json({error: err.message});
    }
    next(err)
})

export { app };
