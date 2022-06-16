// API key and targeting variable
var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ";
var eventSubmit = document.querySelector(".event");

// Variables for manipulating what page of events the user is viewing
let x = 0;
let y = 9;

// Function to make the initial API call based on the input when the user clicks "Search"
function handleSearch() {
  var info = document.getElementById("infoDisplay");
  var city = document.querySelector("#cityInput").value;
  var genre = document.querySelector("#genreInput").value;
  // var family = document.querySelector('#familyInput').value;
  var day = document.querySelector("#dayInput").value;
  var year = document.querySelector("#yearInput").value;
  var month = document.querySelector("#monthInput").value;
  var radius = document.querySelector("#radiusInput").value;

  // Resets the right side info text area when another event is searched
  info.innerHTML = `<br><u>Event Info</u>`;

  // API fetch
  let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${y}&sort=date,asc&city=${city}&radius=${radius}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&l&apikey=${apiKey}`;

  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      jsonData = data;
      displayEvents(jsonData, x, y);
      console.log(jsonData);
    });
}

// Function to display the data from the API call in the center of the page
function displayEvents(jsonData, x, y) {
  var eventHeader = document.querySelector("#eventHeader");
  var city = document.querySelector("#cityInput").value;
  var genre = document.querySelector("#genreInput").value;
  //   var city = document.querySelector("#cityInput").value;
  //   var genre = document.querySelector("#genreInput").value;

  // Generates the "next" and "previous" buttons, and adds functionality to them
  eventHeader.innerHTML = `<button onclick="prevPage(jsonData)">Prev</button>     <u>${city} ${genre}</u>     <button onclick="nextPage(jsonData)">Next</button>`;

  // Clears the main page between pageovers
  let eventList = document.querySelector("#eventList");
  eventList.innerHTML = "";

  // "For" loop to create 9 results on the main page using the X and Y variables established above
  for (var x; x < y; x++) {
    //Sets array for the date to rearrange it to be in mm/dd/yyyy format
    var arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
    var date = `${arr[1]}-${arr[2]}-${arr[0]}`;

    //Creates the text area for the corresponding event
    eventList.innerHTML += `<div class="event" id="event${x + 1}"></div>`;

    var eventDisplay = document.querySelector(`#event${x + 1}`);

    // Populates each event
    eventDisplay.innerHTML = `<button class="saveButton">Save</button>`;
    eventDisplay.innerHTML += `<p class="eventDisplay">${jsonData._embedded.events[x].name}</p>`;
    eventDisplay.innerHTML += `<p class="eventDisplay">${date}</p>`;
    eventDisplay.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p><br>`;
    eventDisplay.innerHTML += `<span class="setBottom"><span class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a><button class="infoButton" value = "${x}" onclick="displayData(this.value)">Info</button></span></span>`;
  }
}

// Manipulates the X and Y variables upward to show the next 9 events from the API call
function nextPage(jsonData) {
  x = x + 9;
  y = y + 9;
  handleSearch(jsonData, x, y);
  return x, y;
}

// Manipulates the X and Y variables downward to show the previous 9 events from the API call
function prevPage(jsonData) {
  x = x - 9;
  y = y - 9;
  handleSearch(jsonData, x, y);
  return x, y;
}

// Function to run a second API call to retreive and display specific event info on the right side of screen when the "Info" button is clicked
function displayData(value) {
  var x = value;
  var info = document.getElementById("infoDisplay");

  // Generates the categories and fills them with info
  info.innerHTML = `<h4><b>${jsonData._embedded.events[x].name}</b></h4>`;
  info.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p>`;
  info.innerHTML += `<p id="nextShow"></p>`;
  info.innerHTML += `<p id="infoBar"></p>`;
  info.innerHTML += `<p><u>Venue</u>: <br>${jsonData._embedded.events[x]._embedded.venues[0].name}</p>`;
  info.innerHTML += `<p><u>Price Range</u>:<br>$${jsonData._embedded.events[x].priceRanges[0].min} to $${jsonData._embedded.events[x].priceRanges[0].max}</p>`;
  info.innerHTML += `<p id="pleaseNote"></p>`;
  info.innerHTML += `<p id="onSale"></p>`;
  info.innerHTML += `<p class = "eventTickets" onclick="window.open('${jsonData._embedded.events[x].url}')">Click to Purchase Tickets Now!</a></p></button>`;

  let nextShow = document.getElementById("nextShow");
  let onSale = document.getElementById("onSale");
  let infoBar = document.getElementById("infoBar");
  let pleaseNote = document.getElementById("pleaseNote");
  let id = jsonData._embedded.events[x].id;
  let url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apiKey}`;

  // Runs a second API call to get specific info about the event that was clicked
  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      addInfo = data;
      console.log(addInfo);
      let arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
      let date = `${arr[1]}-${arr[2]}-${arr[0]}`;
      let time = jsonData._embedded.events[x].dates.start.localTime;
      nextShow.innerHTML = `<u>Next Show Date</u>:<br>${date}<br></br><u>Next Show Time</u>:<br>${time}`;

      // Display nothing if the event is lacking the requested info
      infoBar.innerHTML = `<u>Info</u>:` + `<br>${addInfo.info}`;
      if (`${addInfo.info}` === "undefined") {
        infoBar.innerHTML = "";
      }

      pleaseNote.innerHTML +=
        `<p><u>Please Note</u>:<br>` + `${addInfo.pleaseNote}`;
      if (`${addInfo.pleaseNote}` === "undefined") {
        pleaseNote.innerHTML = "";
      }

      if (`${addInfo.dates.status.code}` == "onsale") {
        onSale.innerHTML = "<p><u>Tickets Available</u>?<br>Yes";
      } else {
        onSale.innerHTML = "<p><u>Tickets Available</u>?<br>No";
      }
    });
}

// Set global variables for the map
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
  map = L.map("map").setView([userLat, userLon], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);
};
// Generate user location marker
let addUserMarker = (userLat, userLon) => {
  L.marker([userLat, userLon]).addTo(map);
};
