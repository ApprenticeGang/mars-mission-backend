import express from "express";
import {deleteTimelineItemById, insertTimelineItem, NewTimelineItem} from "../database/timeline";
import {deletePhotoById} from "../database/photos";
import {requireSignIn} from "../helpers/authHelper";

const router = express.Router();

router.get("", requireSignIn(async (request, response) => {
    response.render('rovers.html');
}));

router.get("/:name", requireSignIn(async (request, response) => {
    const name = request.params.name
    response.render('editRovers.html');
}));

router.get("/:name/timeline/new", requireSignIn((request, response) => {
    return response.render('adminAddTimeline.html');
}));

router.post("/:name/timeline/new", requireSignIn(async (request, response) => {
    const newTimeline = request.body as NewTimelineItem;
    const roverName = request.params.name;
    await insertTimelineItem(newTimeline);
    response.redirect(`/admin/rovers/${roverName}`);
}));

router.post("/:name/timeline/:id/delete", requireSignIn(async(request, response) => {
    const id = parseInt(request.params.id);
    const rover = request.params.name
    await deleteTimelineItemById(id);

    return response.redirect(`/admin/rovers/${rover}`);
}));

router.post("/:name/images/:id/delete", requireSignIn(async(request, response) => {
    const id = parseInt(request.params.id);
    const rover = request.params.name
    await deletePhotoById(id);

    return response.redirect(`/admin/rovers/${rover}`);
}));

export { router };