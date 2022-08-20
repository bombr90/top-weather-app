import "./style.css";
/* eslint quotes: 0, no-console: 0, no-use-before-define: 0 */

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const locationHeader = document.getElementById('location');
const cards = document.getElementById('cards');

searchButton.addEventListener('click', queryLocation);

const init = (() => {
  console.log('initialized');
  queryLocation();
})();

async function queryLocation() {
  const data = await getLocation(parseInput(), parseUnits());
  if (data) {
    renderLocationHeader(data.location);
    renderWeather(data.weather);
    renderWeatherIcon(data.icon);
  } else {
    alert("Invalid location, please try again.");
  }
}

function parseInput() {
  const keyword = searchInput.value || "London";
  searchInput.value = "";
  return keyword;
}

function parseUnits() {
  const unit = document.querySelector('input[name="unit"]:checked');
  return unit.value;
}

async function getLocation(location, units) {
  try {
    let data = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${units}&APPID=17049aa4ddcf341e5978b7577034c23a`,
      { mode: "cors" },
    );
    if (data.ok === false) return false;
    data = await data.json();
    return filterData(data);
  } catch (err) {
    console.log(err);
  }
}

function renderWeather(data) {
  cards.replaceChildren();
  const card = document.createElement('div');
  card.classList.add('card');
  const keys = Object.keys(data);
  keys.forEach((key) => {
    const keyDiv = document.createElement('div');
    keyDiv.style.textAlign = 'right';
    const valueDiv = document.createElement("div");
    const dataKey = document.createTextNode(`${key}:`);
    const dataValue = document.createTextNode(`${data[key]}`);
    keyDiv.appendChild(dataKey);
    valueDiv.appendChild(dataValue);
    card.appendChild(keyDiv);
    card.appendChild(valueDiv);
  });

  cards.appendChild(card);
}

function renderLocationHeader(data) {
  const header = document.createTextNode(`${data.city}, ${data.country}`);
  locationHeader.replaceChildren(header);
}

function renderWeatherIcon(code) {
  const icon = document.createElement('img');
  icon.classList.add('image');
  icon.src = `https://openweathermap.org/img/w/${code}.png`;
  cards.firstElementChild.appendChild(icon);
}

function filterData(data) {
  let tUnit;
  let wUnit;

  if (parseUnits() === 'metric') {
    tUnit = 'C';
    wUnit = 'm/s';
  } else {
    tUnit = 'F';
    wUnit = 'mph';
  }

  const filteredData = {
    icon: data.weather[0].icon,
    location: {
      city: data.name,
      country: data.sys.country,
    },
    weather: {
      Temperature: `${data.main.temp} ${tUnit}`,
      "Feels Like": `${data.main.feels_like} ${tUnit}`,
      Condition: data.weather[0].main,
      Wind: `${data.wind.speed} ${wUnit}`,
      Humidity: `${data.main.humidity} %`,
    },
  };
  return filteredData;
}
