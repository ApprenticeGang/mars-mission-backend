import "dotenv/config";
import express  from 'express';
import passport from "passport";
import { router as articleRoutes } from "./articleRoutes";
import { router as editorRoutes } from "./editorRoutes";
import { router as roverRoutes } from "./roverRoutes";
import {requireSignIn} from "../helpers/authHelper";

const router = express.Router();

router.get("", requireSignIn((request, response) => {
    response.render('index.html');
}));

router.get("/sign-in", (request, response) => {
    response.render('adminSignIn.html');
});

router.post("/sign-in", passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/sign-in',
}));

router.post("/sign-out", (request, response) => {
    request.logout();
    response.redirect('/admin/sign-in');
});

router.use("/articles", articleRoutes);
router.use("/editors", editorRoutes);
router.use("/rovers", roverRoutes);

export {router};
