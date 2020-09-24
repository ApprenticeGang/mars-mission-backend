import supertest from "supertest";
import { app } from "./app";
import { mocked } from "ts-jest/utils";
import * as editors from "./database/editors";
import * as timeline from "./database/timeline";
import * as articles from "./database/articles";
import * as roverImages from "./database/photos"

jest.mock("./database/editors");
jest.mock("./database/timeline");
jest.mock("./database/articles");
jest.mock("./database/photos");


const request = supertest(app);

const mockInsertEditor = mocked(editors.insertEditor);
const mockGetEditorByEmail = mocked(editors.getEditorByEmail);
const mockGetEditors = mocked(editors.getEditors);
const mockDeleteEditor = mocked(editors.deleteEditorById);
const mockInsertTimelineItem = mocked(timeline.insertTimelineItem);
const mockInsertArticle = mocked(articles.insertArticle);
const mockDeleteTimelineItem=mocked(timeline.deleteTimelineItemById);
const mockDeleteRoverImage=mocked(roverImages.deletePhotoById);

const testEditor = {
    id: 10,
    email: "john4.doe@gmail.com",
    salt: "yhzvD1+chPZCfg==",
    hashed_password: "YEYWeCNALZFGtzyzkxXDVTR6ev6qpNJrrSvMmoWiCyQ="
};


const signIn = async (): Promise<string> => {

    mockGetEditorByEmail.mockResolvedValue(testEditor);
    const response = await request
        .post('/admin/sign-in')
        .send("email=email&password=password4")
        .set("Accept", "x-www-form-urlencoded");
    return response.headers['set-cookie'][0]


}
let sessionCookie = "";

describe("admin routes", () => {
    describe("home", () => {

        beforeAll(async () => {
            sessionCookie = await signIn();
        });
        it("GET returns 200", async done => {
            const response = await request
                .get("/admin")
                .set("Cookie", [sessionCookie]);
            expect(response.status).toBe(200);
            done();
        });

        it("home returns 302 when not signed in", async done => {
            const response = await request.get("/admin");
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe("/admin/sign-in");
            done();
        });
    });

    describe("Editors", () => {

        describe("List Editors", () => {
            beforeAll(async () => {
                sessionCookie = await signIn();
            });

            it("GET returns 200", async done => {
                mockGetEditors.mockResolvedValue([testEditor]);
                const response = await request
                    .get("/admin/editors/")
                    .set("Cookie", [sessionCookie]);
                expect(response.status).toBe(200);
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

        describe("Add New Editor", () => {
            beforeAll(async () => {
                sessionCookie = await signIn();
            });
            it("GET returns 200", async done => {
                const response = await request
                    .get("/admin/editors/new")
                    .set("Cookie", [sessionCookie]);
                expect(response.status).toBe(200);
                done();
            });

            it("Add New Editor returns 302 when not signed in", async done => {
                const response = await request.get("/admin/editors/new");
                expect(response.status).toBe(302);
                expect(response.headers.location).toBe("/admin/sign-in");
                done();
            });

            it("POST returns 200 if data is valid", async done => {
                mockInsertEditor.mockReturnValue(Promise.resolve());
                const response = await request
                    .post('/admin/editors/new')
                    .send("email=email&password=password")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.status).toBe(302);
                expect(response.header.location).toBe("/admin/editors");
                done();
            });

            it("POST fails (400) if email is missing", async done => {
                const response = await request
                    .post('/admin/editors/new')
                    .send("password=password")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.status).toBe(400);
                expect(response.text).toBe("Please enter a valid email");
                done();
            });

            it("POST fails (400) if password is missing", async done => {
                const response = await request
                    .post('/admin/editors/new')
                    .send("email=email")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.status).toBe(400);
                expect(response.text).toBe("Please enter a valid password");
                done();
            });
        });

        describe("Delete Editor", () => {
            beforeAll(async () => {
                sessionCookie = await signIn();
            });

            it("POST succeeds if editor exists", async done => {
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

    describe("Sign In", () => {

        it("GET returns 200", async done => {
            const response = await request.get("/admin/sign-in");
            expect(response.status).toBe(200);
            done();
        });

        it("POST returns 200 if request is valid", async done => {
            mockGetEditorByEmail.mockResolvedValue(testEditor);
            const response = await request
                .post('/admin/sign-in')
                .send("email=email&password=password4")
                .set("Accept", "x-www-form-urlencoded");
            expect(response.redirect).toBe(true);
            expect(response.header.location).toBe("/admin");
            done();
        });

        it("POST fails if the email is wrong", async done => {
            mockGetEditorByEmail.mockResolvedValue(undefined);
            const response = await request
                .post('/admin/sign-in')
                .send("email=dsadsadsa&password=password4")
                .set("Accept", "x-www-form-urlencoded");
            expect(response.redirect).toBe(true);
            expect(response.header.location).toBe("/admin/sign-in");
            done();
        });

        it("POST fails if the password is wrong", async done => {
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

        it("POST fails if email is missing", async done => {
            const response = await request
                .post('/admin/sign-in')
                .send("email=&password=password")
                .set("Accept", "x-www-form-urlencoded");
            expect(response.status).toBe(302);
            expect(response.header.location).toBe("/admin/sign-in");
            done();
        });

        it("POST fails if password is missing", async done => {
            const response = await request
                .post('/admin/sign-in')
                .send("email=email&password=")
                .set("Accept", "x-www-form-urlencoded");
            expect(response.status).toBe(302);
            expect(response.header.location).toBe("/admin/sign-in");
            done();
        });
    });

    describe("Sign Out", () => {

        it("GET returns 302", async done => {
            const response = await request.get("/admin/sign-out");
            expect(response.status).toBe(302);
            done();
        });
    });

    describe("Articles", () => {

        describe("Add new Article", () => {
            beforeAll(async () => {
                sessionCookie = await signIn();
            });
            it("GET returns 200", async done => {
                const response = await request
                    .get("/admin/articles/new")
                    .set("Cookie", [sessionCookie]);
                expect(response.status).toBe(200);
                done();
            });

            it("Articles returns 302 when not signed in", async done => {
                const response = await request.get("/admin/articles/new");
                expect(response.status).toBe(302);
                expect(response.headers.location).toBe("/admin/sign-in");
                done();
            });

            it("POST returns 200", async done => {
                mockInsertArticle.mockResolvedValue();
                const response = await request
                    .post('/admin/articles/new')
                    .send("imageUrl=imageUrl&title=title&summary=summary&articleUrl=articleUrl&publishDate=publishDate")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.status).toBe(200);
                done();
            });
        });
    });

    describe("Timelines", () => {

        describe("Add new Timeline Item", () => {
            beforeAll(async () => {
                sessionCookie = await signIn();
            });

            it("GET returns 200", async done => {
                const response = await request
                    .get('/admin/rovers/timeline/new')
                    .set("Cookie", [sessionCookie]);
                expect(response.status).toBe(200);
                done();
            });

            it("Timelines returns 302 when not signed in", async done => {
                const response = await request.get("/admin/rovers/timeline/new");
                expect(response.status).toBe(302);
                expect(response.headers.location).toBe("/admin/sign-in");
                done();
            });

            it("POST returns 200", async done => {
                mockInsertTimelineItem.mockResolvedValue();
                const response = await request
                    .post('/admin/rovers/timeline/new')
                    .send("rover_name=rover_name&image_url=image_url&heading=heading&timeline_entry=timeline_entry&date=date")
                    .set("Accept", "x-www-form-urlencoded");
                expect(response.status).toBe(302);
                done();
            });
        });
        describe("Delete Timeline event", () => {
        
            it("POST succeeds if timeline event exists", async done => {
                mockDeleteTimelineItem.mockResolvedValue();
                
                const response = await request.post("/admin/rovers/spirit/timeline/2/delete");
                
                expect(response.status).toBe(302);
                // expect(response.header.location).toBe("/admin/editors");
                done();
            });
        });
    });

    describe("Rover images", () => {
        describe("Delete Timeline event", () => {
        
            it("POST succeeds if timeline event exists", async done => {
                mockDeleteRoverImage.mockResolvedValue();
                const response = await request.post("/admin/rovers/spirit/images/2/delete");
                expect(response.status).toBe(302);
                done();
            });
        });

    })
});
