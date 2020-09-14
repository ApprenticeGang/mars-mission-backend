import fetch from "node-fetch";


const NASA_API_KEY =  process.env.NASA_API_KEY;

export const checkNasaApi = async(): Promise<boolean> => {
    const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=${NASA_API_KEY}`);
    return response.ok;
}