from django.contrib import admin
from .models import *


class StatusAdmin(admin.ModelAdmin):
    fields = ['name', 'overdraft']
    list_filter = ['name']


class ProductAdmin(admin.ModelAdmin):
    fields = ['name', 'price']
    search_fields = ['name']
    list_filter = ['name']


class PurchaseInline(admin.TabularInline):
    model = Purchase
    extra = 0


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0


class CustomerAdmin(admin.ModelAdmin):
    fields = ['firstname', 'lastname', 'nickname', 'email', 'status']
    readonly_fields = ('balance',)
    inlines = [PaymentInline, PurchaseInline]
    search_fields = ['firstname', 'lastname', 'nickname']
    list_filter = ['firstname', 'lastname', 'nickname']


admin.site.register(Status, StatusAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Product, ProductAdmin)
