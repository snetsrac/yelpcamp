# YelpCamp
YelpCamp is a web application that allows users to create and review campgrounds.

## Technologies Used
- HTML, CSS, JavaScript
- Node.js
- Express, EJS
- Bootstrap 5
- Mongodb
- Cloudinary
- Mapbox

## Features
### Session Management and Authentication
The app uses server-side session management. Each unique visit to the site causes a session document to be created and saved to Mongodb. This document stores all related session information, including flash messages and the authenticated user, if any. A session cookie is set in the browser, which is sent on all subsequent requests to associate the request to a particular session.

Unauthenticated users may view any campground or review, but may not create or modify their own. To access the full functionality of the site, users must log in. Authentication is handled using the Passport npm module with a local strategy. This means that users submit their username and password, which are then compared to the salted hash stored in the database using the PBKDF2 cryptographic algorithm.

### Campgrounds and Reviews
Authenticated users may create new campgrounds or leave a review for an existing campground. The creator/author of each campground or review is saved to the database, and only that user has the ability to edit or delete.

### Image Upload
While creating or editing a campground, users may upload one or more images. On the back-end, the images are uploaded to the Cloudinary cloud hosting platform using the Cloudinary API, and the returned url to the image is stored in the database.

### Geocoding and Map View
The app uses the Mapbox Geocoding API to determine the WGS84 coordinates of the location of the campground, which are stored in the database. The location of individual campgrounds is displayed in an interactive map on that campground's page. Additionally, the 'All Campgrounds' page displays a map of all campgrounds in the database, using Mapbox's clustering functionality.

## License
[MIT](https://choosealicense.com/licenses/mit/)
