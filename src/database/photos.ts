import {db} from "./database";
import {PhotoApiData} from "../nasa/nasaApiClient";

export const getPhotoById = async (id: number, roverName: string): Promise<PhotoApiData> => {
    return db()
        .select("*")
        .from("images")
        .where("id", id)
        .andWhere("rover_name", roverName)
        .first();
};

export const deletePhotoById = async (id: number): Promise<void> => {
    await db()
        .delete()
        .from<PhotoApiData>("images")
        .where("id", id);

};