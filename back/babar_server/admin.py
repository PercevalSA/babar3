from django.contrib import admin

from .models import *

admin.site.register(Status)
admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Payment)
admin.site.register(Purchase)
