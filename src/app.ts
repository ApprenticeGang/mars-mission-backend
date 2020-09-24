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
import cookieparser from "cookie-parser";
import expresssession from "express-session";

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cookieparser());
app.use(expresssession({
    secret: "secret"
}));

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
    express.static('public')
);

app.use(cors({
    origin: [
        "http://mars-mission-integration.s3-website.eu-west-2.amazonaws.com/",
        "https://d2000sgepwjw55.cloudfront.net/",
        "http://localhost:3000"
    ]
}));

export const pathToTemplates = "./templates";
nunjucks.configure(pathToTemplates, {
    autoescape: true,
    express: app
});

const localStrategy = passportLocal.Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
/* eslint-disable-next-line */
async (email, password, done): Promise<void> => {
    const adminMember = await matchHash(email, password);
    done(null, adminMember);
}
));
passport.serializeUser(function (user, done) {
    done(null, user);
});
/* istanbul ignore next */
passport.deserializeUser(function (user, done) {
    done(null, user);
});

exports.restrict

app.get('', async (request, response) => {
    const status = await getStatus();
    response.json(status);
});

app.use('/api', apiRoutes);
app.use('/admin', editorRoutes);

/* istanbul ignore next */
/* eslint-disable */
app.use((err: any, req: any, res: any, next: any) => {
    if (err.message) {
        console.error(err.message);
        res.status(500).end();
    }
    next(err)
})
/* eslint-enable */

export { app };
