import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import passport from "passport";
import passportLocal from "passport-local";
import { matchHash } from "./services/authService";
import {getStatus} from "./services/statusService";
import 'express-async-errors';
import sassMiddleware from "node-sass-middleware";
import {router as apiRoutes}  from "./apiRoutes";
import {router as editorRoutes} from "./editorRoutes";
import cors from "cors";

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
//cors
app.use(cors({
    origin: ["http://mars-mission-integration.s3-website.eu-west-2.amazonaws.com/",
            "https://d2000sgepwjw55.cloudfront.net/",
            "http://localhost:3000"]
}));
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
        const adminMember = await matchHash(email, password);
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

app.get("/home", (request, response) => {
    response.render('index.html');
});

app.use('/api', apiRoutes);

app.use('/admin', editorRoutes);

app.post("/admin/sign-in", passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/admin/sign-in',
}));

/* istanbul ignore next */
app.use((err:any, req:any, res:any, next:any) => {
    if (err.message) {
        res.status(404);
        res.json({error: err.message});
    }
    next(err)
})

export { app };
