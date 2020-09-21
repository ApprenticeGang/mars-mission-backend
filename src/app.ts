import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import { getStatus } from "./services/statusService";
import { getRoverImages } from "./services/nasaService";
import { NewEditorRequest } from "./models/requestModels";
import { createEditor } from "./services/authService";
import passport from "passport";
import passportLocal from "passport-local";
import { matchHash } from "./services/authService";
import { execArgv } from "process";


const app = express();

app.use(express.urlencoded({ extended: true }));

//Nunjucks
const pathToTemplates = "./templates";
nunjucks.configure(pathToTemplates, {
    autoescape: true,
    express: app
});

const LocalStrategy = passportLocal.Strategy;
app.use(passport.initialize())
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        console.log(email, password)
        const adminMember = await matchHash(email, password);
        console.log(adminMember)
        return done(null, adminMember);
    }
));


passport.serializeUser(function (user, done) {
    done(null, user);
});
/* istanbul ignore next */
passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.get('', async (request, response) => {
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

app.post("/admin/sign-in", passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/admin/sign-in',
}));

export { app };
