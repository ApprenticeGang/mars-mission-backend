import supertest from "supertest";
import {app} from "../app";
import {expectRejectedAuth, signIn, testEditor} from "./testHelpers";
import {mocked} from "ts-jest/utils";
import * as editors from "../database/editors";

jest.mock("../database/editors");
const mockGetEditors = mocked(editors.getEditors);
const mockInsertEditor = mocked(editors.insertEditor);
const mockDeleteEditor = mocked(editors.deleteEditorById);

const request = supertest(app);

let sessionCookie = "";
describe("Editor Routes", () => {

    describe("When not logged in", () => {
        it ("rejects GET requests to list editors page", async done => {
            mockGetEditors.mockResolvedValue([testEditor]);
            const response = await request
                .get("/admin/editors/");
            expectRejectedAuth(response);
            done();
        });

        it ("rejects GET requests to new editor page", async done => {
            const response = await request.get("/admin/editors/new");
            expectRejectedAuth(response);
            done();
        });

        it ("rejects POST requests to new editor page", async done => {
            mockInsertEditor.mockResolvedValue();
            const response = await request
                .get("/admin/editors/new")
                .send("email=email&password=password4");
            expectRejectedAuth(response);
            done();
        });

        it ("rejects POST requests to delete editor page", async done => {
            mockDeleteEditor.mockResolvedValue();
            const response = await request.post("/admin/editors/1/delete");
            expectRejectedAuth(response);
            done();
        });
    });

    describe("When logged in", () => {

        beforeAll(async () => {
            sessionCookie = await signIn(request);
        });

        it ("allows GET requests to list editors page", async done => {
            mockGetEditors.mockResolvedValue([testEditor]);
            const response = await request
                .get("/admin/editors/")
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it ("allows GET requests to new editor page", async done => {
            const response = await request
                .get("/admin/editors/new")
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it ("allows POST requests to new editor page", async done => {
            mockInsertEditor.mockResolvedValue();
            const response = await request
                .post("/admin/editors/new")
                .set("Accept", "x-www-form-urlencoded")
                .set("Cookie", [sessionCookie])
                .send("email=email&password=password4");
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe("/admin/editors");
            done();
        });

        it ("fails to add new editor if email is missing", async done => {
            mockInsertEditor.mockResolvedValue();
            const response = await request
                .post("/admin/editors/new")
                .set("Accept", "x-www-form-urlencoded")
                .set("Cookie", [sessionCookie])
                .send("email=&password=password4");
            expect(response.status).toBe(400);
            done();
        });

        it ("fails to add new editor if password is missing", async done => {
            mockInsertEditor.mockResolvedValue();
            const response = await request
                .post("/admin/editors/new")
                .set("Accept", "x-www-form-urlencoded")
                .set("Cookie", [sessionCookie])
                .send("email=email&password=");
            expect(response.status).toBe(400);
            done();
        });

        it ("allows POST requests to delete editors", async done => {
            mockDeleteEditor.mockResolvedValue();

            const response = await request
                .post("/admin/editors/1/delete")
                .set("Cookie", [sessionCookie]);

            expect(response.status).toBe(302);
            expect(response.header.location).toBe("/admin/editors");
            done();
        });
    });
});