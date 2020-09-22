import {getRoverPhotos, getRovers} from "../nasa/nasaApiClient";

export interface RoverImage{
    imageUrl: string;

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
            cameraDetails: apiImage.camera,
            earth_date: apiImage.earth_date,
            rover: apiImage.rover
              
        };
    });
};