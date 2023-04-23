import '../css/style.css';
import axios from 'axios';
import _ from 'lodash';


const API_URL = process.env.API_URL;



const cityNameInput = document.getElementById("getInput");
      const summaryElement = document.getElementById("summary");
      const resultElement = document.getElementById("result");
      const erroreElement = document.getElementById("errore");
      const initElement = document.getElementById("initialPage");
      const titleScore = document.getElementById("title-score");
      const nameElement = document.getElementById("city-name");


      titleScore.style.display = "none";
      summaryElement.style.display = "none";
      resultElement.style.display = "none";
      erroreElement.style.display = "none";
      initElement.style.display="block";
      nameElement.style.display = "none"; 

//Replaces whitespace characters with hyphens and converts the string to lowercase.
function fixName(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, "-");
}

//Retrieves city data from the Teleport API and displays it on the page
function getCity(event) {
  event.preventDefault();

  const cityName = fixName(cityNameInput.value); //Get the city name from the input field and fixes the casing

  if (!cityName) {                      //If the city name is not provided, show an alert and return
    alert("Please enter a city name");
    return;
  }

  axios.get(`${API_URL}slug:${cityName}/scores/`)   //Make a GET request to the Teleport API
    .then(response => {
      const data = response.data;                            // Extract the response data                                                                                                      
      const categories = _.get(data, 'categories');         //Get categories, summary and teleport_city_score
      const summary = _.get(data, 'summary');              //from response
      const teleportCityScore = _.get(data, 'teleport_city_score');

      let resultHTML = "";
      let summaryHTML = "";  //Inizialize an empty string for resultHTML and summaryHTML
      const cityNameUpperCase = cityNameInput.value.toUpperCase() + ` is ${teleportCityScore.toFixed(1)}/100`; //Create a string that displays the city name and its score


      summaryHTML += `<h3>Summary:</h3> <p>${summary}</p>`; //Add summary to the summary_HTML

      resultHTML += "<h3>Score:</h3>";
      categories.forEach(category => {  //Loop through each category in the categories array
        const score = _.get(category, 'score_out_of_10').toFixed(1); //Get the score for the category
        resultHTML += `<p>${_.get(category, 'name')}: ${score}/10 </p>`; //Add the category name and score to the result HTML
      });

      nameElement.innerHTML = cityNameUpperCase; //Set the city name and score as the inner HTML of the name element
      summaryElement.innerHTML = summaryHTML;    //Set the summaryHTML as the inner HTML of the summarycelement
      resultElement.innerHTML = resultHTML;      //Set the resultHTML as the inner HTML of the resultelement

      //Show or hide element
      nameElement.style.display = "block";
      summaryElement.style.display = "block";
      resultElement.style.display = 'block';
      erroreElement.style.display = 'none';
      initElement.style.display = "none";
      titleScore.style.display = "block"; 
    })
    .catch(error => { //If there's an error with the GET request set a message error
      erroreElement.innerHTML = "This city is not available, please try again!";
      resultElement.style.display = "none";
      summaryElement.style.display = "none";
      erroreElement.style.display = 'block';
      initElement.style.display = "none";
      titleScore.style.display = "none";
    });
}



//Event listeners
searchButton.addEventListener("click", getCity);
cityNameInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getCity(event);
  }
});
