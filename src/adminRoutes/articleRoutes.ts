import express from "express";
import {insertArticle, NewArticle} from "../database/articles";
import {requireSignIn} from "../helpers/authHelper";

const router = express.Router();

router.get("/new", requireSignIn((request, response) => {
    response.render('adminAddNews.html');
}));

router.post("/new", requireSignIn(async (request, response) => {
    const newArticle = request.body as NewArticle;
    await insertArticle(newArticle);
    response.render('adminAddNews.html');
}));

export { router };