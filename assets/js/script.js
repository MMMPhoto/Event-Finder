var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ";
var eventSubmit = document.querySelector(".event");
let x = 0;
let y = 9;
let jsonData = []

function handleSearch() {
 
    var info = document.getElementById('infoDisplay');
    info.innerHTML="";
    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;
    // var family = document.querySelector('#familyInput').value;
    var day = document.querySelector('#dayInput').value;
    var year = document.querySelector('#yearInput').value;
    var month = document.querySelector('#monthInput').value;
    var radius = document.querySelector('#radiusInput').value;

    // Resets the right side info text area when another event is searched
    // info.innerHTML = `<br><u>Event Info</u>`
    
    // API fetch
    console.log(city);
    let url;
    // Checks if User location is being used instead of city
    if (city == 'User Location') {
        let userLatLon = `${userLat},${userLon}`;  
        url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${y}&sort=date,asc&latlong=${userLatLon}&radius=${radius}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&apikey=${apiKey}`;
    } else {
        url = `https://app.ticketmaster.com/discovery/v2/events.json?size=${y}&sort=date,asc&city=${city}&radius=${radius}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&l&apikey=${apiKey}`;

    };

    fetch(url).then(data => data.json()).then(data => {

        jsonData = data;
        // console.log(jsonData,data);
        console.log(jsonData);
        displayEvents(jsonData,x,y);
        addEventMarkers(jsonData);
        
    });
   
};

function displayEvents(jsonData,x,y) {
    var eventHeader = document.querySelector('#eventHeader')
   
    //This element begins as display: none. Changes it to flex when submit button is pressed
    document.getElementById("eventList").style.display = "flex";
   
    
    var city = jsonData._embedded.events[0]._embedded.venues[0].city.name
    var genre = document.querySelector('#genreInput').value;
    let cityInput = document.getElementById('cityInput');

    if (mapNotVisible) {
        map.style.display = "block";
        generateMap(userLat, userLon);
        mapNotVisible = false;
    };
    //Changes the event header to the user's city and genre selection
    if (cityInput.value == 'User Location') {
        map.panTo(new L.LatLng(userLat, userLon));
        addUserMarker(userLat, userLon);
    };
    if (genre == "Musicals") {
      eventHeader.innerHTML = `<button class="pageButton" onclick="prevPage(jsonData)">Prev</button>     ${city} ${genre}     <button class="pageButton"  onclick="nextPage(jsonData)">Next</button>`;

    } else {
      eventHeader.innerHTML = `<button class="pageButton"  onclick="prevPage(jsonData)">Prev</button>     ${city} ${genre} Events<button  class="pageButton" onclick="nextPage(jsonData)">Next</button>`;
    };
  
  


    let eventList = document.querySelector("#eventList");
    eventList.innerHTML = "";
    console.log(x,y);
    for (var x; x < y; x++) {
      
      var arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
      var date = `${arr[1]}-${arr[2]}-${arr[0]}`;
      eventList.innerHTML += `<div class="event" id="event${x + 1}"></div>`;
        //Targets the text area for the corresponding event 
        var eventDisplay = document.querySelector(`#event${x + 1}`);

        //Sets array for the date to rearrange it to be in mm/dd/yyyy format
        
       

        // Generates each listed event
        eventDisplay.innerHTML = `<button class="saveButton">Save</button>`;
        eventDisplay.innerHTML += `<p class="eventDisplay" p id= "eventName">${jsonData._embedded.events[x].name}</p>`;
        eventDisplay.innerHTML += `<p class="eventDisplay" p id= "eventDate">${date}</p>`;
        $(`#event${x + 1}`).attr("style", `background-image: url('${jsonData._embedded.events[x].images[2].url}') ` )
        // eventDisplay.innerHTML += `<p class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a></p></button>`;
        eventDisplay.innerHTML += `<span class="info-button"><span class = "eventTickets"><a href="${jsonData._embedded.events[x].url}" target="_blank">Buy Tickets</a><button class="infoButton" value = "${x}" onclick="displayData(this.value)">Info</button></span></span>`;
        $(`#article`).css('background-image', 'none');
    };
    addSaveListeners();
};

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
    var info = document.getElementById('infoDisplay');
    

  info.innerHTML = `<h4 class="infoStyle"><b>${jsonData._embedded.events[x].name}</b></h4>`;
  info.innerHTML += `<p class="eventImage infoStyle"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p>`;
  info.innerHTML += `<p id="nextShow" class="infoStyle"></p>`;
  info.innerHTML += `<p id="infoBar" class="infoStyle"></p>`;
  info.innerHTML += `<p class="infoStyle"><u>Venue</u>: <br>${jsonData._embedded.events[x]._embedded.venues[0].name}</p>`;
  if(jsonData._embedded.events[x].priceRanges != undefined){
           maxPrice = jsonData._embedded.events[x].priceRanges[0].max;
           minPrice = jsonData._embedded.events[x].priceRanges[0].min;
           info.innerHTML += `<p class="infoStyle"><u>Price Range</u><br>$` + Math.round(minPrice) + ` to ` + `$` + Math.round(maxPrice) + `</p>`
    }else{
        info.innerHTML += `<p class="infoStyle"><u>Price Range</u><br>Ticket price not available</p>`
    }  info.innerHTML += `<p id="pleaseNote" class="infoStyle"></p>`;
  info.innerHTML += `<p id="onSale" class="infoStyle"></p>`;
  info.innerHTML += `<button id="ticketButton" onclick="window.open('${jsonData._embedded.events[x].url}')">Click to Purchase Tickets Now!</p></button>`;

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
      time = time.split(':');
        var hours = Number(time[0]);
        var minutes = Number(time[1]);
        var seconds = Number(time[2]);


var timeValue;

if (hours > 0 && hours <= 12) {
  timeValue= "" + hours;
} else if (hours > 12) {
  timeValue= "" + (hours - 12);
} else if (hours == 0) {
  timeValue= "12";
}
 
timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes; 
timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds; 
timeValue += (hours >= 12) ? " P.M." : " A.M."; 

      nextShow.innerHTML = `<u>Next Show Date</u>:<br>${date}<br></br><u>Next Show Time</u>:<br>${timeValue}`;

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

//function to get all save buttons from search results
<<<<<<< HEAD
function addSaveListeners()
=======
function addSaveListeners() {
  console.log("jsonData",jsonData)
>>>>>>> c2d3bf1481b886e697017aedbc0f3cda2b7c3946
    //variable set to find all the save buttons
    var allSavebuttons = document.getElementsByClassName("saveButton")
   /* console.log(allSavebuttons)
    for (i=0; i < allSavebuttons.length; i++) {
        var title = allSavebuttons[i].nextElementSibling.textContent
        console.log(title)
        // allSavebuttons[i].addEventListener("click", addLocalStorage.bind(null,title))
        
    }*/
    jsonData?._embedded?.events?.forEach((item,i)=>{
      allSavebuttons[i].addEventListener("click", addSessionStorage.bind(null,item))
    })
    
}
function addSessionStorage(input) {
  console.log(input)
  const sessionItems = JSON.parse(sessionStorage.getItem("selectedTitle")) || []
  sessionStorage.setItem("selectedTitle", JSON.stringify([...sessionItems,input]));
  displayTitles()
}
// function addLocalStorage(input) {
//     //console.log(input)
//     localStorage.setItem("selectedTitle", input);
//     displayTitles()
// }

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
     map.scrollWheelZoom.disable();
};
// Generate user location marker
let addUserMarker = (userLat, userLon) => {
    let userIcon = L.icon ({
        iconUrl: "./assets/leaflet/images/marker-icon.png",
        className: 'red-shift'
    });
    // userIcon.classname = "red-shift";
    L.marker([userLat, userLon], {icon: userIcon}).addTo(map).bindTooltip('You are here');      
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

//Fucntion displays titles from local storage to left side of page
function displayTitles() {
    var saveTitles = document.getElementById("saveTitle")
    saveTitles.innerHTML = ""
    
    // selectedTitles variable is storing the array of selected titles from session storage
    var selectedTitles = JSON.parse(sessionStorage.getItem("selectedTitle"))
    console.log(selectedTitles,jsonData)
    
    if (selectedTitles !== null){
selectedTitles.forEach((titleData)=>{
  saveTitles.innerHTML += `<li id="sidebuttons"><button onclick="window.open('${titleData?.url}')">${titleData?.name}</button></li>`;

})
        // saveTitles.innerHTML += (`<li>${selectedTitle}</li>`)
    }
}
displayTitles();


console.log(jsonData)