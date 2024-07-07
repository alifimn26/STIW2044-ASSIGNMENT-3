

// Global variable for the chart instance
let hourlyChart;

// Function to fetch current weather and forecast data
function getWeather() {
    const apiKey = '5a46930ee4302eb436fc7bffe00d5c92';
    const city = document.getElementById('city').value;

    // Check if city is entered
    if (!city) {
        alert('Please enter a city');
        return;
    }

    // API URLs for current weather and forecast
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
            calculateAverageTemperature(data.list);
            createHourlyTemperatureChart(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

// Function to display current weather data
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Clear previous content
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    // Check if city is found
    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Display temperature
        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        // Display weather info
        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        // Show weather icon
        showImage();

        // Display activity suggestion
        suggestActivity(temperature);
    }
}

// Function to display hourly forecast data
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Display the next 24 hours (3-hour intervals)
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        // Display each hourly forecast item
        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Function to calculate and display average temperature for the day
function calculateAverageTemperature(hourlyData) {
    // Get temperatures for the next 24 hours
    const temperatures = hourlyData.slice(0, 8).map(item => item.main.temp - 273.15); // Convert to Celsius
    const sum = temperatures.reduce((acc, temp) => acc + temp, 0);
    const averageTemp = (sum / temperatures.length).toFixed(2); // Calculate average and round to 2 decimals

    // Display average temperature
    const averageTempDiv = document.getElementById('average-temp');
    averageTempDiv.innerHTML = `<p>Average Temperature for the Day: ${averageTemp}°C</p>`;
}

// Function to create hourly temperature chart using Chart.js
function createHourlyTemperatureChart(hourlyData) {
    const labels = hourlyData.slice(0, 8).map(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        return `${dateTime.getHours()}:00`;
    });

    const temperatures = hourlyData.slice(0, 8).map(item => Math.round(item.main.temp - 273.15)); // Convert to Celsius

    const ctx = document.getElementById('hourly-chart').getContext('2d');
    hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Hourly Temperature (°C)',
                data: temperatures,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Function to show weather icon
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; // Make the image visible once it's loaded
}

// Function to suggest activity based on temperature
function suggestActivity(temperature) {
    const activitySuggestionDiv = document.getElementById('activity-suggestion');
    let suggestion = '';

    // Suggest activity based on temperature range
    if (temperature >= 30) {
        suggestion = 'It\'s quite hot today. How about going for a swim?';
    } else if (temperature >= 20 && temperature < 30) {
        suggestion = 'The weather is nice. A perfect day for a walk in the park.';
    } else if (temperature >= 10 && temperature < 20) {
        suggestion = 'It\'s a bit chilly. Maybe a good day to visit a museum or a cafe.';
    } else {
        suggestion = 'It\'s cold outside. Stay warm indoors with a hot drink.';
    }

    // Display activity suggestion
    activitySuggestionDiv.innerHTML = `<p>${suggestion}</p>`;
}

