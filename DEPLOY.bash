#!/bin/bash

set -e

TARGET_DIR=/var/www/babar3
SETTINGS=$TARGET_DIR/back/babar3/settings.py

sudo apt-get install -y mysql-client mysql-server libmysqlclient-dev nginx nodejs python3-pip git virtualenv npm
[ ! -e /usr/bin/node ] && sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo mkdir -p $TARGET_DIR
sudo rsync -a ./* $TARGET_DIR
sudo chown -R $USER:www-data $TARGET_DIR


set +e
sudo nginx -s stop
sudo systemctl stop gunicorn
sudo systemctl disable gunicorn
set -e


read -p "Enter website URL in the format example.org: " domain
echo
serverjs="var SERVER = 'https://$domain/';"
sed "s|var SERVER.*|$serverjs|" -i $TARGET_DIR/front/app/scripts/services/API.js

read -s -p "Enter MySQL root password: " sqlpasswd
echo
mysql -u root --password=$sqlpasswd -e "create database if not exists babar3; use babar_dev;"


sed "s/BABAR3_SQL_PASSWORD/$sqlpasswd/" -i $SETTINGS
secret_key=$(openssl rand -base64 64 | tr -d "\n" | sed "s/....$//" | sed "s:/:|:g")
sed "s/BABAR3_SECRET_KEY/$secret_key/" -i $SETTINGS
sed "s/^DEBUG.*/DEBUG = False/" -i $SETTINGS
echo "ALLOWED_HOSTS = [\".$domain\"]" >> $SETTINGS
cat <<- EOF >> $SETTINGS
# Settings for production
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
EOF


twitter_secret=$TARGET_DIR/back/babar_twitter/SECRETS.json
if [ ! -f $twitter_secret ]; then
	cat <<- EOF | sudo tee $twitter_secret
	{ "consumer": { "key": "consumer key", "secret": "consumer secret" }, "access": { "key": "access key", "secret": "access secret" } }
	EOF
	sudo chown $USER:$USER $TARGET_DIR/back/babar_twitter/SECRETS.json
	sudo chmod 400 $TARGET_DIR/back/babar_twitter/SECRETS.json
fi


cd $TARGET_DIR/front
sudo npm install -g npm
sudo npm install -g grunt-cli bower yo generator-karma generator-angular
sudo npm install
bower install
grunt build


cd $TARGET_DIR/back
virtualenv -p python3 env
source env/bin/activate
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py collectstatic
python3 manage.py check --deploy


cd $TARGET_DIR/conf

target=/etc/nginx/nginx.conf
sudo cp nginx.conf $target
sudo sed "s:_TARGET_DIR:$TARGET_DIR:g" -i $target
sudo sed "s:_USER:$USER:g" -i $target
sudo mkdir -p /etc/nginx/ssl
[ ! -h /etc/nginx/ssl/nginx.key -a ! -f /etc/nginx/ssl/nginx.key ] && sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx.key -out /etc/nginx/ssl/nginx.crt
sudo nginx

target=/etc/systemd/system/gunicorn.service
sudo cp gunicorn.service $target
sudo sed "s:_TARGET_DIR:$TARGET_DIR:g" -i $target
sudo sed "s:_USER:$USER:g" -i $target
sudo systemctl enable gunicorn
sudo systemctl start gunicorn


echo "Deployment successful!"
