// Imports API key 
import { secretValue } from "./external.js";
const photosNode = document.querySelector("#photos-container");
const defaultDate = "2018-06-15";


/* -- fetchPhotos -- 
Retrieves data from the API using the datestring passed 
in the argument and appends it to the URL.
*/
async function fetchPhotos(dateString) {
    // see works-consulted 
    const marsRoverEndpoint = `https://api.nasa.gov/mars-photos/api/v1/rovers/` + 
                              `curiosity/photos?api_key=${secretValue}` +
                              `&earth_date=${dateString}`;
                              
    // Catches errors from fetching and destructuring 
    console.log("Fetching photos from", marsRoverEndpoint);
    try
    {
        const response = await fetch(marsRoverEndpoint);

        // Boolean for response code in 200s
        if(!response.ok) {
            throw new Error(`Http error: ${response.status}`);
        };

        const object = await response.json();
        console.log(object);

        // const { photos } = (await response.json()); 
        // const { photos } = photoObject;
        const { photos } = object;

        // Ensures that photoobject contains photos
        if(photos.length === 0 ) {
            throw new Error(`No photos that day.`);
        } else {
            console.log(photos)
            // see works-consulted for slicing and mapping
            return photos.slice(0,3).map( (photo) => {
                const { 
                    id,
                    camera: { full_name }, 
                    earth_date, 
                    img_src, 
                } = photo;
                return { id, full_name, earth_date, img_src };
            });
        };

    } catch (error) {
        alert(error);
    };
}


/* -- loadInitialPhotos -- 
Loads the intial photos on the webpage from 
the defaul date define above. 

Uses fetchPhotos and displayPhotos function 
to detrieve and display the photos. 
*/
async function loadInitialPhotos() {

    let dateChosen = defaultDate;
    const photos = await fetchPhotos(dateChosen);

    console.log(photos);

    const description = `Organic Molecules Discovery: ${dateChosen}`;
    await displayPhotos(photos, description);
}


/* -- displayPhotos -- 
Displays the photos object parsed and
destructured object from the fetchPhotos function.

Populates the description of the gallery title and
the description of each photo.
*/

async function displayPhotos(photos, description) {

    const newH2Node = document.createElement("h2");
    photosNode.appendChild(newH2Node);

    let galleryTitle = "";

    console.log(photos);

    if(!photos) {
        // Populates a heading for dates without any photos 
        galleryTitle = "No photos this day."
    } else {

        galleryTitle = `${description}`
        photos.forEach(photo => {
            
            const newPNode = document.createElement("p");
            const roverImageNode = document.createElement("img");
            
            const completedDescription = `${description}` + 
                                         `, Photo ID: ${photo.id}`+
                                         `, Camera: ${photo.full_name}`;

            roverImageNode.src = photo.img_src;
            roverImageNode.alt = completedDescription;
            newPNode.textContent = completedDescription;

            photosNode.appendChild(roverImageNode);
            photosNode.appendChild(newPNode);
        });
    };

    // Adds the heading for the default/selected date
    newH2Node.textContent = galleryTitle;
}


/* -- Load Button Event Listener --
Takes the date value from date input and validates it
using the validDate function.

Creates an error message for invalid dates and dates:
1. before 2012-08-06 (Landing Date)
2. after 2024-02-19 (Max Date)

Calls selectedPhotos function to pass the date into the 
fetchPhotos and displayPhotos function.
*/
document.querySelector("#load-photos-button").addEventListener("click", function() {

    // To clear photos from webpage 
    photosNode.innerHTML = ""; 

    // Converts date from input date to a string 
    let dateChosen = "";  

    const dateNode = document.querySelector("#photoDate");
    let dateInputted = dateNode.value;

    console.log(dateInputted);

    // Uses validation function below 
    const validatedDate = validDate(dateInputted);

    if(!validatedDate["isValid"]) {

        // Resets date back to default if date is invalid
        // and creates an alert message 
        dateChosen = defaultDate;
        alert(validatedDate["message"]);
    } else {

        dateChosen = dateInputted;
    };

    selectedPhotos(dateChosen);
})


/* -- selectedPhotos --
Clears the innnerHTML of the photosNode to remove 
previous photos.

Takes in a dateChosen argument from the eventlisterner
and uses it pass to the fetchPhotos function and create
the description for the page which will be passed as
an argument to displayPhotos.
*/

async function selectedPhotos(dateChosen) {

    console.log(dateChosen);

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