from django.urls import path
from . import views

urlpatterns = [
    path('', views.healthcheck, name='healthcheck'),
    path('num_to_english', views.num_to_english, name='num_to_english'),
    path('test', views.test_frontend, name='test_frontend')
]
