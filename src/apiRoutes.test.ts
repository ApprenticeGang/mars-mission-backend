import supertest from "supertest";
import {app} from "./app";
import {RoverImage} from "./services/nasaService";
import {mocked} from "ts-jest/utils";
import * as nasaApiClient from "./nasa/nasaApiClient";
import testImageApiData from "./testData/testdata.json";
import * as articles from "./database/articles";
import * as timeline from "./database/timeline";
import {Article} from "./database/articles";
import {TimelineItem} from "./database/timeline";

jest.mock("./nasa/nasaApiClient");
jest.mock("./database/articles");
jest.mock("./database/timeline");

const request = supertest(app);

const mockGetRoverPhotos = mocked(nasaApiClient.getRoverPhotos);
const mockGetArticles = mocked(articles.getArticles);
const mockGetTimelineForRover = mocked(timeline.getTimelineForRover);

describe("API Routes", () => {
    
    describe("Rover", () => {
        
        describe("images", () => {
            
            it("should return images from NASA", async (done) => {
                mockGetRoverPhotos.mockResolvedValue(testImageApiData);
                
                const response = await request.get("/api/rovers/spirit/images");
                
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
                
                const response = await request.get("/api/articles");
                
                expect(response.status).toBe(200);
                const articleResponse = response.body as Article[];
                expect(articleResponse[0]).toStrictEqual({
                    id: 1,
                    imageUrl: "this is an image url",
                    title: "Test",
                    summary: "This is a summary",
                    articleUrl: "this is a url",
                    publishDate: "2020-09-21T23:00:00.000Z",
                });
                done();
            });
        });
        
        describe("timelines", () => {
            
            it("should return timelines from the database", async done => {
                mockGetTimelineForRover.mockResolvedValue([
                    {
                        id: 1,
                        rover_name: "spirit",
                        image_url: "http://my-image.com",
                        heading: "Launch Day!",
                        timeline_entry: "Spirit got launched into space",
                        date: "2010-08-06"
                    }
                ]);
                
                const response = await request.get("/api/rovers/spirit/timeline");
                
                expect(response.status).toBe(200);
                const timelineItem = (response.body as TimelineItem[])[0];
                expect(timelineItem).toStrictEqual({
                    id: 1,
                    roverName: "spirit",
                    imageUrl: "http://my-image.com",
                    heading: "Launch Day!",
                    body: "Spirit got launched into space",
                    date: "2010-08-06"
                });
                done();
            });
        });
    });
});