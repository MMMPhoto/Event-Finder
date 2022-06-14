var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ";
var eventSubmit = document.querySelector(".event");

function handleSearch() {
    var info = document.getElementById('infoDisplay');
    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;
    // var family = document.querySelector('#familyInput').value;
    var day = document.querySelector('#dayInput').value;
    var year = document.querySelector('#yearInput').value;
    var month = document.querySelector('#monthInput').value;
    var radius = document.querySelector('#radiusInput').value;

    // Resets the right side info text area when another event is searched
    info.innerHTML = `<br><u>Event Info</u>`

    // API fetch
    console.log(city);
    let url;
    // Checks if User location is being used instead of city
    if (city == 'User Location') {
        let userLatLon = `${userLat},${userLon}`;
        url = `https://app.ticketmaster.com/discovery/v2/events.json?size=9&sort=date,asc&latlong=${userLatLon}&radius=${radius}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&apikey=${apiKey}`;
    } else {
        url = `https://app.ticketmaster.com/discovery/v2/events.json?size=9&sort=date,asc&city=${city}&radius=${radius}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&l&apikey=${apiKey}`;
    };

    fetch(url).then(data => data.json()).then(data => {

        jsonData = data;
        console.log(jsonData);
        displayEvents(jsonData);
        addEventMarkers(jsonData);
    });
};

function displayEvents(jsonData) {
    //This element begins as display: none. Changes it to flex when submit button is pressed
    document.getElementById("eventList").style.display = "flex";

    var eventHeader = document.querySelector('#eventHeader')
    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;


    if (mapNotVisible) {
        map.style.display = "block";
        generateMap(userLat, userLon);
        mapNotVisible = false;
    };
    //Changes the event header to the user's city and genre selection
    if (city == 'User Location') {
        city = 'Nearby';
        map.panTo(new L.LatLng(userLat, userLon));
        addUserMarker(userLat, userLon);
    };
    if (genre == "Musicals") {
        eventHeader.innerHTML = `<u>${city} ${genre}</u>`;
    } else {
        eventHeader.innerHTML = `<u>${city} ${genre} Events</u>`;
    };

    for (var x = 0; x < 9; x++) {

        //Targets the text area for the corresponding event 
        var eventDisplay = document.querySelector(`#event${x + 1}`);

        //Sets array for the date to rearrange it to be in mm/dd/yyyy format
        var arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
        var date = `${arr[1]}-${arr[2]}-${arr[0]}`;

        // Generates each listed event
        eventDisplay.innerHTML = `<button class="saveButton">Save</button>`;
        eventDisplay.innerHTML += `<p class="eventDisplay">${jsonData._embedded.events[x].name}</p>`;
        eventDisplay.innerHTML += `<p class="eventDisplay">${date}</p>`;
        eventDisplay.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p><br>`;
        // eventDisplay.innerHTML += `<p class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a></p></button>`;
        eventDisplay.innerHTML += `<span class="setBottom"><span class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a><button class="infoButton" value = "${x}" onclick="displayData(this.value)">Info</button></span></span>`;

    };

};

// Function for display info on the right side of screen
function displayData(value) {

    var x = value;
    var info = document.getElementById('infoDisplay');
    let directionsButton = document.createElement('div');
    let venueLat = `${jsonData._embedded.events[x]._embedded.venues[0].location.latitude}`;
    let venueLon = `${jsonData._embedded.events[x]._embedded.venues[0].location.longitude}`;
    

    info.innerHTML = `<p><b>${jsonData._embedded.events[x].name}</b></p>`;
    info.innerHTML += `<p><u>Venue</u> <br>${jsonData._embedded.events[x]._embedded.venues[0].name}</p>`;
    info.innerHTML += `<p><u>Price Range</u><br>$${jsonData._embedded.events[x].priceRanges[0].min} to $${jsonData._embedded.events[x].priceRanges[0].max}</p>`;
    // Add Button to get directions
    // info.appendChild(directionsButton);
    // directionsButton.innerHTML = `<button class="directionsButton" >Get Directions</button>`;
    // console.log(`venue lat lon is ${venueLat}, ${venueLon}`);
    // generateRouting(userLat, userLon);
}

// Set global map variables
let userLat;
let userLon;
let map = document.getElementById('map');
let mapNotVisible = true;
let eventLayerGroup;

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

// Generate map
let generateMap = (userLat, userLon) => {
    map = L.map('map').setView([userLat, userLon], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
};
// Generate user location marker
let addUserMarker = (userLat, userLon) => {
    L.marker([userLat, userLon]).addTo(map).bindTooltip('You are here');      
};
// Generate event location marker
let addEventMarkers = (jsonData) => {
    if (typeof eventLayerGroup !== 'undefined') {
        eventLayerGroup.clearLayers();
    };
    eventLayerGroup = L.featureGroup().addTo(map);
    for (i = 0; i < jsonData._embedded.events.length; i++) {
        let venueLat = jsonData._embedded.events[i]._embedded.venues[0].location.latitude;
        let venueLon = jsonData._embedded.events[i]._embedded.venues[0].location.longitude;
        marker = L.marker([venueLat, venueLon]).bindTooltip(`${jsonData._embedded.events[i].name}<br>${jsonData._embedded.events[i]._embedded.venues[0].name}`);
        eventLayerGroup.addLayer(marker);
    };
    map.fitBounds(eventLayerGroup.getBounds().pad(0.5));
};

// Create routing on map
// let generateRouting = (userLat, userLon) => {
//     // let graphHopperApiKey = '82f0f7e0-f73e-41bb-a6fb-f32fb15245dd'
//     L.Routing.control({
//         waypoints: [
//             L.latLng(userLat, userLon),
//             L.latLng(33.8261112, -84.2924226)
//         ],
//         lineOptions: {
//             styles: [{color: 'black'}]
//         },
//         // router: L.Routing.graphHopper('82f0f7e0-f73e-41bb-a6fb-f32fb15245dd')
//     }).addTo(map);
// };





















// let generateRouting = () => {
//     L.leafletControlRoutingtoaddress({
//         position: 'topright',
//         router: 'osrm',
//         token: '',
//         placeholder: 'Please insert your address here.',
//         errormessage: 'Address not valid.',
//         distance: 'Distance:',
//         duration: 'Driving Time:',
//         target: `${userLat},${userLon}`,
//         requesterror: '"Too Many Requests" or "Not Authorized - Invalid Token"'
//     }).addTo(map);
// };