import supertest from "supertest";
import {mocked} from "ts-jest/utils";
import * as editors from "../database/editors";

jest.mock("../database/editors");
const mockGetEditorByEmail = mocked(editors.getEditorByEmail);

export const testEditor = {
    id: 10,
    email: "john4.doe@gmail.com",
    salt: "yhzvD1+chPZCfg==",
    hashed_password: "YEYWeCNALZFGtzyzkxXDVTR6ev6qpNJrrSvMmoWiCyQ="
};

export const signIn = async (request: supertest.SuperTest<supertest.Test>): Promise<string> => {
    mockGetEditorByEmail.mockResolvedValue(testEditor);
    const response = await request
        .post('/admin/sign-in')
        .send("email=email&password=password4")
        .set("Accept", "x-www-form-urlencoded");
    return response.headers['set-cookie'][0]
}

export const expectRejectedAuth = (response: supertest.Response): void => {
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/admin/sign-in");
}