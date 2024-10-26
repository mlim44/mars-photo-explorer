import { secretValue } from "./external.js";

// scriptconsole.log(secretValue); 

// !! NEEDS TO BE REWORKED TO TAKE IN DATE AND API KEY 
console.log("Script started.")
const marsRoverEndpoint = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=DEMO_KEY&earth_date=2015-6-3";

async function fetchPhotos(endpoint) {

    console.log("fetchPhotos started.")

    try {
        const response = await fetch(endpoint);

        // boolean for response code in 200s rang
        if(!response.ok) {
            // new keyword means an object is being instantiated
            throw new Error(`Http error: ${response.status}`);
        }

        console.log(response)

        // parse the response object into a JavaScript Object
        return response.json();
    } catch (error) {
        console.error(error.message);
    }
}

async function displayPhotos() {

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
        const photosNode = document.querySelector("#photos");
        photosNode.appendChild(image);
        photosNode.appendChild(newLiNode);
    });
    
}

displayPhotos();
