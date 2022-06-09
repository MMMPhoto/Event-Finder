var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ"


function handleSearch() {

    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;
    var family = document.querySelector('#familyInput').value;
    var day = document.querySelector('#dayInput').value;
    var year = document.querySelector('#yearInput').value;
    var month = document.querySelector('#monthInput').value;
    // var date = document.querySelector('#dateInput').value;

    let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=9&sort=date,asc&city=${city}&startDateTime=${year}-${month}-${day}T14:00:00Z&classificationName=${genre}&l&apikey=${apiKey}`

    fetch(url).then(data => data.json()).then(data => {

        jsonData = data;
        displayEvents(jsonData);
    })

}

function displayEvents(jsonData) {
    document.getElementById("eventList").style.display = "flex";
    for (var x = 0; x < 9; x++) {
        
        var eventDisplay = document.querySelector(`#event${x+1}`);
        eventDisplay.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[x].name}</p>`
        eventDisplay.innerHTML += `<p class="eventDisplay">${jsonData._embedded.events[x].dates.start.localDate}</p>`
        eventDisplay.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p>`;

    }




}

