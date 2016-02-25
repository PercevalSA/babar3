import random
from decimal import Decimal, ROUND_HALF_UP
from django.test import TestCase
from django.core.validators import ValidationError
from .models import *


def setup():
    """
    Create dummy data
    """
    Status.objects.create(
        name="Hero",
        overdraft="0"
    )
    Status.objects.create(
        name="Villain",
        overdraft="250"
    )
    Customer.objects.create(
        firstname="Bruce",
        lastname="Wayne",
        nickname="batman",
        email="batman@gotham.com",
        status=Status.objects.get(name="Hero")
    )
    Customer.objects.create(
        firstname="James",
        lastname="Gordon",
        nickname="jim",
        email="jim@gotham.com",
        status=Status.objects.get(name="Hero")
    )
    Customer.objects.create(
        firstname="Oswald",
        lastname="Cobblepot",
        nickname="penguin",
        email="penguin@gotham.com",
        status=Status.objects.get(name="Villain")
    )
    Product.objects.create(
        name="Shotgun",
        price="50.00"
    )
    Product.objects.create(
        name="Umbrella",
        price="5"
    )
    Payment.objects.create(
        customer=Customer.objects.get(nickname="penguin"),
        amount="1000"
    )


class CustomerTests(TestCase):

    def test_balance_calcul(self):
        """
        Test balance is sum of payments minus sum of purchases
        """
        setup()
        amount = Decimal(200)
        Payment.objects.create(
            customer=Customer.objects.get(nickname="jim"),
            amount=amount
        )
        for i in range(25):
            if(random.choice((True, False))):
                Purchase.objects.create(
                    customer=Customer.objects.get(nickname="jim"),
                    product=Product.objects.get(name="Umbrella")
                )
                amount -= 5
            else:
                m = random.randrange(0, 20000) / 100
                Payment.objects.create(
                    customer=Customer.objects.get(nickname="jim"),
                    amount=m
                )
                amount += Decimal(m)
        self.assertEqual(
            Customer.objects.get(nickname="jim").balance,
            amount.quantize(Decimal('.001'), rounding=ROUND_HALF_UP)
        )


class PurchaseTests(TestCase):

    def test_purchase_auto_amount(self):
        """
        Test the amount field is automatically created
        """
        setup()
        p = Purchase.objects.create(
            customer=Customer.objects.get(nickname="penguin"),
            product=Product.objects.get(name="Umbrella")
        )
        self.assertEqual(Purchase.objects.get(pk=p.pk).amount, 5)

    def test_purchase_no_money(self):
        """
        Test that a purchase can't be made without enough balance
        """
        setup()
        Payment.objects.create(
            customer=Customer.objects.get(nickname="batman"),
            amount="49"
        )
        self.assertTrue(
            Customer.objects.get(nickname="batman").balance
            <
            Product.objects.get(name="Shotgun").price
        )
        p = Purchase(
            customer=Customer.objects.get(nickname="batman"),
            product=Product.objects.get(name="Shotgun")
        )
        self.assertRaises(
            ValidationError,
            p.full_clean
        )


class PaymentTests(TestCase):

    def test_no_negative_payment(self):
        """
        Test that there can't be a negative payment
        """
        setup()
        p = Payment(
            customer=Customer.objects.get(nickname="penguin"),
            amount="-24"
        )
        self.assertRaises(
            ValidationError,
            p.full_clean
        )
