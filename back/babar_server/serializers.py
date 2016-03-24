from rest_framework import serializers
from .models import *


class StatusSerializer(serializers.ModelSerializer):
    """
    Status's view is read-only anyway
    """
    class Meta:
        model = Status
        fields = ('pk', 'name', 'overdraft')


class ProductSerializer(serializers.ModelSerializer):
    """
    Product's view is read-only anyway
    """
    class Meta:
        model = Product
        fields = ('pk', 'name', 'price')


class BasicProductSerializer(serializers.ModelSerializer):
    """
    A basic Product
    """
    class Meta:
        model = Product
        fields = ('pk', 'name')


class CustomerSerializer(serializers.ModelSerializer):
    """
    Customer's view is read-only anyway
    """
    class Meta:
        model = Customer
        depth = 1
        fields = ('pk', 'firstname', 'lastname', 'nickname', 'email', 'status', 'balance')


class BasicCustomerSerializer(serializers.ModelSerializer):
    """
    A basic Customer
    """
    class Meta:
        model = Customer
        fields = ('pk', 'firstname', 'lastname', 'nickname')


class PaymentSerializer(serializers.ModelSerializer):
    """
    Payment is not read-only: specify the fields which are
    Note: the amount field as a MinValueValidator to forbid negative payments
    """
    class Meta:
        model = Payment
        fields = ('pk', 'customer', 'amount')
        read_only_fields = ('timestamp')


class PurchaseSerializer(serializers.ModelSerializer):
    """
    Purchase is not read-only: specify the fields which are
    """
    class Meta:
        model = Purchase
        fields = ('pk', 'customer', 'product')
        read_only_fields = ('timestamp')

    def validate(self, data):
        """
        Validate this purchase by verifying the customer's balance
        """
        if (data['customer'].balance + data['customer'].status.overdraft) < data['product'].price:
            raise serializers.ValidationError("Not enough money to buy that!")
        return data
