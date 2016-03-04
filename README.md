# Installation
## Back
- Make sure you have `mysql-server`, `python3`, and `virtualenv`
- Create your MySQL database
- Fill in the database info in `settings.py`
- Run the following commands:
```bash
cd back
virtualenv env
source env/bin/activate
pip3 install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```
At this point, you should be able to access to a local development server.
If you encounter MySQL errors, check user permissions and password settings in the MySQL console.
To exit virtualenv, use `deactivate`.

## Front
- Make sure you have `nodejs`, and `npm`.
- Run the following commands:
```bash
cd front
npm install -g grunt-cli bower yo generator-karma generator-angular
bower install
grunt serve
```
At this point you should be able to access a local server providing the website.


# Testing
## Back
Run `python3 manage.py test`.

## Front
Run `grunt test`.


# Migration
To migrate the old babar database to the new one:
- First get a JSON dump of the old DB
- Convert it with `migrate.py old.json`
- Import it in Django `python3 manage.py loaddata new.json`


# Deployment
First, go through both installation phases.
## Back
Read the [Django checklist](https://docs.djangoproject.com/en/1.9/howto/deployment/checklist/)
TODO: add here django checklist points (change secure key)
TODO: setup https cors

## Front
Run `grunt` to build.

## Setup the server
### Setup the Python interface
```bash
source back/env/bin/activate
gunicorn babar3:wsgi
```

### Setup the WWW interface
Make sure you have `nginx`, and use [this config](https://github.com/benoitc/gunicorn/blob/master/examples/nginx.conf).
In the config file, enable HTTPS.
```bash
sudo nginx -s reload
```


# Documentation
## Back
- [Django](https://www.djangoproject.com/)
- [Django REST framework](http://www.django-rest-framework.org/)
- [Django REST auth](https://django-rest-auth.readthedocs.org)

## Front
- [Yeoman: generator-angular](https://github.com/yeoman/generator-angular)
- [Angular](https://docs.angularjs.org/)
- [Angular Material Design](https://material.angularjs.org/latest/)
