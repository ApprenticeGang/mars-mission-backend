import {db} from "./database";

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

export const insertImage = async (newImage: NewImage, roverName: string) => {
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