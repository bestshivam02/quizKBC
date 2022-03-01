from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('api/get-quiz/' , views.get_quiz , name = "get_quiz"),
    path('api/get-game/' , views.game , name = "get_game"),
    path('api/get-weatherInfo/' , views.weatherInfo , name = "weatherInfo")

]