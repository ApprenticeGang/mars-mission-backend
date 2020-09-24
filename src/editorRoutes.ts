import "dotenv/config";
import express  from 'express';
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import {insertArticle, NewArticle} from "./database/articles";
import {insertTimelineItem, NewTimelineItem, deleteTimelineItemById, getTimelineItemById, getTimelineForRover} from "./database/timeline";
import passport from "passport";
import {deleteEditorById, getEditors, } from "./database/editors";
import { deletePhotoById } from "./database/photos";

const router = express.Router();

router.get("", (request, response) => {
    if (!request.user) {
        return response.redirect("/admin/sign-in")
    }
    response.render('index.html');
});

router.get("/sign-in", (request, response) => {
    response.render('adminSignIn.html');
});

router.post("/sign-in", passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/sign-in',
}));

router.get("/sign-out", (request, response) => {
    request.logout();
    response.redirect('/admin/sign-in')
    
});


router.get("/editors", async (request, response) => {
    const editors = await getEditors();
    response.render('editorList.html', { editors });
});

router.get("/editors/new", (request, response) => {
    if (!request.user) {
        return response.redirect("/admin/sign-in")
    }
    return response.render('adminEditor.html');
});

router.post("/editors/new", async (request, response) => {
    const { email, password } = request.body as NewEditorRequest;
    if (!email || email === "") {
        return response.status(400).send("Please enter a valid email");
    }
    if (!password || password === "") {
        return response.status(400).send("Please enter a valid password");
    }

    await createEditor(email, password);
    return response.redirect("/admin/editors");
});

router.post("/editors/:id/delete", async (request, response) => {
    const id = parseInt(request.params.id);
    await deleteEditorById(id);
    return response.redirect("/admin/editors");
});

router.get("/articles/new", (request, response) => {
    if (!request.user) {
        return response.redirect("/admin/sign-in")
    }
    return response.render('adminAddNews.html');
});

router.post("/articles/new", async (request, response) => {
    const newArticle = request.body as NewArticle;
    await insertArticle(newArticle);
    response.render('adminAddNews.html');
});

router.get("/rovers/timeline/new", (request, response) => {
    if (!request.user) {
        return response.redirect("/admin/sign-in")
    }
    return response.render('adminAddTimeline.html');
});

router.post("/rovers/timeline/new", async (request, response) => {
    const newTimeline = request.body as NewTimelineItem;
    await insertTimelineItem(newTimeline);
    response.redirect("/rovers/edit");
});

router.post("/rovers/:roverName/timeline/:id/delete", async(request, response) => {
        const id = parseInt(request.params.id);
        const rover = request.params.roverName
        await deleteTimelineItemById(id);

        return response.redirect(`/admin/rover/${rover}`);
    });

router.post("/rovers/:roverName/images/:id/delete", async(request, response) => {
    const id = parseInt(request.params.id);
    const rover = request.params.roverName
    await deletePhotoById(id);

    return response.redirect(`/admin/rover/${rover}`);
});

router.get("/rovers", async (request, response) => {
    response.render('rovers.html');
});

router.get("/rovers/:name", async (request, response) => {
    const name = request.params.name
    response.render('editRovers.html');
});

export {router};
