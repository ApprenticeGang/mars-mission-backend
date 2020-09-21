import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import { getRoverImages } from "./services/nasaService";
import { NewEditorRequest } from "./models/requestModels";
import { createEditor } from "./services/authService";
import passport from "passport";
import passportLocal from "passport-local";
import { matchHash } from "./services/authService";
import { execArgv } from "process";
import {getStatus} from "./services/statusService";
import sassMiddleware from "node-sass-middleware";
import {router as apiRoutes}  from "./apiRoutes"
import {router as editorRoutes} from "./editorRoutes"



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
export const pathToTemplates = "./templates";
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

app.use('/api', apiRoutes);

app.use('/admin', editorRoutes);




app.post("/admin/sign-in", passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/admin/sign-in',
}));

export { app };
