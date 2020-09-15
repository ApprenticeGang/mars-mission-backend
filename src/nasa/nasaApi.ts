import fetch from "node-fetch";
import express, { Router } from 'express'


const app = express();
const NASA_API_KEY = process.env.NASA_API_KEY;

export const checkNasaApi = async (): Promise<boolean> => {
    const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=${NASA_API_KEY}`);
    return response.ok;
}


interface RoverImage {
    img_src: string
}

export async function GetRoverImages(roverName: string): Promise<RoverImage[]> {
    const sol = 100
    const url = (`https://api.nasa.gov/mars-photos/api/v1/rovers/${roverName}/photos?sol=${sol}&api_key=${NASA_API_KEY}`)
    const apiResponse = await fetch(url);
    const jsonResponse = await apiResponse.json();
    let urls = [];
    for (let i in jsonResponse.photos) {
        const photo = jsonResponse.photos[i];
        urls.push(photo.img_src);
    }
    return urls

}




