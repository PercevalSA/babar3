from django.contrib import admin
from .models import *


class TweetAdmin(admin.ModelAdmin):
    fields = ['time', 'message', 'timestamp']
    readonly_fields = ['time', 'message', 'timestamp']
    list_filter = ['timestamp']


admin.site.register(Tweet, TweetAdmin)
