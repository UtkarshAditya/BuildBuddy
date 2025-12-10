@echo off
echo Creating virtual environment...
python -m venv venv

echo.
echo Activating virtual environment...
call venv\Scripts\activate

echo.
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created. Please update it with your settings.
) else (
    echo .env file already exists.
)

echo.
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo.
echo Setup complete!
echo.
echo To create a superuser, run:
echo python manage.py createsuperuser
echo.
echo To start the server, run:
echo python manage.py runserver
