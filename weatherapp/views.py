from django.shortcuts import render, HttpResponse
from weatherapp.models import City, WeatherData
import requests

API_KEY = "b0e34aa50313fda4138eb0da151f9544"

def home(request):
    weather_info = None

    if request.method == "POST":
        city_name = request.POST.get("city")
        if city_name:
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&units=metric&appid={API_KEY}"
            try:
                response = requests.get(url, timeout=5).json()
            except requests.RequestException:
                weather_info = {"error": "Network error. Please try again."}
                return render(request, "index.html", {"weather": weather_info})

            if response.get("cod") == 200:
                temp = response['main']['temp']
                condition = response['weather'][0]['description']
                humidity = response['main']['humidity']
                wind = response['wind']['speed']

                city, created = City.objects.get_or_create(name=city_name)
                WeatherData.objects.create(
                    city=city,
                    temperature=temp,
                    condition=condition,
                    humidity=humidity,
                    wind_speed=wind,
                )

                weather_info = {
                    "city": city_name,
                    "temp": temp,
                    "condition": condition,
                    "humidity": humidity,
                    "wind": wind,
                }
            else:
                weather_info = {"error": "City not found or API error."}
        else:
            weather_info = {"error": "Please enter a city name."}

    return render(request, "index.html", {"weather": weather_info})