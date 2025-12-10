# BuildBuddy Backend

Django backend API using Django Ninja

## Quick Start

Run the setup script:

```bash
setup.bat
```

Then create a superuser:

```bash
python manage.py createsuperuser
```

Start the server:

```bash
python manage.py runserver
```

API Documentation: http://localhost:8000/api/docs

## Manual Setup

1. Create virtual environment: `python -m venv venv`
2. Activate: `venv\Scripts\activate`
3. Install: `pip install -r requirements.txt`
4. Copy .env: `copy .env.example .env`
5. Migrate: `python manage.py migrate`
6. Run: `python manage.py runserver`
