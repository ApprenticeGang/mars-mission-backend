import {db} from "./database";
import {RoverName} from "../models/requestModels";

export interface Image {
    id: number;
    image_url: string;
    rover_name: string;
    date: string;
}

export interface NewImage {
    imageUrl: string;
    date: string;
}

export const getImagesForRover = (roverName: RoverName): Promise<Image[]> => {
    return db()
        .select("*")
        .from<Image>("images")
        .where("rover_name", roverName)
        .orderBy("date", "desc");
};

export const insertImage = async (newImage: NewImage, roverName: string): Promise<void> => {
    await db<Image>("images")
        .insert({
            image_url: newImage.imageUrl,
            rover_name: roverName,
            date: newImage.date,
        });
};

export const deletePhotoById = async (id: number): Promise<void> => {
    await db()
        .delete()
        .from<Image>("images")
        .where("id", id);
};