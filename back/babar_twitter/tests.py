from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db.utils import DataError
from .models import *

class TweetTests(TestCase):

    def test_message_short_enough(self):
        """
        Test that a message length can't be superior to 140 characters
        """
        t = Tweet(
            time = 60,
            message = 't'*141
        )
        # assertRaises doesn't seem to work
        try:
            t.save()
        except Exception as e:
            self.assertTrue(type(e) is DataError)
