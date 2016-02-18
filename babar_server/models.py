from django.db import models


class Status(models.Model):
    """
    The status of a customer (eg barman)
    """
    name = models.CharField(max_length=25)
    overdraft = models.PositiveIntegerField(default=0)


class Product(models.Model):
    """
    A product of the bar (eg a drink)
    """
    name = models.CharField(max_length=25)
    price = models.DecimalField(max_digits=4, decimal_places=2)


class Customer(models.Model):
    """
    A bar customer
    Usually a regular one, sometimes has privileges
    """
    firstname = models.CharField(max_length=25)
    lastname = models.CharField(max_length=25)
    nickname = models.CharField(max_length=25)
    email = models.EmailField()
    status = models.ForeignKey(Status)

    def _get_balance(self):
        """
        Figure out how much money this customer has left
        """
        money = 0
        for t in self.transaction_set.all():
            money += t.money
        return money
    balance = property(_get_balance)


class Transaction(models.Model):
    """
    A transaction between the bar and a customer
    - money > 0: This is a credit (ie a payment)
    - money < 0: This is a debit (ie a purchase)
    This implementation doesn't allow negative payment by design.
    """
    customer = models.ForeignKey(Customer)
    timestamp = models.DateTimeField(auto_now_add=False)
    money = models.DecimalField(max_digits=6, decimal_places=2)


class Purchase(Transaction):
    """
    A purchase a customer has made of a product
    """
    product = models.ForeignKey(Product)
