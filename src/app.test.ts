import * as nasaApi from "./nasa/nasaApi";
import * as database from "./database/database";
import supertest from "supertest";
import { app } from "./app";
import { mocked } from "ts-jest/utils";
import { response } from "express";

jest.mock("./nasa/nasaApi");
jest.mock("./database/database");

const mockCheckNasaApi = mocked(nasaApi.checkNasaApi);
const mockCheckDatabaseConnection = mocked(database.checkDatabaseConnection);
const mockGetRoverImages = mocked(nasaApi.getRoverImages);

const request = supertest(app);

describe("The status page", () => {
    it("should return OK if can connect to NASA and the Database ", async done => {
        mockCheckNasaApi.mockReturnValue(Promise.resolve(true));
        mockCheckDatabaseConnection.mockReturnValue(Promise.resolve(true));

        const response = await request.get("");
        
        expect(response.body.nasaAPI).toBe("OK");
        expect(response.body.database).toBe("OK");
        
        done();
    });

    it("should return ERROR if it cannot connect to the NASA API", async done => {
        mockCheckNasaApi.mockReturnValue(Promise.resolve(false));
        mockCheckDatabaseConnection.mockReturnValue(Promise.resolve(true));

        const response = await request.get("");

        expect(response.body.nasaAPI).toBe("ERROR");
        expect(response.body.database).toBe("OK");

        done();
    });

    it("should return ERROR if it cannot connect to the Database", async done => {
        mockCheckNasaApi.mockReturnValue(Promise.resolve(true));
        mockCheckDatabaseConnection.mockReturnValue(Promise.resolve(false));

        const response = await request.get("");

        expect(response.body.nasaAPI).toBe("OK");
        expect(response.body.database).toBe("ERROR");

        done();
    });
});

describe ("the image selector page", () => {
    it("should return OK if it loads", async done => {
        mockGetRoverImages.mockReturnValue(Promise.resolve([]));

        const response = await request.get("/api/rovers/:name/images");
        expect(response.status).toBe(200)
        done();
    })
})

describe ("the home page", () => {
    it ("return response ok if it loads", async done => {

        const response = await request.get("/home");
        expect(response.status).toBe(200)
        done();
    
    })
})