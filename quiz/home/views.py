from ast import Try
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import *
from home.models import Question
import random
import requests

# Create your views here.


def home(request):
    return render(request, 'home.html')


def get_quiz(request):
    try:
        question_objs = Question.objects.all()
        data = []
        # random.shuffle(question_objs)

        for question_obj in question_objs:
            data.append({
                "category" : question_obj.category.category_name,
                "question" : question_obj.question,
                "marks" : question_obj.marks,
                "answers" : question_obj.get_answers()
            })

        payload = {'status': True, 'data' : data}

        return JsonResponse(payload)


    except Exception as e:
        print(e)
    return HttpResponse("Something Went Wrong")


def weatherInfo(request):
    r = requests.get('https://get.geojs.io/')
    ip_request = requests.get('https://get.geojs.io/v1/ip.json')
    ipAdd = ip_request.json()['ip']    
    url = 'https://get.geojs.io/v1/ip/geo/'+ipAdd+'.json'
    geo_request = requests.get(url)
    geo_data = geo_request.json()
    # print(geo_data)
    url = 'https://api.openweathermap.org/data/2.5/weather?lat='+geo_data['latitude']+'&lon='+geo_data['longitude']+'&units=imperial&type=accurate&appid=e11862ae7905f24f99e779d8ffeed6c1'
    report = requests.get(url)
    wdata = report.json()
    temp = (wdata['main']['temp'] - 32)* 5/9
    wind = wdata['wind']
    name = wdata['name']


    
    print(geo_data['latitude'])
    print(geo_data['longitude'])
    data = {'latitude':geo_data['latitude']}
    payload = {'status': True, 'City' :name, 'temprature' : temp, 'wind' : wind['speed']}

    return JsonResponse(payload)

def game(request):
    try:
        question_objs = Question.objects.all()
        games = []

        for question_obj in question_objs:
            games.append({
                "question" : question_obj.marks,
            })
        questions = {'questions': games}
        payload = {'games' : questions}

        return JsonResponse(payload)


    except Exception as e:
        print(e)
    return HttpResponse("Something Went Wrong")
