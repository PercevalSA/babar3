from django.contrib import admin
from django import forms
from .models import *


class StatusAdmin(admin.ModelAdmin):
    fields = ['name', 'overdraft']
    list_filter = ['name']


class ProductAdmin(admin.ModelAdmin):
    fields = ['name', 'price']
    search_fields = ['name']
    list_filter = ['name']


class TransactionFormset(forms.BaseInlineFormSet):
    def get_queryset(self):
        # Limit the number of inline forms to 5
        return super().get_queryset().order_by('-timestamp')[0:5]


class PurchaseInline(admin.TabularInline):
    model = Purchase
    formset = TransactionFormset
    fields = ['customer', 'product', 'amount', 'timestamp']
    readonly_fields = ['timestamp']
    extra = 0


class PaymentInline(admin.TabularInline):
    model = Payment
    formset = TransactionFormset
    fields = ['customer', 'amount', 'timestamp']
    readonly_fields = ['timestamp']
    extra = 0


class CustomerAdmin(admin.ModelAdmin):
    fields = ['firstname', 'lastname', 'nickname', 'email', 'status', 'balance']
    readonly_fields= ['balance',]
    inlines = [PaymentInline, PurchaseInline]
    search_fields = ['firstname', 'lastname', 'nickname']
    list_filter = ['firstname', 'lastname', 'nickname']


admin.site.register(Status, StatusAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Product, ProductAdmin)
