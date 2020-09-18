import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import {getStatus} from "./services/statusService";
import {getRoverImages} from "./services/nasaService";
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";

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


app.get("/api/rovers/:name/images", async (request, response) => {
    const roverName = request.params.name;
    const images = await getRoverImages(roverName);
    response.json(images);
});

app.get("/home", (request, response) => {
    response.render('index.html');
});

app.get("/admin/sign-in", (request, response) => {
    response.render('adminSignIn.html');
});

app.get("/admin/editors/new", (request, response) => {
    response.render('adminEditor.html');
});

app.post("/admin/editors/new", async (request, response) => {
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

export { app };
