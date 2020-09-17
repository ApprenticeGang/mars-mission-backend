import {checkDatabaseConnection} from "../database/database";
import {checkNasaApi} from "./nasaService";

type Status = "OK" | "ERROR";

export interface StatusSummary {
    express: Status;
    nasaApi: Status;
    database: Status;
}

export const getStatus = async (): Promise<StatusSummary> => {
    return {
        "express": "OK",
        "nasaApi": await checkNasaApi() ? "OK" : "ERROR",
        "database": await checkDatabaseConnection() ? "OK" : "ERROR"
    };
};