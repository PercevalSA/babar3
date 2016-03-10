from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Tweet(models.Model):
    """
    A tweet to tell people the bar is open.
    - time is in minutes
    - message is not really optional for a tweet, but it has
    to be from the viewpoint of the API caller, and in any case
    it won't be because of the pre_message
    """
    time = models.PositiveSmallIntegerField(validators=[
        MinValueValidator(30), # more than half an hour
        MaxValueValidator(12*60), # less than 12 hours
    ])
    message = models.CharField(max_length=140, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """
        Prepend the recorded message to the caption
        """
        pre_message = "Le bar sera ouvert pendant "
        hours = self.time // 60
        minutes = self.time % 60
        if hours > 0:
            pre_message += str(hours) + "h"
        if minutes > 0:
            pre_message += str(minutes) + "m"
        pre_message += " ! "
        self.message = pre_message + self.message
        super(Tweet, self).save(*args, **kwargs)

    def __str__(self):
        return self.timestamp.strftime("%d %B %Y -- %H:%M:%S")
