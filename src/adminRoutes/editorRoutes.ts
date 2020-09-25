import express from "express";
import {deleteEditorById, getEditors} from "../database/editors";
import {NewEditorRequest} from "../models/requestModels";
import {createEditor} from "../services/authService";
import {requireSignIn} from "../helpers/authHelper";

const router = express.Router();

router.get("", requireSignIn(async (request, response) => {
    const editors = await getEditors();
    response.render('editorList.html', { editors });
}));

router.get("/new", requireSignIn((request, response) => {
    return response.render('adminEditor.html');
}));

router.post("/new", requireSignIn(async (request, response) => {
    const { email, password } = request.body as NewEditorRequest;
    if (!email || email === "") {
        return response.status(400).send("Please enter a valid email");
    }
    if (!password || password === "") {
        return response.status(400).send("Please enter a valid password");
    }

    await createEditor(email, password);
    return response.redirect("/admin/editors");
}));

router.post("/:id/delete", requireSignIn(async (request, response) => {
    const id = parseInt(request.params.id);
    await deleteEditorById(id);
    return response.redirect("/admin/editors");
}));

export { router };