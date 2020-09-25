import express from "express";
import {deleteArticle, getArticles, insertArticle, NewArticle} from "../database/articles";
import {requireSignIn} from "../helpers/authHelper";

const router = express.Router();

router.get("", requireSignIn(async (request, response) => {
    const articles = await getArticles();
    response.render('articlesList.html', { articles });
}));

router.get("/new", requireSignIn((request, response) => {
    response.render('adminAddNews.html');
}));

router.post("/new", requireSignIn(async (request, response) => {
    const newArticle = request.body as NewArticle;
    await insertArticle(newArticle);
    response.redirect("/admin/articles");
}));

router.post("/:id/delete", requireSignIn(async (request, response) => {
    const id = parseInt(request.params.id);
    await deleteArticle(id);
    response.redirect("/admin/articles");
}));

export { router };