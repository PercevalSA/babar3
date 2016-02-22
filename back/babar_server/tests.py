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
        money="1000"
    )

class PurchaseTests(TestCase):

    def test_purchase_auto_money(self):
        """
        Test the money field is automatically created
        """
        setup()
        p = Purchase.objects.create(
            customer=Customer.objects.get(nickname="penguin"),
            product=Product.objects.get(name="Umbrella")
        )
        self.assertEqual(Purchase.objects.get(pk=p.pk).money, 5)


class PaymentTests(TestCase):

    def test_no_negative_payment(self):
        """
        Test that there can't be a negative payment
        """
        setup()
        p = Payment(
            customer=Customer.objects.get(nickname="penguin"),
            money="-24"
        )
        self.assertRaises(
            Exception,
            p.full_clean
        )
