import * as nasaApiClient from "./nasa/nasaApiClient";
import * as database from "./database/database";
import supertest from "supertest";
import { app } from "./app";
import { mocked } from "ts-jest/utils";
import { StatusSummary } from "./services/statusService";

jest.mock("./nasa/nasaApiClient");
jest.mock("./database/database");

const mockGetRovers = mocked(nasaApiClient.getRovers);
const mockCheckDatabaseConnection = mocked(database.checkDatabaseConnection);

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
