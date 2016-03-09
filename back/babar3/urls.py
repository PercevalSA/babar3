"""babar3 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from babar_server.views import *
from babar_twitter.views import *


server_router = DefaultRouter()
server_router.register(r'status', StatusViewSet)
server_router.register(r'product', ProductViewSet)
server_router.register(r'customer', CustomerViewSet)
server_router.register(r'payment', PaymentViewSet)
server_router.register(r'purchase', PurchaseViewSet)

social_router = DefaultRouter()
social_router.register(r'tweet', TweetViewSet)

urlpatterns = [
    url(r'^api/', include(server_router.urls)),
    url(r'^social/', include(social_router.urls)),
    url(r'^auth/', include('rest_auth.urls')),
    url(r'^admin/', admin.site.urls),
]
