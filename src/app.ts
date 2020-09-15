import "dotenv/config";
import express, { response } from 'express';
import { checkNasaApi } from './nasa/nasaApi';
import { checkDatabaseConnection } from "./database/database";
import nunjucks from "nunjucks";
import crypto from "crypto";
import { request } from "http";
import { addNewAdmin } from "./userManager";

const app = express();

app.use(express.urlencoded({ extended: true }));

// NOT FINISHED YET 
// const LocalStrategy = passportlocal.Strategy;
// // app.use(passport.initialize())
// passport.use(new LocalStrategy(
//     async (email, password, done) => {
//         //find the user

//         const admin = await matchHash(email, password);

//         if (admin === false) {
//             return done(null, false, { message: "admin not found" })
//         }
//         else {
//             return done(null, admin);
//         }
//     }

// ))

app.get('', async (request, response) => {
    response.json({
        "API": "OK",
        "nasaAPI": await checkNasaApi() ? "OK" : "ERROR",
        "database": await checkDatabaseConnection() ? "OK" : "ERROR",
    });
});

//Nunjucks
const PATH_TO_TEMPLATES = "./templates";
nunjucks.configure(PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
});


app.get("/home", (request, response) => {
    const model = {
        message: "Admin Site"
    }
    response.render('index.html', model);
});



app.get("/admin/editors/new", (request, response) => {
    return (
        response.render('addAdmin.html')

    )
});

app.post("/admin/editors/new", async (request, response) => {
    const loginInfoEmail = request.body.email;
    const loginInfoPassword = request.body.password;
    console.log(request.body);
    await addNewAdmin(loginInfoEmail, loginInfoPassword)
   

    response.send('success')
});



//NOT FINISHED YET
// app.get("/admin/sign-in", (request, response) => {
//     const model = {
//         message: "Admin Sign In"
//     }
//     response.render('signin.html', model);
// });

// app.post("/admin/sign-in",
//     passport.authenticate('local', {
//         successRedirect: '/',
//         failureRedirect: '/signin.html',

//     }))

export { app };

