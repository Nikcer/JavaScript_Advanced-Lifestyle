import '../css/style.css';
import axios from 'axios';
import _ from 'lodash';
import {cityNameInput,summaryElement,resultElement,erroreElement,initElement,titleScore,nameElement} from './elements';

const API_URL = process.env.API_URL;


//Show and hide element in the initial page
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
function CityExists(cityName) {
  axios.get(`${API_URL}slug:${cityName}/scores/`)
    .then(response => {
      const data = response.data;
      const categories = _.get(data, 'categories');
      const summary = _.get(data, 'summary');
      const teleportCityScore = _.get(data, 'teleport_city_score');

      let resultHTML = "";
      let summaryHTML = "";
      const cityNameUpperCase = cityName.toUpperCase() + ` is ${teleportCityScore.toFixed(1)}/100`;

      summaryHTML += `<h3>Summary:</h3> <p>${summary}</p>`;

      resultHTML += "<h3>Score:</h3>";
      categories.forEach(category => {
        const score = _.get(category, 'score_out_of_10').toFixed(1);
        resultHTML += `<p>${_.get(category, 'name')}: ${score}/10 </p>`;
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
      alert("Error, Please try again.");
    });
}

function CityNotExists() {
  erroreElement.innerHTML = "This city is not available, please try again!";
  erroreElement.style.display = 'block';
  initElement.style.display = "none";
  nameElement.style.display = "none";
  summaryElement.style.display = "none";
  resultElement.style.display = 'none';
  titleScore.style.display = "none";
}

function Response(response) {
  if (response.status === 200) {
    const cityName = fixName(cityNameInput.value);
    CityExists(cityName);
  } else if (response.status === 404) {
    CityNotExists();
  } else {
    alert("Error, Please try again later.");
  }
}

function getCity(event) {
  event.preventDefault();

  const cityName = fixName(cityNameInput.value);

  if (!cityName) {
    alert("Please enter a city name");
    return;
  }

  axios.head(`${API_URL}slug:${cityName}/`)
    .then(response => {
      Response(response);
    })
    .catch(error => {
      CityNotExists()
      
    });
}



//Event listeners
searchButton.addEventListener("click", getCity);
cityNameInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getCity(event);
  }
});