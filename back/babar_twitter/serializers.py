import json
from datetime import timedelta
from django.utils import timezone
from rest_framework import serializers
import tweepy
from .models import *


# Get secrets and create the API instance
secrets = open("./babar_twitter/SECRETS.json", 'r')
keychain = json.load(secrets)
secrets.close()
twitter_auth = tweepy.OAuthHandler(keychain['consumer']['key'], keychain['consumer']['secret'])
twitter_auth.set_access_token(keychain['access']['key'], keychain['access']['secret'])
del keychain
twitter_api = tweepy.API(twitter_auth)


class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet

    def validate(self, data):
        """
        Throttle the tweets by not allowing to post twice
        in a 12-hour window.
        """
        now = timezone.localtime(timezone.now())
        try:
            last = Tweet.objects.order_by('-timestamp')[0].timestamp
            delta = timedelta(hours=12)
            if last + delta > now:
                raise serializers.ValidationError("Wait 12h between two tweets!")
        except IndexError:
            # No previous tweet
            pass
        return data


    def create(self, validated_data):
        """
        If the creation was successful (no error thrown),
        do the actual tweeting
        """
        tweet = super(TweetSerializer, self).create(validated_data)
        twitter_api.update_status(tweet.message)
        return tweet
