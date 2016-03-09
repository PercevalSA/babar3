from django.shortcuts import render
from rest_framework import viewsets, mixins
from .models import *
from .serializers import *


class TweetViewSet(mixins.CreateModelMixin,
                   viewsets.GenericViewSet):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer
