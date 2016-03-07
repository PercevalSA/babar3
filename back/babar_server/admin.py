from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.utils.translation import ugettext, ugettext_lazy as _
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


class RestrictiveUserAdmin(UserAdmin):
    """
    Do not allow privilege escalation!
    If someone that is not a superuser try to access one,
    do not display sensitive fields.
    Based on http://stackoverflow.com/a/2298268
    """
    restricted_fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    def change_view(self, request, *args, **kwargs):
        targeted_user = User.objects.get(pk=args[0])
        if request.user.is_superuser or not targeted_user.is_superuser:
            # Either the current user is superuser
            # Or the targeted user is not superuser
            # So adopt the standard behavior
            return super(RestrictiveUserAdmin, self).change_view(request, *args, **kwargs)
        else:
            try:
                # All fields are made read-only
                readonly = []
                for fs in self.fieldsets:
                    readonly += list(fs[1]['fields'])
                self.readonly_fields = readonly
                response = super(RestrictiveUserAdmin, self).change_view(request, *args, **kwargs)
            finally:
                # Reset read-only fields
                self.readonly_fields = UserAdmin.readonly_fields
            return response


admin.site.register(Status, StatusAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.unregister(User)
admin.site.register(User, RestrictiveUserAdmin)
