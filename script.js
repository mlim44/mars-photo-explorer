import { secretValue } from "./external.js";

console.log("Script started.")

const photosNode = document.querySelector("#photos-container");

async function fetchPhotos(dateString) {

    console.log("fetchPhotos started.")

    // see works-consulted 
    const marsRoverEndpoint = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${secretValue}` +
                              `&earth_date=${dateString}`;

    console.log(marsRoverEndpoint)
    try {
        const response = await fetch(marsRoverEndpoint);

        // boolean for response code in 200s rang
        if(!response.ok) {
            // new keyword means an object is being instantiated
            throw new Error(`Http error: ${response.status}`);
        };

        console.log(response);

        // parse the response object into a JavaScript Object
        const photoObject = await response.json();

        // deconstructs the json into an object 
        const { photos: [photo1, photo2, photo3] } = photoObject;
        // see works-consulted 
        return [photo1, photo2, photo3].map(photo => {
            const { 
                id,
                camera: { full_name }, 
                earth_date, 
                img_src, 
            } = photo;
            return { id, full_name, earth_date, img_src };
        });
    } catch (error) {
        console.error(error.message);
    }
}

async function loadInitialPhotos() {

    const response = await fetchPhotos(marsRoverEndpoint);
    // see works-consulted 
    const photos = response.photos;

    console.log(photos)

    // see works-consulted 
    const onlyThree = photos.slice(0, 3);

    onlyThree.forEach(photo => {

        const { 
            id,
            camera: { full_name }, 
            earth_date, 
            img_src, 
        } = photo;

        // Figure out how to create a new section 

        const newLiNode = document.createElement("li");
        const image = document.createElement("img");
        const description = `Image from Mars Rover:${id}, Earth Date: ${earth_date}, Camera: ${full_name}`
        image.src = img_src
        image.alt = description;
        newLiNode.textContent = description;
        const photosNode = document.querySelector("#photos-container");
        photosNode.appendChild(image);
        photosNode.appendChild(newLiNode);
    });
    
}

loadInitialPhotos();

// async function displayPhotos(photos, description) {

// }
