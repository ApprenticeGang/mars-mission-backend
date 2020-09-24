import "dotenv/config";
import express from 'express';
import { NewEditorRequest } from "./models/requestModels";
import { createEditor } from "./services/authService";
import { LocalStrategy } from "./app";
import "dotenv/config";



const router = express.Router()


router.get("/sign-in", (request, response) => {
    response.render('adminSignIn.html');
});

router.get("/editors/new", (request, response) => {
    console.log(request.user)
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
    return response.send("okay");

});

export { router };