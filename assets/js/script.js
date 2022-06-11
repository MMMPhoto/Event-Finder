var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ"
// var city = document.querySelector('#cityInput').value
// let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=${apiKey}`

function handleSearch(){

    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;
    var family = document.querySelector('#familyInput').value;
    
console.log(city);

    let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=9&city=${city}&classificationName=${genre}&includeFamily=${family}&apikey=${apiKey}`

fetch(url).then (data=>data.json()).then (data =>{

    jsonData = data;
    displayEvents(jsonData);
    console.log()
})

}

function displayEvents(jsonData){
    displayEventOne(jsonData);
    displayEventTwo(jsonData);
    displayEventThree(jsonData);
    displayEventFour(jsonData);
    displayEventFive(jsonData);
    displayEventSix(jsonData);
    displayEventSeven(jsonData);
    displayEventEight(jsonData);
    displayEventNine(jsonData);
}

function displayEventOne(jsonData){
    var eventOne = document.querySelector('#eventOne');
    eventOne.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[0].name}</p>`;
    // $("#eventOne").html(`<div class = "event" style = "background-image: url('${jsonData._embedded.events[0].images[0].url}'); background-size: 100% 100%">`);
    $("#eventOne").attr("style", `background-image: url('${jsonData._embedded.events[0].images[1].url}') ` )
    // $("#eventOne").attr("style",  "background-size: 100% 100%" )
}

function displayEventTwo(jsonData){
    var eventTwo = document.querySelector('#eventTwo');
    eventTwo.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[1].name}</p>`;
    // eventTwo.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[1].images[0].url}"></p>`;
    $("#eventTwo").attr("style", `background-image: url('${jsonData._embedded.events[1].images[1].url}') ` )
}

function displayEventThree(jsonData){
    var eventThree = document.querySelector('#eventThree');
    eventThree.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[2].name}</p>`;
    // eventThree.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[2].images[0].url}"></p>`;
    $("#eventThree").attr("style", `background-image: url('${jsonData._embedded.events[2].images[1].url}') ` )
}

function displayEventFour(jsonData){
    var eventFour = document.querySelector('#eventFour');
    eventFour.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[3].name}</p>`;
    // eventFour.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[3].images[0].url}"></p>`;
    $("#eventFour").attr("style", `background-image: url('${jsonData._embedded.events[3].images[2].url}') ` )
}

function displayEventFive(jsonData){
    var eventFive = document.querySelector('#eventFive');
    eventFive.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[4].name}</p>`;
    // eventFive.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[4].images[0].url}"></p>`;
    $("#eventFive").attr("style", `background-image: url('${jsonData._embedded.events[4].images[2].url}') ` )
}

function displayEventSix(jsonData){
    var eventSix = document.querySelector('#eventSix');
    eventSix.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[5].name}</p>`;
    // eventSix.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[5].images[0].url}"></p>`;
    $("#eventSix").attr("style", `background-image: url('${jsonData._embedded.events[5].images[0].url}') ` )
}

function displayEventSeven(jsonData){
    var eventSeven = document.querySelector('#eventSeven');
    eventSeven.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[6].name}</p>`;
    // eventSeven.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[6].images[0].url}"></p>`;
    $("#eventSeven").attr("style", `background-image: url('${jsonData._embedded.events[6].images[0].url}') ` )
}

function displayEventEight(jsonData){
    var eventEight = document.querySelector('#eventEight');
    eventEight.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[7].name}</p>`;
    // eventEight.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[7].images[0].url}"></p>`;
    $("#eventEight").attr("style", `background-image: url('${jsonData._embedded.events[7].images[1].url}') ` )
}

function displayEventNine(jsonData){
    var eventNine = document.querySelector('#eventNine');
    eventNine.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[8].name}</p>`;
    // eventNine.innerHTML += `<p class="eventDisplay"><img height="auto" width=200" src="${jsonData._embedded.events[8].images[0].url}"></p>`;
    $("#eventNine").attr("style", `background-image: url('${jsonData._embedded.events[8].images[4].url}') ` )
}

// Set global variables
let userLat;
let userLon;

// Get user's location by lat long
let positionSuccess = (position) => {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;
    generateMap(userLat, userLon);
    addUserMarker(userLat, userLon);
    console.log(`User's position is: Lat: ${userLat}, Lon: ${userLon}`);
};
let positionError = (err) => {
    console.log(err.code);
};
navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

// Generate map
let generateMap = (userLat, userLon) => {
    map = L.map('map').setView([userLat, userLon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
};
// Generate user location marker
let addUserMarker = (userLat, userLon) => {
    L.marker([userLat, userLon]).addTo(map);
};

