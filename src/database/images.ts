import {db} from "./database";

export interface Image {
    id: number;
    image_url: string;
    roverName: string;
    date: string;
}

export interface NewImage {
    imageUrl: string;
    roverName: string;
    date: string;
}


export const getImages = (): Promise<Image[]> => {
    return db
        .select("*")
        .from<Image>('images');
};


export const addNewImage = async (newImage: NewImage): Promise<void> => {
    return db('images')
        .insert({
            image_url: newImage.imageUrl,
            rover_name: newImage.roverName,
            date: newImage.date
        });
};