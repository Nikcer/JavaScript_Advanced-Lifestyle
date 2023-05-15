import '../css/style.css';
import axios from 'axios';
/* import _ from 'lodash'; */
import {cityNameInput,summaryElement,resultElement,erroreElement,initElement,titleScore,nameElement} from './elements';
const _get = require('lodash/get');
const API_URL = process.env.API_URL;
let citiesList = [];

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

(async function downloadCities() {
  try {
    const response = await axios.get(`https://api.teleport.org/api/urban_areas/`);
    
    if (response.status === 404) {
      throw new Error("Download Error");
    }

    citiesList =  await _get(response, "data._links.ua:item", "Download Error");  

  } catch (error) {
    alert(error.message);
  }})();



//Retrieves city data from the Teleport API and displays it on the page
function handleCityExists(cityName) {
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
      if (error.response && error.response.status === 404) {
        alert("Error 404, please try again.");
      }else{
        alert("Error, Please try again.")
        
      }
      
    });
}

function handleCityNotExists() {
  erroreElement.innerHTML = "This city is not avaiable, please try again!";
  erroreElement.style.display = 'block';
  initElement.style.display = "none";
  nameElement.style.display = "none";
  summaryElement.style.display = "none";
  resultElement.style.display = 'none';
  titleScore.style.display = "none";
}


async function getCity(event) {
  event.preventDefault();

  const cityNameList = cityNameInput.value;

  if (!cityNameList) {
    alert("Please enter a city name");
    return;
  }

  const cityLink = citiesList.find(city => city.name.toLowerCase() === cityNameList.toLowerCase());

  if (cityLink) {
    
    const cityName = fixName(cityNameInput.value);
    handleCityExists(cityName)
    
  } else {
    
    handleCityNotExists();
  }
}

//Event listeners
searchButton.addEventListener("click", getCity);
cityNameInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    getCity(event);
  }
});