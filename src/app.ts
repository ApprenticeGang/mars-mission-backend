import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import {getStatus} from "./services/statusService";
import {getRoverImages} from "./services/nasaService";
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import sassMiddleware from "node-sass-middleware";

const app = express();
const port = process.env['PORT'] || 3001;
app.use(express.urlencoded({ extended: true }));

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed',
        prefix: '',
    }),
    //no src
    express.static('public')
);

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
})

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

export { app };
