import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import {getStatus} from "./services/statusService";
import {getRoverImages} from "./services/nasaService";
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import sassMiddleware from "node-sass-middleware";

require('express-async-errors');
const app = express();
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

app.get("/test", async (res, rep) => {
    throw Error("Oh Dear :(");
});
app.use((err:any, req:any, res:any, next:any) => {
    if (err.message) {
        res.status(500);
        res.json({error: err.message});
    }
    next(err)
})

app.get("/api/rovers/:name/images", async (request, response) => {
    // console.log("hello")

    const roverName = request.params.name;
    const images = await getRoverImages(roverName);
    // console.log("hello 1")

    if (!images) {
        // console.log("oh no an error")
        throw new Error('500: ApiError')
    }
    response.json(images);
<<<<<<< HEAD
})
app.use((err:any, req:any, res:any, next:any) => {
    if (err.message) {
        res.status(500);
        res.json({error: err.message});
    }
    next(err)
})
=======
});
>>>>>>> 945a251131d451a74f093ed338d950d3bdcda9ca

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
