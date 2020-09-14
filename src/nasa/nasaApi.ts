import fetch from "node-fetch";


const NASA_API_KEY =  process.env.nv6nqGTA7Y1R7957aTl9MPjvvgxf9Dz8B59DstzN;

export const checkNasaApi = async(): Promise<boolean> =>{
    const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/?api_key=${NASA_API_KEY}`);
    return response.ok;
}