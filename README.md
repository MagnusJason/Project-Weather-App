# Atmosphere - Weather Forecast App

A beautiful, dynamic weather forecast application built with vanilla JavaScript, HTML, and CSS. Features real-time weather data, 7-day forecasts, and dynamic themes that change based on weather conditions.

![Weather App Preview](preview.png)

## Features

- 🔍 **Location Search** - Search for any city worldwide
- 🌡️ **Temperature Toggle** - Switch between Fahrenheit and Celsius
- 🎨 **Dynamic Themes** - Background changes based on weather conditions (sunny, rainy, snowy, etc.)
- 📅 **7-Day Forecast** - View upcoming weather predictions
- 🖼️ **Weather GIFs** - Optional Giphy integration for weather-related animations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Night Mode** - Automatic dark theme when sun has set
- ⛈️ **Weather Animations** - Rain and snow particle effects

## Setup

### 1. Get Your API Keys

#### Visual Crossing Weather API (Required)
1. Go to [Visual Crossing Weather](https://www.visualcrossing.com/weather-api)
2. Sign up for a free account
3. Navigate to your account page to get your API key
4. Free tier includes 1,000 requests per day

#### Giphy API (Optional - for weather GIFs)
1. Go to [Giphy Developers](https://developers.giphy.com/)
2. Create an account and create a new app
3. Copy your API key

### 2. Configure the App

Open `app.js` and replace the placeholder API keys:

```javascript
const CONFIG = {
    // Replace with your Visual Crossing API key
    WEATHER_API_KEY: 'YOUR_VISUAL_CROSSING_API_KEY',
    
    // Replace with your Giphy API key (optional)
    GIPHY_API_KEY: 'YOUR_GIPHY_API_KEY',
    
    // ...
};
```

### 3. Run the App

Simply open `index.html` in your web browser. No build tools required!

For local development, you can use any simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js (with npx)
npx serve

# VS Code Live Server extension
# Just right-click index.html and select "Open with Live Server"
```

## Usage

1. **Search for a Location**: Type a city name in the search bar and press Enter or click the search button
2. **Toggle Temperature Units**: Click °F or °C buttons in the header to switch units
3. **View Forecast**: Scroll down to see the 7-day forecast
4. **Keyboard Shortcut**: Press `/` to focus the search input

## Weather Themes

The app automatically changes its appearance based on the current weather:

| Weather | Theme Colors |
|---------|--------------|
| ☀️ Sunny/Clear | Warm orange and yellow gradients |
| ☁️ Cloudy | Cool gray and blue tones |
| 🌧️ Rainy | Deep blue with rain animation |
| ⛈️ Stormy | Dark purple with lightning effects |
| ❄️ Snowy | Light blue with snow animation |
| 🌫️ Foggy | Muted gray atmosphere |
| 🌙 Night | Dark blue with golden accents |

## Project Structure

```
Project-Weather-App/
├── index.html      # Main HTML structure
├── style.css       # Styles and themes
├── app.js          # Application logic and API calls
└── README.md       # This file
```

## API Reference

### Visual Crossing Weather API

The app uses the following endpoint:
```
GET https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{location}
```

Parameters:
- `unitGroup`: `us` (Fahrenheit) or `metric` (Celsius)
- `key`: Your API key
- `include`: `days,current,hours`

### Giphy API

Optional integration for weather-related GIFs:
```
GET https://api.giphy.com/v1/gifs/search
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Flexbox, Grid, animations
- **JavaScript (ES6+)** - Async/await, Fetch API, Modules
- **Visual Crossing API** - Weather data
- **Giphy API** - Weather GIFs (optional)

## License

MIT License - feel free to use this project for learning or personal use.

## Credits

- Weather data by [Visual Crossing](https://www.visualcrossing.com/)
- Weather icons by [Visual Crossing Weather Icons](https://github.com/visualcrossing/WeatherIcons)
- GIFs by [Giphy](https://giphy.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

