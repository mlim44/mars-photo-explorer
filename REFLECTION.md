## Can I explain what my code does?
### Describe the functionality of your code and its components. How do your code segments work together to meet the project's objectives?

The project's objctive is to create a simple yet functional web application that will display Mars Rover Photos API based on the user's selected dates, and also includes a special feature of images taken from June 2018 when organic molecules were discovered.

The following components of my code were used to implement to achieve the project's goal:

#### fetchPhotos function
The function handles getting the data from the API by appending a date string (`dateString`) that it takes in as argument into the URL. 

The dateString argument is used to select the appropriate endpoint which could be the default value of 2017-07-24 or a user selected date. 

After appending the date, the data is retrieved from the endpoint and stored in the `response` variable which is then parsed as a JSON object using .json(). From the json object, the data is destructured into a `photos` object. The photos object is once again destructured in my return statement which would allow me to call the key value pair later in my `displayPhotos` function. Using the .slice method, only the first three objects is returned by the function. This creates a more efficient code as the function would only be storing first 3 photos in the object. 

Using a try-catch statement, the `fetchPhotos` function handles any error that may occur while the data is fetched by checking if the response is okay. The error is returned as a Windows alert box to inform the users that there was error retrieving the code. 

Another error handling implemented in this function is for any empty photos object. A windows alert box is also pops up alerting users that there were no photos captured that day.

#### displayPhotos function 
The function handles populating the images and the description of the page and images in the webpage based on the photos and description passed on it.

A general heading `<h2>` for the set of photos is populated on top of the photos and a description is displayed for each photos, showing the date they were taken, the photo id, and the camera that took the photo.

Using a forEach loop, each items in the photo object is itirated over to create a new `<p>` element and `<img>` element which is appended to the parent element of `#photos-container`. 

The function takes in two arguments, photos and description. The photos argument takes in a photos object created by the `fetchPhotos` function, and is used to retrieve the images's source, the date the photo was taken, and the photo id used to populate the photo and the photo's alt text and description. Meanwhile, The description is used to populated the galleries heading and a part of each image's description/alt text. 

#### loadInitialPhotos function and selectedPhotos
Both functions are used to call on the `fetchPhotos` and `displayPhotos` function. `loadInitialPhotos` allows the photos from the selected date to be populated in the webpage on load, and `displayPhotos` uses the values selected by the users to pass a description and date to the `fetchPhotos` and `displayPhotos` function.

`selectedPhotos` also takes in a date string argument which it uses to pass on the `fetchPhotos` function that is used to retrieve data from that date's endpoint. 

#### Load Button EventListener
The event listener takes in the value inputed by the user in the date input and calls on the `selectedPhotos` function which it then passes the date string on as an argument. 

The event listener is responsible for checking if the date is valid using the defined `validDate` explained below, and informing users of any errors using an alert box. When a valid date is received and checked, the date is then converted by the event listener into a string allowing its usage in the `selectedPhotos` and `fetchPhotos` function.

#### validDate EventListener
The `validDate` function was reused and reworked from the previous assignment, but a min and max date checking was added to ensure that only dates from the landing date and the most recently uploaded date is selected. 

## What was my coding process?
### Reflect on your approach from planning to execution. How did you organize your work, and what strategies did you employ?
I approached this assignment similar to how I approached the previous assignments. This time, however, I coded the entire website following the demo to see if it would work using my current understandig. 

Then, I implemented the assignment instructions one by one and pushed the changes to github one at a time for each component of the assignment. I think this helped ensure that I dont make the mistake of pushing to the wrong branch which prevented merging and pulling issues. 

I continued to use a copy of my repository when implementing something risky or new, allowing me to have a backup in case things go wrong and I mess up my original file. 

I also started to keep track of my coding process and challenges in my onenote so that it will be easier from me to remember events or problems I encountered when writing my reflection. 

## What challenges did I have?
### Identify and describe any obstacles you encountered while working on this project. How did you address or overcome these challenges?
I had many obstacles while working on this project. 

When I first created the fetchPhotos I followed the demo, but then I had to restructure 

but added the forEach in the return so I can use the object later in my loadPhotos. This created a typeError. After doing a bit of research, I found out that forEach does not return an object/array but only operates on an existing one (see code below):

        return photos.forEach(photo => {
            const { 
                img_src, 
                earth_date, 
                camera: { full_name } 
            } = photo;   
        })

What I needed to use is .map instead so that a new object is returned. By using `.map`, I can destrucuture the photos object and then take elements I need from the photos object and return it in a new photos object which would allow me to use the elements later in my displayPhotos function. 

While trying out different dates I encountered issues for endpoints/dates that did not contain any photos or had less than 3 photos. I didnt realize that there would be dates with no or less than three photos uploaded and I didnt include these scenarios in my code. 

Without error handling the empty photos object(no photo uploaded) such as May 5, 2022, the webpage was not generating any image and the users are left unaware that no photos are available that day. To handle this error, I added logic in my `fetchPhotos` to alert users that no photos were uploaded that day, but I also made sure that the gallery title/description is updated to inform the users that there will no photos generated.

For objects with less than 3 photos, no photos were being generated for the entire day and I was getting an error in console. This was because when I originally coded my destructuring, I destructured my I explicitly defined each photos using the following code:
 return [photo1, photo2, photo3].map(photo => {
            const { 
                id,
                camera: { full_name }, 
                earth_date, 
                img_src, 
            } = photo;
            return { id, full_name, earth_date, img_src };
        });

I found out that by doing this, my code is assuming that there is always going to be photo1, photo2, and photo3 when all I really wanted was to have limit the number of photos displayed. By using .slice, I am not explicitly telling my program to create these empty objects within my array and to only return at least the first three photos. 

## What would I do differently now?
### Given what you have learned through this project, what changes would you make to your approach or your code if you were to start over?

I am pretty satisfied with my approach this time as I think I learned a lot from my previous assignments' mistakes. I think the one thing I regret the most is that I worked on the assignment without fully understanding destructuring. I know we were told that we did not need to use it in the assignment, but I still wanted to try it out. 

I followed the destructuring in the class demo and the notes but it did not work in my code because the photos in the API was stored in an object and not an array and the photos then has an array of objects. I needed to access the photos oject from the response first and then destructure it in my return statement. 