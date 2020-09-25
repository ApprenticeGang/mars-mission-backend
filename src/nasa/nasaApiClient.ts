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

export interface PhotoApiData {
    img_src: string;
    sol: number;
    id: number;
    earth_date: string;
    camera: {
        name: string;
        full_name: string;
    };
    rover: {
        name: string;
        landing_date: string;
        launch_date: string;
        status: string;
    };
}

interface RoverPhotosApiData {
    photos: PhotoApiData[];
}

export const getRovers = async (): Promise<RoverApiData[]> => {
    const apiData = await get<RoversApiData>("/rovers");

    return apiData.rovers;
};

export const getRoverPhotos = async (roverName: string): Promise<PhotoApiData[]> => {
    const queryParameters = [
        { name: "sol", value: "1" }
    ];
    try {
        const apiData = await get<RoverPhotosApiData>(`/rovers/${roverName}/photos`, queryParameters);
        return apiData.photos;
    } catch {
        return [];
    }
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

