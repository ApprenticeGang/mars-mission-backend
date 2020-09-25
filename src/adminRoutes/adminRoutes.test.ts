import {expectRejectedAuth, signIn, testEditor} from "./testHelpers";
import supertest from "supertest";
import { app } from "../app";
import { mocked } from "ts-jest/utils";
import * as editors from "../database/editors";

jest.mock("../database/editors");

const request = supertest(app);
const mockGetEditorByEmail = mocked(editors.getEditorByEmail);

let sessionCookie = "";

describe("Admin Routes", () => {

    describe("When not logged in", () => {

        it("rejects access to home page", async done => {
            const response = await request.get("/admin");
            expectRejectedAuth(response);
            done();
        });

        it("allows access to sign in page", async done => {
            const response = await request.get("/admin/sign-in");
            expect(response.status).toBe(200);
            done();
        });

        describe("sign in attempts", () => {

            it("accepts valid sign ins", async done => {
                mockGetEditorByEmail.mockResolvedValue(testEditor);
                const response = await request
                    .post('/admin/sign-in')
                    .send("email=email&password=password4")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.redirect).toBe(true);
                expect(response.header.location).toBe("/admin");
                done();
            });

            it("rejects sign in with incorrect email", async done => {
                mockGetEditorByEmail.mockResolvedValue(undefined);
                const response = await request
                    .post('/admin/sign-in')
                    .send("email=dsadsadsa&password=password4")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.redirect).toBe(true);
                expect(response.header.location).toBe("/admin/sign-in");
                done();
            });

            it("rejects sign in with incorrect password", async done => {
                const editor = { id: 10, email: "john4.doe@gmail.com", salt: "yhzvD1+chPZCfg==", hashed_password: "YEYWeCNALZFGtzyzkxXDVTR6ev6qpNJrrSvMmoWiCyQ=" };
                mockGetEditorByEmail.mockResolvedValue(editor);
                const response = await request
                    .post('/admin/sign-in')
                    .send("email=email&password=password4dasda")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.redirect).toBe(true);
                expect(response.header.location).toBe("/admin/sign-in");
                done();
            });

            it("rejects sign in if email is missing", async done => {
                const response = await request
                    .post('/admin/sign-in')
                    .send("email=&password=password")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.status).toBe(302);
                expect(response.header.location).toBe("/admin/sign-in");
                done();
            });

            it("rejects sign in if password is missing", async done => {
                const response = await request
                    .post('/admin/sign-in')
                    .send("email=email&password=")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.status).toBe(302);
                expect(response.header.location).toBe("/admin/sign-in");
                done();
            });
        });
    });

    describe("When logged in", () => {

        beforeAll(async () => {
            sessionCookie = await signIn(request);
            return;
        });
        
        it("allows access to the home page", async done => {
            const response = await request
                .get("/admin")
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });
        
        it("allows sign out", async done => {
            const response = await request.post("/admin/sign-out");
            expect(response.status).toBe(302);
            done();
        });
    });
});
