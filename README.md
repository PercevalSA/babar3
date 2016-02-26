# Babar3

## Installation
### Back
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

### Front
- Make sure you have `nodejs`, and `npm`.
- Run the following commands:
```bash
cd front
npm install -g grunt-cli bower yo generator-karma generator-angular
bower install
grunt serve
```
At this point you should be able to access a local server providing the website.


## Testing
### Back
Run `python3 manage.py test`.

### Front
Run `grunt test`.


## Deployment
Go through both installation phases.
### Back

### Front
Run `grunt` to build.


## Documentation
### Back
- [Django](https://www.djangoproject.com/)
- [Django REST framework](http://www.django-rest-framework.org/)
- [Django REST auth](https://django-rest-auth.readthedocs.org)

### Front
- [Yeoman: generator-angular](https://github.com/yeoman/generator-angular)
- [Angular](https://docs.angularjs.org/)
- [Angular Material Design](https://material.angularjs.org/latest/)


## TODO
- Make the website responsive
- Add a filter to the API for purchases and payments
- Handle automatic server logouts
- Deal with case when adding objects
- Add more tests
- Attach transactions to an owner
