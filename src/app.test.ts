import * as nasaApiClient from "./nasa/nasaApiClient";
import * as database from "./database/database";
import supertest from "supertest";
import { app } from "./app";
import { mocked } from "ts-jest/utils";
import { StatusSummary } from "./services/statusService";
import { RoverImage } from "./services/nasaService";
import { Editor } from "./models/databaseModels";

jest.mock("./nasa/nasaApiClient");
jest.mock("./database/database");

const mockGetRovers = mocked(nasaApiClient.getRovers);
const mockGetRoverPhotos = mocked(nasaApiClient.getRoverPhotos);
const mockCheckDatabaseConnection = mocked(database.checkDatabaseConnection);
const mockAddAdmin = mocked(database.insertEditor);
const mockgetAdminByEmail = mocked(database.getAdminByEmail);
const request = supertest(app);

describe("The status page", () => {
    it("should return OK if can connect to NASA and the Database ", async done => {
        mockGetRovers.mockResolvedValue([]);
        mockCheckDatabaseConnection.mockResolvedValue(true);
        const response = await request.get("");
        const responseBody = response.body as StatusSummary;
        expect(responseBody.express).toBe("OK");
        expect(responseBody.nasaApi).toBe("OK");
        expect(responseBody.database).toBe("OK");
        done();
    });

    it("should return ERROR if it cannot connect to the NASA API", async done => {
        mockGetRovers.mockRejectedValue("Oh No!");
        mockCheckDatabaseConnection.mockResolvedValue(true);
        const response = await request.get("");
        const responseBody = response.body as StatusSummary;
        expect(responseBody.express).toBe("OK");
        expect(responseBody.nasaApi).toBe("ERROR");
        expect(responseBody.database).toBe("OK");
        done();
    });

    it("should return ERROR if it cannot connect to the Database", async done => {
        mockGetRovers.mockResolvedValue([]);
        mockCheckDatabaseConnection.mockResolvedValue(false);
        const response = await request.get("");
        const responseBody = response.body as StatusSummary;
        expect(responseBody.express).toBe("OK");
        expect(responseBody.nasaApi).toBe("OK");
        expect(responseBody.database).toBe("ERROR");
        done();
    });
});

describe("the image selector page", () => {
    it("should return OK if it loads", async done => {
        mockGetRoverPhotos.mockResolvedValue([{ img_src: "https://test-url" }]);
        const response = await request.get("/api/rovers/:name/images");

        expect(response.status).toBe(200)
        const images = response.body as RoverImage[];
        expect(images.length).toBe(1);
        expect(images[0].imageUrl).toBe("https://test-url");
        done();
    });
});

describe("the home page", () => {
    it("return response ok if it loads", async done => {
        const response = await request.get("/home");
        expect(response.status).toBe(200);
        done();
    });
});


describe("the add admin route", () => {
    it("should return 400 if email is missing", async done => {
        const response = await request
            .post('/admin/editors/new')
            .send("password=password")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.status).toBe(400);
        expect(response.text).toBe("Please enter a valid email");
        done();
    });

    it("should return 400 if password is missing", async done => {
        const response = await request
            .post('/admin/editors/new')
            .send("email=email")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.status).toBe(400);
        expect(response.text).toBe("Please enter a valid password");
        done();
    });

    it("should return 200 if request is valid", async done => {
        mockAddAdmin.mockReturnValue(Promise.resolve());
        const response = await request
            .post('/admin/editors/new')
            .send("email=email&password=password")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.status).toBe(200);
        expect(response.text).toBe("okay");
        done();
    });

    it("return response ok if it loads", async done => {
        const response = await request.get("/admin/editors/new");
        expect(response.status).toBe(200);
        done();
    });

    it("return response ok if it loads", async done => {
        const response = await request.get("/admin/sign-in");
        expect(response.status).toBe(200);
        done();
    });
});

describe("the sigin admin route", () => {

    it("should return 200 if request is valid", async done => {
        const editor = { id: 10, email: "john4.doe@gmail.com", salt: "yhzvD1+chPZCfg==", hashed_password: "YEYWeCNALZFGtzyzkxXDVTR6ev6qpNJrrSvMmoWiCyQ=" };
        mockgetAdminByEmail.mockResolvedValue(editor);
        const response = await request
            .post('/admin/sign-in')
            .send("email=email&password=password4")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.redirect).toBe(true)
        expect(response.header.location).toBe("/home")
        done();
    });

    it("should return redirect if the email is wrong", async done => {
        mockgetAdminByEmail.mockResolvedValue(undefined);
        const response = await request
            .post('/admin/sign-in')
            .send("email=dsadsadsa&password=password4")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.redirect).toBe(true)
        expect(response.header.location).toBe("/admin/sign-in")
        done();
    });

    it("should return redirect if the password is wrong", async done => {
        const editor = { id: 10, email: "john4.doe@gmail.com", salt: "yhzvD1+chPZCfg==", hashed_password: "YEYWeCNALZFGtzyzkxXDVTR6ev6qpNJrrSvMmoWiCyQ=" };
        mockgetAdminByEmail.mockResolvedValue(editor);
        const response = await request
            .post('/admin/sign-in')
            .send("email=email&password=password4dasda")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.redirect).toBe(true)
        expect(response.header.location).toBe("/admin/sign-in")
        done();
    });

    it("should return 302 (redirect) if email is missing", async done => {
        const response = await request
            .post('/admin/sign-in')
            .send("email=&password=password")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.status).toBe(302);
        expect(response.header.location).toBe("/admin/sign-in");
        done();
    });

    it("should return 302 (redirect) if password is missing", async done => {
        const response = await request
            .post('/admin/sign-in')
            .send("email=email&password=")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.status).toBe(302);
        expect(response.header.location).toBe("/admin/sign-in");
        done();
    });

    it("should return 400 if both email and password is missing", async done => {
        const response = await request
            .post('/admin/editors/new')
            .send("")
            .set("Accept", "x-www-form-urlencoded");
        expect(response.status).toBe(400);
        done();
    });


});

describe("the edit rovers page", () => {
    it("return response ok if it loads", async done => {
        const response = await request.get("/admin/rovers");
        expect(response.status).toBe(200);
        done();
    });

    it("return response ok if it loads", async done => {
        const response = await request.get("/admin/rovers/:name");
        expect(response.status).toBe(200);
        done();
    });

});