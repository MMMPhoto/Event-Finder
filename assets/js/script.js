var apiKey = "TcnFtVJuGcgL3ubSuuGQMpjlZcPwVVqZ"


function handleSearch() {

    var city = document.querySelector('#cityInput').value;
    var genre = document.querySelector('#genreInput').value;
    var family = document.querySelector('#familyInput').value;
    var date = document.querySelector('#dateInput').value;

    let url = `https://app.ticketmaster.com/discovery/v2/events.json?size=9&city=${city}&classificationName=${genre}&includeFamily=${family}&l&apikey=${apiKey}`

    fetch(url).then(data => data.json()).then(data => {

        jsonData = data;
        displayEvents(jsonData);
    })

}

function displayEvents(jsonData) {
   
    for (var x = 0; x < 9; x++) {
        
        var eventDisplay = document.querySelector(`#event${x+1}`);
        eventDisplay.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[x].name}</p>`
        eventDisplay.innerHTML += `<p class="eventImage"><img height="auto" width="200" src="${jsonData._embedded.events[x].images[0].url}"></p>`;

    }




}

