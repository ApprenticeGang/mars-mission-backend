import fetch from "node-fetch";

const NASA_API_KEY = process.env.NASA_API_KEY;
const BASE_URL = "https://api.nasa.gov/mars-photos/api/v1";

export const checkNasaApi = async(): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/rovers/?api_key=${NASA_API_KEY}`);
    return response.ok;
}

interface RoverImage {
    imgSource: string;
}

// interface PhotoData {
//     imageSource: string
// }

export async function getRoverImages(roverName: string): Promise<RoverImage[]> {
    const sol = 100
    const url = (`${BASE_URL}/rovers/${roverName}/photos?sol=${sol}&api_key=${NASA_API_KEY}`)
    const apiResponse = await fetch(url);
    const jsonResponse = await apiResponse.json();
    return jsonResponse.photos.map((photoData: { img_src: any; }) => {
        return {
            imageSource: photoData.img_src
        }
    });
}