import {getRoverPhotos, getRovers} from "../nasa/nasaApiClient";

export interface RoverImage {
    id: number;
    sol: number;
    imageUrl: string;
    earthDate: string;
    cameraDetails: {
        name: string;
        fullName: string;
    },
    rover: {
        name: string;
        landingDate: string;
        launchDate: string;
        status: string;
    }
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
    return apiImages.map(apiImage => { 
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
};

