from decimal import Decimal
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError


class Status(models.Model):
    """
    The status of a customer (eg barman)
    """
    name = models.CharField(max_length=25, unique=True)
    overdraft = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = 'Statuses'

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    A product of the bar (eg a drink)
    """
    name = models.CharField(max_length=25)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name


def year_validator(year):
    """
    year must be superior to 2000
    and be in longer than 3 years.
    """
    lower = 2000
    upper = timezone.now().year + 3
    if year < lower or year > upper:
        raise ValidationError(str(lower) + " <= year <= " + str(upper) + " is False")


class Customer(models.Model):
    """
    A bar customer
    The nickmane is a unique identifier for the customer
    The year is the year of graduation (namely one's class)
    """
    firstname = models.CharField(max_length=25)
    lastname = models.CharField(max_length=25)
    nickname = models.CharField(max_length=25, unique=True)
    email = models.EmailField(unique=True)
    year = models.PositiveSmallIntegerField(validators=[year_validator])
    status = models.ForeignKey(Status, on_delete=models.PROTECT)
    """
    TODO : set to models.SET_DEFAULT
    Set the ForeignKey to its default value;
    a default for the ForeignKey must be set.
    """

    def _get_balance(self):
        """
        Figure out how much amount this customer has left
        """
        amount = 0
        for t in self.payment_set.all():
            amount += t.amount
        for t in self.purchase_set.all():
            amount -= t.amount
        return amount
    balance = property(_get_balance)

    def _get_fullname(self):
        """
        Compute a fullname
        """
        return self.firstname + " (" + self.nickname + ") " + self.lastname
    fullname = property(_get_fullname)

    def __str__(self):
        return self.fullname


class Transaction(models.Model):
    """
    A transaction between the bar and a customer
    This implementation doesn't allow negative values.
    """
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])

    class Meta:
        abstract = True


class Payment(Transaction):
    """
    A payment a customer has made
    """

    def __str__(self):
        return str(self.customer) + ': +' + str(self.amount)  + '€'


class Purchase(Transaction):
    """
    A purchase a customer has made of a product
    """
    product = models.ForeignKey(Product, on_delete=models.PROTECT)

    def save(self, *args, **kwargs):
        """
        Make up the amount field with *current* product price
        """
        self.amount = self.product.price
        super(Purchase, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.customer) + ': ' + str(self.product)

    def clean(self):
        """
        Verify this customer has enough money
        Note: .full_clean() is not invoked by DRF
        """
        if (self.customer.balance + self.customer.status.overdraft) < self.product.price:
            raise ValidationError("Not enough money to buy that!")
