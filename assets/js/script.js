let userLat;
let userLon;


// Get user's location by lat long
let positionSuccess = (position) => {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
    console.log(`User's position is: Lat: ${userLat}, Lon: ${userLon}`);
};
let positionError = (err) => {
    console.log(err.code);
};
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);