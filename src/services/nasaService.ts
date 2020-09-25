import {getRoverPhotos, getRovers} from "../nasa/nasaApiClient";
import {getImagesForRover} from "../database/photos";

interface CameraDetails {
    name: string;
    fullName: string;
}

interface Rover {
    name: string;
    landingDate?: string | undefined;
    launchDate?: string | undefined;
    status?: string | undefined;
}

export interface RoverImage {
    id: number;
    sol?: number | undefined;
    imageUrl: string;
    earthDate: string;
    cameraDetails?: CameraDetails | undefined; 
    rover: Rover;
}

export const checkNasaApi = async(): Promise<boolean> => {
    try {
        await getRovers();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const getRoverImages = async (roverName: string): Promise<RoverImage[]> => {
    const apiImages = await getRoverPhotos(roverName);
    
    const apiResults: RoverImage[] = apiImages.map(apiImage => { 
        return {    
            id: apiImage.id,
            sol: apiImage.sol,
            imageUrl: apiImage.img_src,
            earthDate: apiImage.earth_date,
            cameraDetails: {
                name: apiImage.camera.name,
                fullName: apiImage.camera.full_name,
            },
            rover: {
                name: apiImage.rover.name,
                launchDate: apiImage.rover.launch_date,
                landingDate: apiImage.rover.landing_date,
                status: apiImage.rover.status
            }
        };
    });

    const editorImages = await getImagesForRover(roverName);
    const editorResults: RoverImage[] = editorImages.map(editorImage => {
        return {
            id: editorImage.id,
            imageUrl: editorImage.image_url,
            earthDate: editorImage.date,
            rover: {
                name: roverName
            }
        };
    });
    
    return editorResults.concat(apiResults);
};

