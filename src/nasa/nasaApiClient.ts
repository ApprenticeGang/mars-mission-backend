import fetch from "node-fetch";
import {buildUrl, QueryParameter} from "../helpers/urlHelper";

const nasaApiKey = process.env.NASA_API_KEY || "";
const baseUrl = "https://api.nasa.gov/mars-photos/api/v1";

interface RoverApiData {
    name: string;
}

interface RoversApiData {
    rovers: RoverApiData[];
}

interface PhotoApiData {
    img_src: string;
    sol: number
    id: number;
    earth_date: string;
    camera: string;
    full_name: string;
    imageUrl: string;
    roverName: string;

}

interface RoverPhotosApiData {
    photos: PhotoApiData[];
}

export const getRovers = async (): Promise<RoverApiData[]> => {
    const apiData = await get<RoversApiData>("/rovers");
    return apiData.rovers;
};

export const getRoverPhotos = async (roverName : string): Promise<PhotoApiData[]> => {
    const queryParameters = [
        { name: "sol", value: "1000" }
    ];
    const apiData = await get<RoverPhotosApiData>(`/rovers/${roverName}/photos`, queryParameters);
    return apiData.photos;
};

const get = async <T>(path: string, queryParameters: QueryParameter[] = []): Promise<T> => {
    queryParameters.push({ name: "api_key", value: nasaApiKey });
    const url = buildUrl(baseUrl, path, queryParameters);
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw Error(`NASA API Request failed: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json() as T;
};


