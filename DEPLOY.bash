#!/bin/bash

set -e

TARGET_DIR=/var/www/babar3

sudo apt-get install libmysqlclient-dev apache2-dev nodejs python3-pip git virtualenv npm
[ ! -e /usr/bin/node ] && sudo ln -s /usr/bin/nodejs /usr/bin/node
#mysql -u root -p -e "create database babar_dev; use babar_dev;"
sudo mkdir $TARGET_DIR
sudo chown $USER:www-data $TARGET_DIR
git clone https://github.com/Babaritech/babar3 $TARGET_DIR

cd $TARGET_DIR/front
sudo npm install -g npm
sudo npm install -g grunt-cli bower yo generator-karma generator-angular
sudo npm install
bower install
grunt --force


cd $TARGET_DIR/back
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
python3 manage.py migrate
deactivate


cd $TARGET_DIR/back
sudo python3 manage.py runmodwsgi --setup-only --port=80 \
	--user www-data --group www-data \
	--server-root=/etc/mod_wsgi-express-80
sudo /etc/mod_wsgi-express-80/apachectl start
