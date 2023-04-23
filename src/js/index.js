import '../css/style.css';
import axios from 'axios';
import _ from 'lodash';


const API_URL = process.env.API_URL; //https://api.teleport.org/api/urban_areas/



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


function fixName(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, "-");
}

function getCity(event) {
  event.preventDefault();

  const cityName = fixName(cityNameInput.value);

  if (!cityName) {
    alert("Please enter a city name");
    return;
  }

  axios.get(`https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`)
    .then(response => {
      const data = response.data;
      const categories = _.get(data, 'categories', []);
      const summary = _.get(data, 'summary', '');
      const teleportCityScore = _.get(data, 'teleport_city_score', 0);

      let resultHTML = "";
      let summaryHTML = "";
      const cityNameUpperCase = cityNameInput.value.toUpperCase() + ` is ${teleportCityScore.toFixed(1)}/100`;

      summaryHTML += `<h3>Summary:</h3> <p>${summary}</p>`;

      resultHTML += "<h3>Score:</h3>";
      categories.forEach(category => {
        const score = _.get(category, 'score_out_of_10', 0).toFixed(1);
        resultHTML += `<p>${_.get(category, 'name', '')}: ${score}/10 </p>`;
      });

      nameElement.innerHTML = cityNameUpperCase;
      summaryElement.innerHTML = summaryHTML;
      resultElement.innerHTML = resultHTML;
      nameElement.style.display = "block";
      summaryElement.style.display = "block";
      resultElement.style.display = 'block';
      erroreElement.style.display = 'none';
      initElement.style.display = "none";
      titleScore.style.display = "block"; 
    })
    .catch(error => {
      erroreElement.innerHTML = "This city is not available, please try again!";
      resultElement.style.display = "none";
      summaryElement.style.display = "none";
      erroreElement.style.display = 'block';
      initElement.style.display = "none";
      titleScore.style.display = "none";
    });
}




searchButton.addEventListener("click", getCity);
cityNameInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getCity(event);
  }
});
