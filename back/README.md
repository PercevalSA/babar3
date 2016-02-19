# Babar3

## Installation

- Make sure you have `mysql-server`, `python3`, and `virtualenv`
- Create your MySQL database
- Fill in the database info in `settings.py`
- Run the following:
```bash
virtualenv env
source env/bin/activate
pip3 install django djangorestframework mysqlclient
python3 manage.py migrate
python3 manage.py runserver
```
At this point, you should be able to access the local development server.

If you encounter MySQL errors, check user permissions and password settings in the MySQL console.

To exit virtualenv, use `deactivate`.
