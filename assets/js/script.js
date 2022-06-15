var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ";
var eventSubmit = document.querySelector(".event");
let x = 0;
let y = 9;

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

function displayEvents(jsonData, x, y) {
  //This element begins as display: none. Changes it to flex when submit button is pressed
  // document.getElementById("eventList").style.display = "flex";
  var eventHeader = document.querySelector("#eventHeader");
  var city = document.querySelector("#cityInput").value;
  var genre = document.querySelector("#genreInput").value;
  //   var city = document.querySelector("#cityInput").value;
  //   var genre = document.querySelector("#genreInput").value;

  //Sets array for the date to rearrange it to be in mm/dd/yyyy format
  var arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
  var date = `${arr[1]}-${arr[2]}-${arr[0]}`;

  eventHeader.innerHTML = `<button onclick="prevPage(jsonData)">Prev</button>     <u>${city} ${genre}</u>     <button onclick="nextPage(jsonData)">Next</button>`;

  let eventList = document.querySelector("#eventList");
  eventList.innerHTML = "";
  for (var x; x < y; x++) {
    //Targets the text area for the corresponding event

    eventList.innerHTML += `<div class="event" id="event${x + 1}"></div>`;

    var eventDisplay = document.querySelector(`#event${x + 1}`);

    // Generates each listed event
    eventDisplay.innerHTML = `<button class="saveButton">Save</button>`;
    eventDisplay.innerHTML += `<p class="eventDisplay">${jsonData._embedded.events[x].name}</p>`;
    eventDisplay.innerHTML += `<p class="eventDisplay">${date}</p>`;
    eventDisplay.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p><br>`;
    // eventDisplay.innerHTML += `<p class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a></p></button>`;
    eventDisplay.innerHTML += `<span class="setBottom"><span class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a><button class="infoButton" value = "${x}" onclick="displayData(this.value)">Info</button></span></span>`;
  }
}

function nextPage(jsonData) {
  x = x + 9;
  y = y + 9;
  handleSearch(jsonData, x, y);
  return x, y;
}

function prevPage(jsonData) {
  x = x - 9;
  y = y - 9;
  handleSearch(jsonData, x, y);
  return x, y;
}

// Function for display info on the right side of screen
function displayData(value) {
  var x = value;
  var info = document.getElementById("infoDisplay");

  info.innerHTML = `<h4><b>${jsonData._embedded.events[x].name}</b></h4>`;
  info.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p>`;
  info.innerHTML += `<p id="nextShow"></p>`;
  info.innerHTML += `<p id="infoBar"></p>`;
  info.innerHTML += `<p><u>Venue</u>: <br>${jsonData._embedded.events[x]._embedded.venues[0].name}</p>`;
  info.innerHTML += `<p><u>Price Range</u>:<br>$${jsonData._embedded.events[x].priceRanges[0].min} to $${jsonData._embedded.events[x].priceRanges[0].max}</p>`;
  info.innerHTML += `<p id="pleaseNote"></p>`;
  info.innerHTML += `<p id="onSale"></p>`;

  let nextShow = document.getElementById("nextShow");
  let onSale = document.getElementById("onSale");
  let infoBar = document.getElementById("infoBar");
  let pleaseNote = document.getElementById("pleaseNote");
  let id = jsonData._embedded.events[x].id;
  let url = `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${apiKey}`;

  fetch(url)
    .then((data) => data.json())
    .then((data) => {
      addInfo = data;
      console.log(addInfo);
      let arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
      let date = `${arr[1]}-${arr[2]}-${arr[0]}`;
      let time = jsonData._embedded.events[x].dates.start.localTime;
      nextShow.innerHTML = `<u>Next Show Date</u>:<br>${date}<br></br><u>Next Show Time</u>:<br>${time}`;

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
