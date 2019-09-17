export default {
  overview: {
    days: "Days",
    hours: "Hours",
    nextSprayWindow: "Next Spray Window:",
    manageSettings: "Mange Threshold Settings",
  },
  station: {
    title: {
      sprayOutlook: "Spray Outlook",
      inversionRisk: "Inversion Risk",
      precipitationRisk: "Precipitation Risk",
      windDirectionSpeed: "Wind Direction Speed",
      tempDewPoint: "Weather Temp / Dew PT",
    },
    locationDistance: "({{distance}})",
    sunrise: " (Sunrise {{sunriseTime}})",
    sunset: " (Sunset {{sunsetTime}})",
    noDataAvailable: "No Data available",
    noRemainingDayHours:
      "There are no remaining daylight hours today. Select another day or adjust your {{settingsLink}}.",
  },
  thresholdSettings: {
    header: {
      riskDescription: {
        clear: "Green means forecasted conditions are within your saved thresholds.",
        caution: "Yellow indicates you should check the forecast data and proceed with caution.",
        warning: "Red is your warning that conditions are outside your thresholds.",
      },
      title: "How is Spray Outlook determined?",
      description:
        "Simply check the weather conditions you want to include in your outlook calculation and enter the appropriate values for your targeted application below. DTN will then assess each of your location’s hourly forecast and return one of three outlooks below and each day’s outlook reviews the hourly outlooks against your minimum spray window period.",
      paragraph:
        "See each variable description below for more detail. If you uncheck each threshold, DTN will evaluate each hour based solely on the rain forecast. Feel free to change your settings throughout the season to match your chemical application needs.",
      reminder:
        "Remember, the forecasted spray windows included in DTN’s Spray Outlook are for planning purposes based on your nearest authorized weather station and are not a substitute for checking actual conditions in your field at the time of application per label directions.",
      toggleDescriptions: "Show/hide descriptions",
    },
    form: {
      description: {
        windThresholds:
          "Check this box and indicate your upper and/or lower wind speed limits. Sustained wind speeds outside your selected limit(s) will trigger a ‘red’ warning. Gusts over a saved upper limit will trigger a ‘yellow’ caution state. Forecasted wind direction will also be included in the display to support geographic limitations such as neighboring sensitive crops, waterways, etc.",
        temperature:
          "Check this box if you need to consider air temperature thresholds as part of your spraying evaluation. Hourly air temperature forecasts outside your selected limit(s) will trigger a ‘red’ warning. Dew point temperatures are not included into the temperature evaluation though they are used in the temperature inversion risk assessment and you will see the dew point data in each display.",
        temperatureInversionRisk:
          "Check this box to include DTN’s forecast risk of a temperature inversion in your outlook evaluation. DTN derives temperature inversion based on multiple variables including: time of day, cloud cover, wind speed, and humidity for given hour and location. Inversion Risk is forecasted as likely (red), possible (yellow), or clear (green).",
        daytimeOnly:
          "Check this box if you do not want DTN to include nighttime hours when determining your Next Spray Window and do not plan on applying chemical between sunset and sunrise.",
        rainfreeForecastPeriod:
          "Check this box if you want to include and specify a minimum rainfast or drying time after your targeted application. The Spray Outlook will review each hour based on the current hour’s forecast for precipitation and the risk of precipitation for the duration of the rainfree period. A precip chance greater than 50% will trigger a red warning and a precip chance between 20% and 50% will trigger a yellow caution state.",
        minimumSprayWindow:
          "Please indicate how long of a window you need to complete an application so we can identify your Next Spray Window and evaluate the spray status of any given day. If your location has enough consecutive green/clear hours in the day, the day is green. If there are not enough green/clear forecasted hours in a calendar day, the day is red. If you have enough green/clear forecasted hours, but they are not consecutive, your day will be yellow so you can make a judgement call.",
      },
      upperLimit: "Upper limit",
      lowerLimit: "Lower limit",
      consecutiveHours: " consecutive hour(s)",
      limitError: "The upper limit cannot be lower than the lower limit",
      windThresholds: "Wind Thresholds",
      temperatureInversionRisk: "Temperature Inversion Risk",
      rainfreeForecastPeriod: "Rainfree Forecast Period",
      temperature: "Temperature",
      daytimeOnly: "Daytime Only Applications",
      minimumSprayWindow: "Minimum Spray Window",
      cancel: "Cancel",
      saveChanges: "Save Changes",
    },
  },
  common: {
    error:
      "The upper limit cannot exceed {{allowedMax}} or the lower limit cannot be below {{allowedMin}}",
    outlookTimestamp: "Outlook forecast generated",
    settingsLink: "Outlook Settings",
    outlookLink: "Outlook Timeline",
    nextSprayWindow: "Next Spray Window: ",
    noRecommendedSprayTime: "No Recommended Spray Time",
    station: "Station: ",
    loading: "Loading...",
    degreeSymbol: "°",
  },
};
