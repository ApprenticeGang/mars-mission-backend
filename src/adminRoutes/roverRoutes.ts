import express from "express";
import {deleteTimelineItemById, getTimelineForRover, insertTimelineItem, NewTimelineItem} from "../database/timeline";
import {deletePhotoById, getImagesForRover, insertImage, NewImage} from "../database/photos";
import {requireSignIn} from "../helpers/authHelper";
import {RoverName} from "../models/requestModels";

const router = express.Router();

router.get("", requireSignIn((request, response) => {
    response.render('rovers.html');
}));

router.get("/:name", requireSignIn(async (request, response) => {
    const roverName = request.params.name as RoverName;
    const images = await getImagesForRover(roverName);
    const timeline = await getTimelineForRover(roverName);
    
    response.render('editRovers.html', { roverName, images, timeline });
}));

router.get("/:name/timeline/new", requireSignIn((request, response) => {
    const roverName = request.params.name as RoverName;
    return response.render('adminAddTimeline.html', { roverName });
}));

router.post("/:name/timeline/new", requireSignIn(async (request, response) => {
    const newTimeline = request.body as NewTimelineItem;
    const roverName = request.params.name;
    await insertTimelineItem(newTimeline);
    response.redirect(`/admin/rovers/${roverName}`);
}));

router.post("/:name/timeline/:id/delete", requireSignIn(async(request, response) => {
    const id = parseInt(request.params.id);
    const rover = request.params.name;
    await deleteTimelineItemById(id);

    return response.redirect(`/admin/rovers/${rover}`);
}));

router.get("/:name/images/new", requireSignIn((request, response) => {
    const roverName = request.params.name;
    response.render("addRoverImage.html", { roverName });
}));

router.post("/:name/images/new", requireSignIn(async (request, response) => {
    const newImage = request.body as NewImage;
    const roverName = request.params.name;
    await insertImage(newImage, roverName);
    response.redirect(`/admin/rovers/${roverName}`);
}));

router.post("/:name/images/:id/delete", requireSignIn(async(request, response) => {
    const id = parseInt(request.params.id);
    const rover = request.params.name;
    await deletePhotoById(id);

    return response.redirect(`/admin/rovers/${rover}`);
}));

export { router };