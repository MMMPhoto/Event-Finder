var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ"
var eventSubmit = document.querySelector(".event");

function handleSearch() {
    var info = document.getElementById('info');
    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;
    // var family = document.querySelector('#familyInput').value;
    var day = document.querySelector('#dayInput').value;
    var year = document.querySelector('#yearInput').value;
    var month = document.querySelector('#monthInput').value;
    var radius = document.querySelector('#radiusInput').value;
    
   info.innerHTML= `<br><u>Event Info</u>`
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=9&sort=date,asc&city=${city}&radius=${radius}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&l&apikey=${apiKey}`

    fetch(url).then(data => data.json()).then(data => {

        jsonData = data;
        displayEvents(jsonData);
    })

}

function displayEvents(jsonData) {
    //This element begins as display: none. Changes it to flex when submit button is pressed
    document.getElementById("eventList").style.display = "flex";

    var eventHeader = document.querySelector('#eventHeader')
    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;

    //Changes the event header to the user's city and genre selection
    if(genre == "Musicals"){
        eventHeader.innerHTML = `<u>${city} ${genre}</u>`;
    }else{
    eventHeader.innerHTML = `<u>${city} ${genre} Events</u>`;
    }
    for (var x = 0; x < 9; x++) {
        
        //Sets the text area for the corresponding event 
        var eventDisplay = document.querySelector(`#event${x+1}`);
        
        //Sets array for the date to rearrange it to be in mm/dd/yyyy format
        var arr = jsonData._embedded.events[x].dates.start.localDate.split("-");
       
        var date = `${arr[1]}-${arr[2]}-${arr[0]}`;
        
        
        eventDisplay.innerHTML = `<button class="saveButton">Save</button>`
        eventDisplay.innerHTML += `<p class="eventDisplay">${jsonData._embedded.events[x].name}</p>`
        eventDisplay.innerHTML += `<p class="eventDisplay">${date}</p>`
        eventDisplay.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p><br>`;
        // eventDisplay.innerHTML += `<p class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a></p></button>`;
        eventDisplay.innerHTML += `<span class="setBottom"><span class = "eventTickets"><a href=${jsonData._embedded.events[x].url}>Buy Tickets</a><button class="infoButton" value = "${x}" onclick="displayData(this.value)">Info</button></span></span>`

    }
    
}


function displayData(value){
   
    var x = value
    var info = document.getElementById('info');
    
    
    info.innerHTML = `<p>${jsonData._embedded.events[x].name}</p>`
    info.innerHTML += `<p><u>Venue</u> <br>${jsonData._embedded.events[x]._embedded.venues[0].name}</p>`
    info.innerHTML += `<p><u>Price Range</u><br>$${jsonData._embedded.events[x].priceRanges[0].min} to $${jsonData._embedded.events[x].priceRanges[0].max}</p>`

}
