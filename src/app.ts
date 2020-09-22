import "dotenv/config";
import express from 'express';
import nunjucks from "nunjucks";
import {getStatus} from "./services/statusService";
import {getRoverImages} from "./services/nasaService";
import {NewEditorRequest} from "./models/requestModels";
import {createEditor} from "./services/authService";
import 'express-async-errors';
import sassMiddleware from "node-sass-middleware";
import {router as apiRoutes}  from "./apiRoutes"
import {router as editorRoutes} from "./editorRoutes"

const app = express();
app.use(express.urlencoded({ extended: true }));

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed',
        prefix: '',
    }),
    //no src
    express.static('public')
);

//Nunjucks
export const pathToTemplates = "./templates";
nunjucks.configure(pathToTemplates, {
    autoescape: true,
    express: app
});

app.get('', async(request, response) => {
    const status = await getStatus();
    response.json(status);
});

app.get("/home", (request, response) => {
    response.render('index.html');
});

app.use('/api', apiRoutes);

app.use('/admin', editorRoutes);




/* istanbul ignore next */
app.use((err:any, req:any, res:any, next:any) => {
    if (err.message) {
        res.status(404);
        res.json({error: err.message});
    }
    next(err)
})

export { app };

