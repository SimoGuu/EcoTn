const WeatherController = {
    coordinates: {
        latitude: 46.0804614,
        longitude: 11.1203557
    },
    getWeather: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                const {latitude, longitude} = WeatherController.coordinates;
                let response = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&hourly=weather_code&timezone=Europe%2FBerlin&forecast_days=1"
                );

                let data = await response.json();
                let weather = data["hourly"];

                let parsedWeather = {
                    day: weather.time[0].split("T")[0],
                    timestamps: {}
                };

                let i = 0;

                weather["time"].forEach((time) => {
                    parsedWeather["timestamps"][time.split("T")[1]] = WeatherController.decodeWeatherCode(weather["weather_code"][i]);
                    i++;
                });

                resolve(parsedWeather);
            } catch (error) {
                resolve(null);
            }
        });
    },
    decodeWeatherCode: (code) => {
        if (code === 0) {
            return "clear";
        }

        if ([1, 2, 3].includes(code)) {
            return "overcast";
        }

        if ([45, 48].includes(code)) {
            return "fog";
        }

        if ([51, 53, 55].includes(code)) {
            return "drizzle";
        }

        if ([56, 57].includes(code)) {
            return "freezing_drizzle";
        }

        if ([61, 63, 65].includes(code)) {
            return "rain";
        }

        if ([66, 67].includes(code)) {
            return "freezing_rain";
        }

        if ([71, 73, 75].includes(code)) {
            return "snow";
        }

        if (code === 77) {
            return "snow_grains";
        }

        if ([80, 81, 82].includes(code)) {
            return "rain_showers";
        }

        if ([85, 86].includes(code)) {
            return "snow_showers";
        }

        if ([95, 96, 99].includes(code)) {
            return "thunderstorm";
        }
    }
};

module.exports = WeatherController;