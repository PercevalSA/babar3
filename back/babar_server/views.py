from django.shortcuts import render
from rest_framework import viewsets, mixins, filters
from .models import *
from .serializers import *


class StatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Status.objects.all()
    serializer_class = StatusSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class CustomerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('nickname', 'firstname', 'lastname',)

    def get_serializer_class(self):
        """
        This is a speed improvement for the API.
        Instead of fetching all customers with all their info,
        just return their name and pk when the "?info=basic" is
        specified in the URL. The full info on one customer can
        then be retrieved with its detailed view.
        """
        info = self.request.query_params.get("info", "full")
        if info == "basic":
            return BasicCustomerSerializer
        return self.serializer_class


class PaymentViewSet(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    filter_fields = ('customer',)


class PurchaseViewSet(mixins.CreateModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.ListModelMixin,
                      viewsets.GenericViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    filter_fields = ('customer', 'product',)
