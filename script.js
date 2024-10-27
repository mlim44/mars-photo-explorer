import { secretValue } from "./external.js";

console.log("Script started.")

const photosNode = document.querySelector("#photos-container");

loadInitialPhotos();

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
 
    let dateChosen = "2015-6-3";
    console.log("from load:", dateChosen);
    const photos = await fetchPhotos(dateChosen);

    console.log(photos);

    const description = "Mars Rover Photo: ";
    displayPhotos(photos, description);
}

async function displayPhotos(photos, description) {

    photos.forEach(photo => {

        const newLiNode = document.createElement("li");
        const roverImageNode = document.createElement("img");

        const completedDescription = `${description} ${photo.id}, `+
                                     `Earth date: ${photo.earth_date}, `+
                                     `Camera: ${photo.full_name}`;
        roverImageNode.src = photo.img_src;
        roverImageNode.alt = completedDescription;
        newLiNode.textContent = completedDescription;

        photosNode.appendChild(roverImageNode);
        photosNode.appendChild(newLiNode);
    });
}


document.querySelector("#load-photos-button").addEventListener("click", function() {

    const dateNode = document.querySelector("#photoDate");
    let dateInputted = dateNode.value;
    console.log(dateInputted);

    const validatedDate = validDate(dateInputted);

    let dateChosen = "";

    if(!validatedDate["isValid"]) {
        dateChosen = "2015-6-3";
        alert(validatedDate["message"]);
    } else {
        dateChosen = dateInputted;
    }
    console.log("end of click:", dateChosen)
    selectedPhotos(dateChosen);
})