import {expectRejectedAuth, signIn} from "./testHelpers";
import supertest from "supertest";
import {app} from "../app";
import {mocked} from "ts-jest/utils";
import * as articles from "../database/articles";

jest.mock("../database/articles");
const mockInsertArticle = mocked(articles.insertArticle);

const request = supertest(app);

let sessionCookie = "";

describe("Article Routes", () => {

    describe("When not logged in", () => {
        
        it ("rejects GET requests to new article page", async done => {
            const response = await request.get("/admin/articles/new");
            expectRejectedAuth(response);
            done();
        });

        it ("rejects POST requests to new article page", async done => {
            mockInsertArticle.mockResolvedValue();
            const response = await request
                .post('/admin/articles/new')
                .send("imageUrl=imageUrl&title=title&summary=summary&articleUrl=articleUrl&publishDate=publishDate")
                .set("Cookie", [sessionCookie])
                .set("Accept", "x-www-form-urlencoded");
            expectRejectedAuth(response);
            done();
        });
    });

    describe("When logged in", () => {

        beforeAll(async () => {
            sessionCookie = await signIn(request);
        });

        it ("allows GET requests to new article page", async done => {
            const response = await request
                .get("/admin/articles/new")
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it ("allows POST requests to new article page", async done => {
            mockInsertArticle.mockResolvedValue();
            const response = await request
                .post('/admin/articles/new')
                .send("imageUrl=imageUrl&title=title&summary=summary&articleUrl=articleUrl&publishDate=publishDate")
                .set("Cookie", [sessionCookie])
                .set("Accept", "x-www-form-urlencoded");
            expect(response.status).toBe(200);
            done();
        });
    });
});