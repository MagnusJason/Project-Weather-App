/**
 * Atmosphere Weather App
 * A beautiful weather forecast application using Visual Crossing API
 */

// ============================================
// API Configuration
// ============================================

const CONFIG = {
    // Visual Crossing Weather API
    WEATHER_API_KEY: 'H26N7SJFXMBEFN2E5DDTRLUZJ',
    WEATHER_BASE_URL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
    
    // Giphy API (optional, for weather GIFs)
    GIPHY_API_KEY: 'YOUR_GIPHY_API_KEY', // Replace with your API key
    GIPHY_BASE_URL: 'https://api.giphy.com/v1/gifs/search',
    
    // Default settings
    DEFAULT_UNIT: 'F', // 'F' for Fahrenheit, 'C' for Celsius
};

// ============================================
// State Management
// ============================================

const state = {
    currentUnit: CONFIG.DEFAULT_UNIT,
    weatherData: null,
    isLoading: false,
};

// ============================================
// DOM Elements
// ============================================

const elements = {
    searchForm: document.getElementById('search-form'),
    locationInput: document.getElementById('location-input'),
    weatherDisplay: document.getElementById('weather-display'),
    loadingSection: document.getElementById('loading-section'),
    errorSection: document.getElementById('error-section'),
    errorMessage: document.getElementById('error-message'),
    
    // Weather display elements
    cityName: document.getElementById('city-name'),
    dateTime: document.getElementById('date-time'),
    weatherIcon: document.getElementById('weather-icon'),
    temperature: document.getElementById('temperature'),
    weatherDescription: document.getElementById('weather-description'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    uvIndex: document.getElementById('uv-index'),
    forecastGrid: document.getElementById('forecast-grid'),
    
    // GIF elements
    weatherGif: document.getElementById('weather-gif'),
    gifDisplay: document.getElementById('gif-display'),
    
    // Unit toggle
    unitBtns: document.querySelectorAll('.unit-btn'),
};

// ============================================
// Weather API Functions
// ============================================

/**
 * Fetches weather data from Visual Crossing API
 * @param {string} location - City name or coordinates
 * @returns {Promise<Object>} - Weather data
 */
async function fetchWeatherData(location) {
    const unitGroup = state.currentUnit === 'F' ? 'us' : 'metric';
    const url = `${CONFIG.WEATHER_BASE_URL}/${encodeURIComponent(location)}?unitGroup=${unitGroup}&key=${CONFIG.WEATHER_API_KEY}&contentType=json&include=days,current,hours`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 400 || response.status === 404) {
                throw new Error('Location not found. Please check the city name and try again.');
            }
            throw new Error('Failed to fetch weather data. Please try again later.');
        }
        
        const data = await response.json();
        console.log('Weather API Response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

/**
 * Processes raw API data into a cleaner format for the app
 * @param {Object} rawData - Raw API response
 * @returns {Object} - Processed weather data
 */
function processWeatherData(rawData) {
    const current = rawData.currentConditions;
    const days = rawData.days;
    const location = rawData.resolvedAddress;
    
    const processed = {
        location: {
            name: location,
            timezone: rawData.timezone,
        },
        current: {
            temp: Math.round(current.temp),
            feelsLike: Math.round(current.feelslike),
            humidity: current.humidity,
            windSpeed: Math.round(current.windspeed),
            uvIndex: current.uvindex,
            conditions: current.conditions,
            icon: current.icon,
            datetime: current.datetime,
            sunrise: current.sunrise,
            sunset: current.sunset,
        },
        forecast: days.slice(0, 7).map(day => ({
            date: day.datetime,
            tempMax: Math.round(day.tempmax),
            tempMin: Math.round(day.tempmin),
            conditions: day.conditions,
            icon: day.icon,
        })),
    };
    
    console.log('Processed Weather Data:', processed);
    return processed;
}

/**
 * Gets the weather icon URL from Visual Crossing
 * @param {string} iconName - Icon name from API
 * @returns {string} - Icon URL
 */
function getWeatherIconUrl(iconName) {
    return `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${iconName}.png`;
}

// ============================================
// Giphy API Functions
// ============================================

/**
 * Fetches a weather-related GIF from Giphy
 * @param {string} weatherCondition - Current weather condition
 * @returns {Promise<string|null>} - GIF URL or null
 */
async function fetchWeatherGif(weatherCondition) {
    if (!CONFIG.GIPHY_API_KEY || CONFIG.GIPHY_API_KEY === 'YOUR_GIPHY_API_KEY') {
        return null;
    }
    
    const searchTerm = getGiphySearchTerm(weatherCondition);
    const url = `${CONFIG.GIPHY_BASE_URL}?api_key=${CONFIG.GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=25&rating=g`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            // Get a random GIF from results
            const randomIndex = Math.floor(Math.random() * data.data.length);
            return data.data[randomIndex].images.original.url;
        }
        return null;
    } catch (error) {
        console.error('Error fetching GIF:', error);
        return null;
    }
}

/**
 * Maps weather conditions to Giphy search terms
 * @param {string} condition - Weather condition
 * @returns {string} - Search term for Giphy
 */
function getGiphySearchTerm(condition) {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        return 'rain weather cozy';
    } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
        return 'snow winter weather';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
        return 'thunderstorm lightning';
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
        return 'cloudy sky';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
        return 'foggy morning';
    } else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
        return 'sunny day weather';
    } else if (conditionLower.includes('wind')) {
        return 'windy weather';
    }
    
    return 'weather nature';
}

// ============================================
// UI Update Functions
// ============================================

/**
 * Updates the weather display with processed data
 * @param {Object} data - Processed weather data
 */
function updateWeatherDisplay(data) {
    // Update location and date
    elements.cityName.textContent = data.location.name;
    elements.dateTime.textContent = formatDateTime(new Date());
    
    // Update current weather
    elements.weatherIcon.src = getWeatherIconUrl(data.current.icon);
    elements.weatherIcon.alt = data.current.conditions;
    elements.temperature.textContent = data.current.temp;
    elements.weatherDescription.textContent = data.current.conditions;
    
    // Update weather details
    elements.feelsLike.textContent = `${data.current.feelsLike}°`;
    elements.humidity.textContent = `${data.current.humidity}%`;
    const windUnit = state.currentUnit === 'F' ? 'mph' : 'km/h';
    elements.windSpeed.textContent = `${data.current.windSpeed} ${windUnit}`;
    elements.uvIndex.textContent = getUVIndexDescription(data.current.uvIndex);
    
    // Update forecast
    updateForecast(data.forecast);
    
    // Update weather theme
    updateWeatherTheme(data.current.icon, data.current.sunrise, data.current.sunset);
}

/**
 * Updates the 7-day forecast grid
 * @param {Array} forecast - Array of forecast data
 */
function updateForecast(forecast) {
    elements.forecastGrid.innerHTML = forecast.map((day, index) => `
        <div class="forecast-card">
            <div class="forecast-day">${formatDayName(day.date, index)}</div>
            <img src="${getWeatherIconUrl(day.icon)}" alt="${day.conditions}" class="forecast-icon">
            <div class="forecast-temps">
                <span class="forecast-high">${day.tempMax}°</span>
                <span class="forecast-low">${day.tempMin}°</span>
            </div>
        </div>
    `).join('');
}

/**
 * Updates the weather GIF display
 * @param {string|null} gifUrl - GIF URL or null
 */
function updateWeatherGif(gifUrl) {
    if (gifUrl) {
        elements.gifDisplay.src = gifUrl;
        elements.weatherGif.classList.add('visible');
    } else {
        elements.weatherGif.classList.remove('visible');
    }
}

/**
 * Updates the page theme based on weather conditions
 * @param {string} icon - Weather icon name
 * @param {string} sunrise - Sunrise time
 * @param {string} sunset - Sunset time
 */
function updateWeatherTheme(icon, sunrise, sunset) {
    // Remove all weather classes
    document.body.classList.remove(
        'weather-sunny', 'weather-cloudy', 'weather-rainy', 
        'weather-stormy', 'weather-snowy', 'weather-foggy', 'weather-night'
    );
    
    // Check if it's night time
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);
    const isNight = currentTime < sunrise || currentTime > sunset;
    
    // Determine theme based on icon
    const iconLower = icon.toLowerCase();
    
    if (isNight && !iconLower.includes('rain') && !iconLower.includes('snow')) {
        document.body.classList.add('weather-night');
    } else if (iconLower.includes('rain') || iconLower.includes('showers')) {
        document.body.classList.add('weather-rainy');
    } else if (iconLower.includes('thunder') || iconLower.includes('storm')) {
        document.body.classList.add('weather-stormy');
    } else if (iconLower.includes('snow') || iconLower.includes('sleet') || iconLower.includes('ice')) {
        document.body.classList.add('weather-snowy');
    } else if (iconLower.includes('fog') || iconLower.includes('haze') || iconLower.includes('mist')) {
        document.body.classList.add('weather-foggy');
    } else if (iconLower.includes('cloud') || iconLower.includes('overcast')) {
        document.body.classList.add('weather-cloudy');
    } else if (iconLower.includes('clear') || iconLower.includes('sun')) {
        document.body.classList.add('weather-sunny');
    }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Formats a date to a readable string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDateTime(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Formats a date string to day name
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {number} index - Day index
 * @returns {string} - Day name
 */
function formatDayName(dateStr, index) {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Gets a UV index description
 * @param {number} uvIndex - UV index value
 * @returns {string} - UV index with description
 */
function getUVIndexDescription(uvIndex) {
    if (uvIndex <= 2) return `${uvIndex} Low`;
    if (uvIndex <= 5) return `${uvIndex} Moderate`;
    if (uvIndex <= 7) return `${uvIndex} High`;
    if (uvIndex <= 10) return `${uvIndex} Very High`;
    return `${uvIndex} Extreme`;
}

/**
 * Converts temperature between Fahrenheit and Celsius
 * @param {number} temp - Temperature value
 * @param {string} from - Source unit ('F' or 'C')
 * @param {string} to - Target unit ('F' or 'C')
 * @returns {number} - Converted temperature
 */
function convertTemperature(temp, from, to) {
    if (from === to) return temp;
    
    if (from === 'F' && to === 'C') {
        return Math.round((temp - 32) * 5 / 9);
    } else if (from === 'C' && to === 'F') {
        return Math.round(temp * 9 / 5 + 32);
    }
    
    return temp;
}

// ============================================
// UI State Management
// ============================================

/**
 * Shows the loading state
 */
function showLoading() {
    state.isLoading = true;
    elements.loadingSection.classList.remove('hidden');
    elements.weatherDisplay.classList.add('hidden');
    elements.errorSection.classList.add('hidden');
}

/**
 * Hides the loading state
 */
function hideLoading() {
    state.isLoading = false;
    elements.loadingSection.classList.add('hidden');
}

/**
 * Shows an error message
 * @param {string} message - Error message
 */
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorSection.classList.remove('hidden');
    elements.weatherDisplay.classList.add('hidden');
    elements.loadingSection.classList.add('hidden');
}

/**
 * Shows the weather display
 */
function showWeatherDisplay() {
    elements.weatherDisplay.classList.remove('hidden');
    elements.errorSection.classList.add('hidden');
    elements.loadingSection.classList.add('hidden');
}

// ============================================
// Main Application Logic
// ============================================

/**
 * Main function to search for weather data
 * @param {string} location - Location to search
 */
async function searchWeather(location) {
    if (!location.trim()) {
        showError('Please enter a city name.');
        return;
    }
    
    showLoading();
    
    try {
        // Fetch weather data
        const rawData = await fetchWeatherData(location);
        
        // Process the data
        const processedData = processWeatherData(rawData);
        state.weatherData = processedData;
        
        // Update the display
        updateWeatherDisplay(processedData);
        
        // Fetch and display GIF (optional)
        const gifUrl = await fetchWeatherGif(processedData.current.conditions);
        updateWeatherGif(gifUrl);
        
        hideLoading();
        showWeatherDisplay();
    } catch (error) {
        hideLoading();
        showError(error.message || 'An error occurred. Please try again.');
    }
}

/**
 * Handles unit toggle
 * @param {string} unit - New unit ('F' or 'C')
 */
function handleUnitChange(unit) {
    if (unit === state.currentUnit) return;
    
    state.currentUnit = unit;
    
    // Update button states
    elements.unitBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === unit);
    });
    
    // Re-fetch weather data if we have a location
    if (state.weatherData) {
        searchWeather(state.weatherData.location.name);
    }
}

// ============================================
// Event Listeners
// ============================================

// Search form submission
elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = elements.locationInput.value;
    searchWeather(location);
});

// Unit toggle buttons
elements.unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        handleUnitChange(btn.dataset.unit);
    });
});

// Keyboard shortcut for search focus
document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== elements.locationInput) {
        e.preventDefault();
        elements.locationInput.focus();
    }
});

// ============================================
// Initialization
// ============================================

/**
 * Initializes the application
 */
function init() {
    console.log('🌤️ Atmosphere Weather App initialized');
    console.log('Press "/" to focus search input');
    
    // Set initial unit button state
    elements.unitBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === state.currentUnit);
    });
    
    // Optional: Load default city or user's location
    // searchWeather('New York');
    
    // Or try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                searchWeather(`${latitude},${longitude}`);
            },
            () => {
                // Geolocation denied or unavailable - show default
                console.log('Geolocation not available. Search for a city to begin.');
            }
        );
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

