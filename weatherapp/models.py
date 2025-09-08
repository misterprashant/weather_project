from django.db import models

# Create your models here.
class City(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class WeatherData(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    temperature = models.FloatField()
    humidity = models.IntegerField()
    condition = models.CharField(max_length=100)
    wind_speed = models.FloatField()
    datetime = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city.name} - {self.temperature}°C,"