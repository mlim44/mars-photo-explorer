console.log("Script started.")

// Imports API key 
import { secretValue } from "./external.js";

const photosNode = document.querySelector("#photos-container");
const defaultDate = "2018-06-15";

async function fetchPhotos(dateString) {

    // see works-consulted 
    const marsRoverEndpoint = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${secretValue}` +
                              `&earth_date=${dateString}`;

    console.log("Fetching photos from", marsRoverEndpoint);

    try {
        const response = await fetch(marsRoverEndpoint);

        // boolean for response code in 200s rang
        if(!response.ok) {
            throw new Error(`Http error: ${response.status}`);
        };

        const photoObject = await response.json();
        const { photos } = photoObject

        // Ensures that photoobject contains photos
        if(photos.length === 0 ) {
            throw new Error(`No photos that day`);
        } else {
            // see works-consulted for slicing and mapping
            return photos.slice(0,3).map( photo => {
                const { 
                    id,
                    camera: { full_name }, 
                    earth_date, 
                    img_src, 
                } = photo;
                return { id, full_name, earth_date, img_src };
            })
        };
    } catch (error) {
        alert(error);
    }
}

async function loadInitialPhotos() {

    let dateChosen = defaultDate;
    const photos = await fetchPhotos(dateChosen);

    console.log(photos);

    const description = `Organic Molecules Discovery: ${dateChosen}`;
    await displayPhotos(photos, description);
}

async function displayPhotos(photos, description) {

    const newH2Node = document.createElement("h2");
    photosNode.appendChild(newH2Node);

    let galleryTitle = "";

    if(!photos) {
        galleryTitle = "No photos this day."
    } else {
        galleryTitle = `${description}`
        photos.forEach(photo => {
            
            const newPNode = document.createElement("p");
            const roverImageNode = document.createElement("img");
            
            const completedDescription = `${description} ${photo.id}, `+
            `Earth date: ${photo.earth_date}, `+
            `Camera: ${photo.full_name}`;
            roverImageNode.src = photo.img_src;
            roverImageNode.alt = completedDescription;
            newPNode.textContent = completedDescription;
            photosNode.appendChild(roverImageNode);
            photosNode.appendChild(newPNode);
        });
    }
    newH2Node.textContent = galleryTitle;
}

document.querySelector("#load-photos-button").addEventListener("click", function() {

    const dateNode = document.querySelector("#photoDate");
    let dateInputted = dateNode.value;
    console.log(dateInputted);

    const validatedDate = validDate(dateInputted);

    let dateChosen = "";   

    if(!validatedDate["isValid"]) {
        dateChosen = defaultDate;
        alert(validatedDate["message"]);
    } else {
        dateChosen = dateInputted;
    }
    console.log("end of click:", dateChosen)
    selectedPhotos(dateChosen);
})

async function selectedPhotos(dateChosen) {

    console.log(dateChosen);

    photosNode.innerHTML = "";  
    const photos = await fetchPhotos(dateChosen);

    let description = `Mars Rover Photo from ${dateChosen}`;
    await displayPhotos(photos, description);
}

// Function to check the validity of the date entered 
const validDate = (dateInput) => {

    let isValid = true;
    let message = "";
    
    const pattern = /^\d{4}-\d{2}-\d{2}$/;

    // Checks if date entered is in valid format 
    if (!pattern.test(dateInput)) {
        isValid = false;        
        message = "Incorrect date format.";
    } else {

        // Compares date entered to today's date
        const maxDate = new Date("2024-02-19");
        const minDate = new Date("2012-08-06");
        const dateInputDate = new Date(dateInput);

        if (dateInputDate > maxDate) {
            isValid = false;
            message = "Please select a date earlier than February 20, 2024.";
        }  else if (dateInputDate < minDate) {
            isValid = false;
            message = "Please select a date no earlier than August 6, 2012.";
        };
    };

    return { isValid, message };   
};

loadInitialPhotos(); 