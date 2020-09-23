import supertest from "supertest";
import {app} from "./app";
import {RoverImage} from "./services/nasaService";
import {mocked} from "ts-jest/utils";
import * as nasaApiClient from "./nasa/nasaApiClient";
import testImageApiData from "./testData/testdata.json"
import * as articles from "./database/articles";
import {Article} from "./database/articles";

jest.mock("./nasa/nasaApiClient");
jest.mock("./database/articles");

const request = supertest(app);

const mockGetRoverPhotos = mocked(nasaApiClient.getRoverPhotos);
const mockGetArticles = mocked(articles.getArticles);

describe("API Routes", () => {
    
    describe("News", () => {
        
    });
    
    describe("Rover", () => {
        
        describe("images", () => {
            
            it("should return images from NASA", async (done) => {
                mockGetRoverPhotos.mockResolvedValue(testImageApiData);
                
                let response = await request.get("/api/rovers/spirit/images")
                
                expect(response.status).toBe(200);

                const images = response.body as RoverImage[];
                expect(images.length).toBe(2);
                expect(images[0]).toStrictEqual({
                    id: 102693,
                    sol: 1000,
                    imageUrl: "http://mars.jpl.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG",
                    earthDate: "2015-05-30",
                    cameraDetails: {
                        name: "FHAZ",
                        fullName: "Front Hazard Avoidance Camera",
                    },
                    rover: {
                        name: "Curiosity",
                        landingDate: "2012-08-06",
                        launchDate: "2011-11-26",
                        status: "active"
                    }
                });

                done();
            });
        });
        
        describe("articles", () => {
            
            it("should return articles from the database", async done => {
                const testArticle = {
                    "id": 1,
                    "image_url": "this is an image url",
                    "title": "Test",
                    "summary": "This is a summary",
                    "article_url": "this is a url",
                    "publish_date": "2020-09-21T23:00:00.000Z"
                };
                mockGetArticles.mockResolvedValue([testArticle]);
                
                const response = await request.get("/api/articles")
                
                expect(response.status).toBe(200);
                const articles = response.body as Article[];
                expect(articles[0]).toStrictEqual({
                    id: 1,
                    imageUrl: "this is an image url",
                    title: "Test",
                    summary: "This is a summary",
                    articleUrl: "this is a url",
                    publishDate: "2020-09-21T23:00:00.000Z",
                });
                done()
            });
        });
    });
});