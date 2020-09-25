import {expectRejectedAuth, signIn} from "./testHelpers";
import supertest from "supertest";
import {app} from "../app";
import {mocked} from "ts-jest/utils";
import * as timeline from "../database/timeline";
import * as photos from "../database/photos";

jest.mock("../database/timeline");
jest.mock("../database/photos");
const mockInsertTimelineItem = mocked(timeline.insertTimelineItem);
const mockDeleteTimelineItem = mocked(timeline.deleteTimelineItemById);
const mockDeleteImageItem = mocked(photos.deletePhotoById);

const request = supertest(app);

let sessionCookie = "";

describe("Rover Routes", () => {

    describe("When not logged in", () => {
        it("rejects GET requests to list rovers page", async done => {
            const response = await request.get("/admin/rovers");
            expectRejectedAuth(response);
            done();
        });

        it("rejects GET requests to rover page", async done => {
            const response = await request.get("/admin/rovers/spirit");
            expectRejectedAuth(response);
            done();
        });

        it("rejects GET requests to add timeline event page", async done => {
            const response = await request.get("/admin/rovers/spirit/timeline/new");
            expectRejectedAuth(response);
            done();
        });

        it("rejects POST requests to add timeline event page", async done => {
            mockInsertTimelineItem.mockResolvedValue();
            const response = await request
                .post('/admin/rovers/spirit/timeline/new')
                .send("rover_name=rover_name&image_url=image_url&heading=heading&timeline_entry=timeline_entry&date=date")
                .set("Accept", "x-www-form-urlencoded");
            expectRejectedAuth(response);
            done();
        });

        it("rejects POST requests to delete timeline event page", async done => {
            mockDeleteTimelineItem.mockResolvedValue();
            const response = await request
                .post('/admin/rovers/spirit/timeline/1/delete');
            expectRejectedAuth(response);
            done();
        });
        
        it("rejects GET requests to the add image page", async done => {
            const response = await request.get("/admin/rovers/spirit/images/new");
            expectRejectedAuth(response);
            done();
        });

        it("rejects POST requests to the add image page", async done => {
            const response = await request
                .post("/admin/rovers/spirit/images/new")
                .send("imageUrl=http://test-image")
                .set("Accept", "x-www-form-urlencoded");
            expectRejectedAuth(response);
            done();
        });

        it("rejects POST requests to delete image page", async done => {
            mockDeleteImageItem.mockResolvedValue();
            const response = await request
                .post('/admin/rovers/spirit/images/1/delete');
            expectRejectedAuth(response);
            done();
        });
    });

    describe("When logged in", () => {

        beforeAll(async () => {
            sessionCookie = await signIn(request);
        });

        it("accepts GET requests to list rovers page", async done => {
            console.log("sessionCookie", sessionCookie);
            const response = await request
                .get("/admin/rovers")
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it("accepts GET requests to rover page", async done => {
            const response = await request.get("/admin/rovers/spirit").set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it("accepts GET requests to add timeline event page", async done => {
            const response = await request
                .get('/admin/rovers/spirit/timeline/new')
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it("accepts POST requests to add timeline event page", async done => {
            mockInsertTimelineItem.mockResolvedValue();
            const response = await request
                .post('/admin/rovers/spirit/timeline/new')
                .send("rover_name=rover_name&image_url=image_url&heading=heading&timeline_entry=timeline_entry&date=date")
                .set("Accept", "x-www-form-urlencoded")
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe("/admin/rovers/spirit");
            done();
        });

        it("accepts POST requests to delete timeline event", async done => {
            mockDeleteTimelineItem.mockResolvedValue();
            const response = await request
                .post('/admin/rovers/spirit/timeline/1/delete')
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe("/admin/rovers/spirit");
            done();
        });

        it("accepts GET requests to the add image page", async done => {
            const response = await request.get("/admin/rovers/spirit/images/new").set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it("accepts POST requests to the add image page", async done => {
            const response = await request
                .post("/admin/rovers/spirit/images/new")
                .send("imageUrl=http://test-image")
                .set("Cookie", [sessionCookie])
                .set("Accept", "x-www-form-urlencoded");
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe("/admin/rovers/spirit");
            done();
        });

        it("accepts POST requests to delete Image", async done => {
            mockDeleteImageItem.mockResolvedValue();
            const response = await request
                .post('/admin/rovers/spirit/images/1/delete')
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe("/admin/rovers/spirit");
            done();
        });
    });
});