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
})


}

function displayEvents(jsonData){

    var eventOne = document.querySelector('#eventOne');
    var eventTwo = document.querySelector('#eventTwo');
    var eventThree = document.querySelector('#eventThree');
    var eventFour = document.querySelector('#eventFour');
    var eventFive = document.querySelector('#eventFive');
    var eventSix = document.querySelector('#eventSix');
    var eventSeven = document.querySelector('#eventSeven');
    var eventEight = document.querySelector('#eventEight');
    var eventNine = document.querySelector('#eventNine');
    eventOne.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[0].name}</p>`;
    eventTwo.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[1].name}</p>`;
    eventThree.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[2].name}</p>`;
    eventFour.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[3].name}</p>`;
    eventFive.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[4].name}</p>`;
    eventSix.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[5].name}</p>`;
    eventSeven.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[6].name}</p>`;
    eventEight.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[7].name}</p>`;
    eventNine.innerHTML = `<p class="eventDisplay">${jsonData._embedded.events[8].name}</p>`;


}