/* =============== Script for Unsplash API =============== */

function setRandomBackground() {
    fetch('https://api.unsplash.com/photos/random?client_id=Y6JgNjvNw_pcLeWmJLj_b0K8oIBWJbvFgc7KWK6ZImY')
    .then(response => response.json())
    .then(data => {
        const imageUrl = data.urls.regular;
        document.getElementById('dashboard').style.backgroundImage = `url('${imageUrl}')`;
        localStorage.setItem('backgroundImage', imageUrl); // Save the image URL to local storage
    })
    .catch(error => console.error('Error fetching random image:', error));
}

// Function to load background image from local storage
function loadBackgroundFromLocalStorage() {
    const imageUrl = localStorage.getItem('backgroundImage');
    if (imageUrl) {
        document.getElementById('dashboard').style.backgroundImage = `url('${imageUrl}')`;
    }
}

// Call the function to load background image from local storage when the page loads
window.addEventListener('load', loadBackgroundFromLocalStorage);

// Add event listener to change background when button is clicked
document.getElementById('background-btn').addEventListener('click', setRandomBackground);





/* =============== Script for date and time =============== */

function updateTimeDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const formattedDateTime = now.toLocaleDateString('sv-SE', options);
    document.getElementById('time-date').textContent = formattedDateTime;
}

// Call the function to update time and date every second
setInterval(updateTimeDate, 1000);





/* =============== Script for user headline =============== */

// Get the h1 element
const h1Element = document.getElementById('user-h1');

// Retrieve saved content from local storage
const savedContent = localStorage.getItem('editableTitle');

// Set the initial content of h1 element
if (savedContent) {
    h1Element.textContent = savedContent;
}

// Function to save content to local storage
function saveContentToLocalStorage(content) {
    localStorage.setItem('editableTitle', content);
}

// Add click event listener to h1 element
h1Element.addEventListener('click', function() {
    // Create an input element
    const inputElement = document.createElement('input');

    // Set input value to current h1 content
    inputElement.value = h1Element.textContent;

    // Set input attributes
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('id', 'editable-title');

    // Replace h1 element with input element
    h1Element.replaceWith(inputElement);

    // Focus on the input element
    inputElement.focus();

    // Add blur event listener to input element
    inputElement.addEventListener('blur', function() {
        const inputValue = inputElement.value.trim(); // Remove leading/trailing whitespace

        // Check if input value is not empty
        if (inputValue !== '') {
            // Replace input element with h1 element
            inputElement.replaceWith(h1Element);
            
            // Update h1 content with input value
            h1Element.textContent = inputValue;

            // Save the updated content to local storage
            saveContentToLocalStorage(inputValue);
        } else {
            // If input is empty, revert to the previous content
            inputElement.replaceWith(h1Element);
        }
    });
});





/* =============== Script for links =============== */

function toggleInput() {
    var displayNameInput = document.getElementById("display-name-input");
    var linkInput = document.getElementById("link-input");
    var submitButton = document.getElementById("submit-button");
    if (displayNameInput.style.display !== "inline-block") {
        displayNameInput.style.display = "inline-block";
        linkInput.style.display = "inline-block";
        submitButton.style.display = "inline-block";
        // Change button text and icon
        document.getElementById("add-link-text").textContent = "Dölj formulär";
        document.getElementById("add-link-icon").classList.remove("fa-circle-plus");
        document.getElementById("add-link-icon").classList.add("fa-circle-minus")
    } else {
        displayNameInput.style.display = "none";
        linkInput.style.display = "none";
        submitButton.style.display = "none";
        // Change button text and icon
        document.getElementById("add-link-text").textContent = "Lägg till länk";
        document.getElementById("add-link-icon").classList.remove("fa-circle-minus");
        document.getElementById("add-link-icon").classList.add("fa-circle-plus");
    }
}

function addLink() {
    var displayName = document.getElementById("display-name-input").value.trim();
    var link = document.getElementById("link-input").value.trim();
    if (displayName === "" || link === "") {
        alert("Please enter both a display name and a valid URL.");
        return;
    }

    var ul = document.getElementById("quick-links");
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = link;
    a.textContent = displayName;
    a.target = "_blank"; // Open link in new tab
    
    // Fetch favicon
    var faviconUrl = 'https://www.google.com/s2/favicons?domain=' + link;
    var faviconImg = document.createElement("img");
    faviconImg.src = faviconUrl;
    faviconImg.classList.add("favicon");

    // Add delete button
    var deleteButton = document.createElement("span");
    deleteButton.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function() {
        ul.removeChild(li);
        saveLinksToLocalStorage(); // Update local storage after deletion
    };

    li.appendChild(faviconImg);
    li.appendChild(a);
    li.appendChild(deleteButton);
    ul.appendChild(li);

    // Clear input fields after adding the link
    document.getElementById("display-name-input").value = "";
    document.getElementById("link-input").value = "";

    // Hide input fields and submit button after adding the link
    document.getElementById("display-name-input").style.display = "none";
    document.getElementById("link-input").style.display = "none";
    document.getElementById("submit-button").style.display = "none";

    // Change button text and icon
    var addButton = document.getElementById("add-link");
    var buttonText = addButton.querySelector("span#add-link-text");
    var buttonIcon = addButton.querySelector("i#add-link-icon");
    buttonText.textContent = "Lägg till länk";
    buttonIcon.classList.remove("fa-circle-minus");
    buttonIcon.classList.add("fa-circle-plus");

    // Save links to local storage
    saveLinksToLocalStorage();
}

// Function to load links from local storage
function loadLinksFromLocalStorage() {
    var savedLinks = localStorage.getItem("quickLinks");
    if (savedLinks) {
        savedLinks = JSON.parse(savedLinks);
        var ul = document.getElementById("quick-links");
        ul.innerHTML = ""; // Clear existing links
        
        savedLinks.forEach(function(linkData) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = linkData.link;
            a.textContent = linkData.displayName;
            a.target = "_blank"; // Open link in new tab

            // Fetch favicon
            var faviconUrl = 'https://www.google.com/s2/favicons?domain=' + linkData.link;
            var faviconImg = document.createElement("img");
            faviconImg.src = faviconUrl;
            faviconImg.classList.add("favicon");

            // Add delete button with Font Awesome icon
            var deleteButton = document.createElement("span");
            deleteButton.innerHTML = '<i class="fa-solid fa-circle-minus"></i>'; // Font Awesome icon
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = function() {
                ul.removeChild(li);
                saveLinksToLocalStorage(); // Update local storage after deletion
            };

            li.appendChild(faviconImg);
            li.appendChild(a);
            li.appendChild(deleteButton);
            ul.appendChild(li);
        });
    }
}

// Function to save links to local storage
function saveLinksToLocalStorage() {
    var links = [];
    var quickLinks = document.getElementById("quick-links").getElementsByTagName("a");
    for (var i = 0; i < quickLinks.length; i++) {
        links.push({
            displayName: quickLinks[i].textContent,
            link: quickLinks[i].href
        });
    }
    localStorage.setItem("quickLinks", JSON.stringify(links));
}





/* =============== Script for notes =============== */

// Function to toggle note input field visibility
function toggleNoteInput() {
    var noteInput = document.getElementById("note-input");
    var submitButton = document.getElementById("note-submit-button");

    if (noteInput.style.display === "none" || noteInput.style.display === "") {
        noteInput.style.display = "block";
        submitButton.style.display = "inline-block"; // Show submit button
        // Change button text and icon
        document.getElementById("add-note-text").textContent = "Dölj formulär";
        document.getElementById("add-note-icon").classList.remove("fa-circle-plus");
        document.getElementById("add-note-icon").classList.add("fa-circle-minus");
    } else {
        noteInput.style.display = "none";
        submitButton.style.display = "none"; // Hide submit button
        // Change button text and icon
        document.getElementById("add-note-text").textContent = "Lägg till anteckning";
        document.getElementById("add-note-icon").classList.remove("fa-circle-minus");
        document.getElementById("add-note-icon").classList.add("fa-circle-plus");
    }
}

// Function to add note
function addNote() {
    var noteInput = document.getElementById("note-input");
    var noteText = noteInput.value.trim();
    if (noteText === "") {
        alert("Please enter a note.");
        return;
    }

    var ul = document.getElementById("note-list");
    var li = document.createElement("li");
    li.textContent = noteText;

    // Add delete button with Font Awesome icon
    var deleteButton = document.createElement("span");
    deleteButton.innerHTML = '<i class="fa-solid fa-circle-minus"></i>'; // Font Awesome icon
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = function() {
        ul.removeChild(li);
        saveNotesToLocalStorage(); // Update local storage after deletion
    };

    li.appendChild(deleteButton);
    ul.appendChild(li);

    // Clear input field after adding the note
    noteInput.value = "";

    // Hide note input field after adding the note
    toggleNoteInput();

    // Save notes to local storage
    saveNotesToLocalStorage();
}

// Function to save notes to local storage
function saveNotesToLocalStorage() {
    var notes = [];
    var noteList = document.getElementById("note-list");
    noteList.querySelectorAll("li").forEach(function(noteItem) {
        notes.push(noteItem.textContent);
    });
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Function to load notes from local storage
function loadNotesFromLocalStorage() {
    var notes = JSON.parse(localStorage.getItem("notes")) || [];
    var ul = document.getElementById("note-list");
    ul.innerHTML = ""; // Clear the current list
    notes.forEach(function(noteText) {
        var li = document.createElement("li");
        li.textContent = noteText;

        // Add delete button with Font Awesome icon
        var deleteButton = document.createElement("span");
        deleteButton.innerHTML = '<i class="fa-solid fa-circle-minus"></i>'; // Font Awesome icon
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = function() {
            ul.removeChild(li);
            saveNotesToLocalStorage(); // Update local storage after deletion
        };

        li.appendChild(deleteButton);
        ul.appendChild(li);
    });

    // Check if the note input field should be visible and update button text/icon accordingly
    var noteInput = document.getElementById("note-input");
    var buttonText = document.getElementById("add-note-text");
    var buttonIcon = document.getElementById("add-note-icon");
    if (noteInput.style.display === "block") {
        buttonText.textContent = "Dölj formulär";
        buttonIcon.classList.remove("fa-circle-plus");
        buttonIcon.classList.add("fa-circle-minus");
    } else {
        buttonText.textContent = "Lägg till anteckning";
        buttonIcon.classList.remove("fa-circle-minus");
        buttonIcon.classList.add("fa-circle-plus");
    }
}

// Load stored links and notes when the page loads
window.onload = function() {
    loadLinksFromLocalStorage();
    loadNotesFromLocalStorage();
};





/* =============== Script for Weather API =============== */

// Your OpenWeatherMap API key
const API_KEY = 'c862aec2d4f337c1bea38e36a2623cdc';

// Base URL for the OpenWeatherMap API
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// Function to fetch translations for weather descriptions
async function fetchTranslations() {
    try {
        const response = await fetch('Data/translations.json');
        if (!response.ok) {
            throw new Error('Failed to fetch translations');
        }
        const translations = await response.json();
        return translations;
    } catch (error) {
        console.error('Error fetching translations:', error);
        return null;
    }
}

// Function to generate HTML for weather forecast
async function generateWeatherHTML(weather_forecast, translations) {
    let html = '';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    for (const [date, info] of Object.entries(weather_forecast)) {
        let heading;

        // Determine the heading based on the date
        const forecastDate = new Date(date);

        if (forecastDate.toDateString() === today.toDateString()) {
            heading = "Idag";
        } else if (forecastDate.toDateString() === tomorrow.toDateString()) {
            heading = "Imorgon";
        } else {
            const options = { weekday: 'long' };
            heading = forecastDate.toLocaleDateString('sv-SE', options);
        }

        for (let i = 0; i < 1; i++) {
            // Fetch translation for weather description
            const translatedDescription = translations[info.description[i]] || info.description[i];
            html += `<li>
                        <img src="https://openweathermap.org/img/wn/${info.icon[i]}.png" alt="Weather Icon">
                        <h3>${heading}</h3>
                        <p><strong>H:</strong> ${Math.max(...info.temperature).toFixed(1)} °C <strong>L:</strong> ${Math.min(...info.temperature).toFixed(1)} °C</p>
                        <p><strong>${translatedDescription}</strong></p>
                    </li>`;
        }
    }
    return html;
}

// Function to display weather forecast
function displayWeatherForecast(weather_html) {
    const weatherForecastElement = document.getElementById('weatherForecast');
    weatherForecastElement.innerHTML = weather_html;
}

// Function to fetch weather data
function fetchWeatherData(latitude, longitude, translations) {
    // Make API request
    const API_URL = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    return fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Extract relevant information for today and the next three days
            const currentDate = new Date();
            const weather_forecast = {};
            data.list.forEach(forecast => {
                const forecastDate = new Date(forecast.dt_txt.split(' ')[0]); // Extract date
                const daysDifference = Math.ceil((forecastDate - currentDate) / (1000 * 60 * 60 * 24));
                
                if (daysDifference >= 0 && daysDifference <= 5) {
                    const date = forecast.dt_txt.split(' ')[0]; // Extract date
                    const hour = new Date(forecast.dt_txt).getHours(); // Extract hour
                    const temperature = forecast.main.temp - 273.15; // Temperature in Celsius
                    const weather_description = forecast.weather[0].description; // Description of weather
                    const weather_icon = forecast.weather[0].icon; // Weather icon

                    // Store data for each date
                    if (!(date in weather_forecast)) {
                        weather_forecast[date] = {
                            temperature: [],
                            description: [],
                            icon: []
                        };
                    }
                    weather_forecast[date].temperature.push(temperature);
                    weather_forecast[date].description.push(weather_description);
                    weather_forecast[date].icon.push(weather_icon);
                }
            });

            return generateWeatherHTML(weather_forecast, translations);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            return null; // Return null if there's an error
        });
}

// Function to get current location and fetch weather data
function getCurrentLocationAndWeather() {
    // Get current location
    navigator.geolocation.getCurrentPosition(
        position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Fetch translations
            fetchTranslations()
                .then(translations => {
                    if (translations !== null) {
                        // Fetch weather data
                        fetchWeatherData(latitude, longitude, translations)
                            .then(weather_html => {
                                if (weather_html !== null) {
                                    // Display weather forecast
                                    displayWeatherForecast(weather_html);
                                }
                            });
                    }
                });
        },
        error => {
            console.error("Error getting current location:", error);
        }
    );
}

// Call function to get current location and fetch weather data
getCurrentLocationAndWeather();

// Update weather data every hour
setInterval(() => {
    getCurrentLocationAndWeather();
}, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 milliseconds





/* =============== Script for News API =============== */

const apiKey = '1654f39cdb8b49fa8c4923d14f0326ad'; // Replace 'YOUR_API_KEY' with your actual News API key

const baseUrl = 'https://newsapi.org/v2/';
const endpoint = 'top-headlines';
const country = 'se';
const category = 'technology';

const url = `${baseUrl}${endpoint}?country=${country}&category=${category}&apiKey=${apiKey}`;

fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const articles = data.articles || [];
        const newsList = document.getElementById('news'); // Get the ul element by its id

        articles.forEach(article => {
        const li = document.createElement('li');

        // Create link to article
        const link = document.createElement('a');
        link.href = article.url;
        link.textContent = article.title;
        link.target = '_blank'; // Open link in new tab
        li.appendChild(link);

        // Create source element
        const source = document.createElement('p');
        source.textContent = `Source: ${article.source.name}`;
        li.appendChild(source);

        // Append the list item to the existing ul with id "news"
        newsList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('There was a problem fetching news:', error);
    });