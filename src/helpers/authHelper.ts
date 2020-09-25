import {Request, Response} from "express";

export const requireSignIn = (callback: (request: Request, response: Response) => void) => {
    return (request: Request, response: Response) => {
        if (!request.user) {
            response.redirect("/admin/sign-in");
        } else {
            callback(request, response);
        }
    }
};