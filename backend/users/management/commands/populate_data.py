"""
Management command to populate the database with dummy data
Usage: python manage.py populate_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hackathons.models import Hackathon
from teams.models import Team, TeamMembership
from datetime import datetime, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Populates database with dummy users, hackathons, and teams'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating dummy data...\n')

        # Create Users
        users_data = [
            {
                'email': 'sarah.chen@example.com',
                'username': 'sarah_chen',
                'password': 'Demo123!',
                'full_name': 'Sarah Chen',
                'experience': 'Full Stack Developer',
                'bio': 'Passionate about building scalable web applications. Love hackathons!',
                'skills': ['React', 'Node.js', 'Python', 'MongoDB'],
                'github_url': 'https://github.com/sarachen',
                'linkedin_url': 'https://linkedin.com/in/sarachen',
                'location': 'San Francisco, CA'
            },
            {
                'email': 'alex.kumar@example.com',
                'username': 'alex_kumar',
                'password': 'Demo123!',
                'full_name': 'Alex Kumar',
                'experience': 'UI/UX Designer',
                'bio': 'Designer focused on creating intuitive user experiences',
                'skills': ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
                'github_url': 'https://github.com/alexkumar',
                'linkedin_url': 'https://linkedin.com/in/alexkumar',
                'location': 'New York, NY'
            },
            {
                'email': 'jordan.m@example.com',
                'username': 'jordan_martinez',
                'password': 'Demo123!',
                'full_name': 'Jordan Martinez',
                'experience': 'Backend Developer',
                'bio': 'Backend specialist with cloud deployment experience',
                'skills': ['Django', 'PostgreSQL', 'AWS', 'Docker'],
                'github_url': 'https://github.com/jordanm',
                'linkedin_url': 'https://linkedin.com/in/jordanmartinez',
                'location': 'Austin, TX'
            },
            {
                'email': 'emily.watson@example.com',
                'username': 'emily_watson',
                'password': 'Demo123!',
                'full_name': 'Emily Watson',
                'experience': 'Data Scientist',
                'bio': 'ML enthusiast looking to build AI-powered solutions',
                'skills': ['Python', 'Machine Learning', 'TensorFlow', 'Pandas'],
                'github_url': 'https://github.com/emilywatson',
                'linkedin_url': 'https://linkedin.com/in/emilywatson',
                'location': 'Seattle, WA'
            },
            {
                'email': 'michael.lee@example.com',
                'username': 'michael_lee',
                'password': 'Demo123!',
                'full_name': 'Michael Lee',
                'experience': 'Mobile Developer',
                'bio': 'Mobile-first developer, experienced in cross-platform apps',
                'skills': ['React Native', 'Flutter', 'iOS', 'Android'],
                'github_url': 'https://github.com/michaellee',
                'linkedin_url': 'https://linkedin.com/in/michaellee',
                'location': 'Los Angeles, CA'
            }
        ]

        created_users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['username'],
                    'full_name': user_data['full_name'],
                    'experience': user_data['experience'],
                    'bio': user_data['bio'],
                    'skills': user_data['skills'],
                    'github_url': user_data['github_url'],
                    'linkedin_url': user_data['linkedin_url'],
                    'location': user_data['location'],
                    'availability': 'looking'
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                created_users.append(user)
                self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user.email}'))
            else:
                created_users.append(user)
                self.stdout.write(self.style.WARNING(f'○ User already exists: {user.email}'))

        # Create Hackathons
        hackathons_data = [
            {
                'name': 'AI Innovation Challenge 2025',
                'description': 'Build cutting-edge AI solutions to solve real-world problems. Join innovators from around the world to create the next generation of intelligent applications.',
                'start_date': datetime.now() + timedelta(days=35),
                'end_date': datetime.now() + timedelta(days=37),
                'location': 'San Francisco, CA',
                'mode': 'in-person',
                'category': 'ai_ml',
                'status': 'registration_open',
                'max_participants': 500,
                'prize': '$10,000 in prizes',
                'website_url': 'https://aiinnovation.com',
                'registration_url': 'https://aiinnovation.com/register'
            },
            {
                'name': 'Green Tech Hackathon',
                'description': 'Create sustainable technology solutions for environmental challenges. Focus on renewable energy, waste reduction, and climate action.',
                'start_date': datetime.now() + timedelta(days=70),
                'end_date': datetime.now() + timedelta(days=72),
                'location': 'Virtual',
                'mode': 'remote',
                'category': 'other',
                'status': 'upcoming',
                'max_participants': 1000,
                'prize': '$5,000 in prizes',
                'website_url': 'https://greentech.com',
                'registration_url': 'https://greentech.com/register'
            },
            {
                'name': 'HealthTech Summit',
                'description': 'Develop innovative healthcare technology applications. Improve patient care, medical diagnostics, and health monitoring systems.',
                'start_date': datetime.now() + timedelta(days=90),
                'end_date': datetime.now() + timedelta(days=92),
                'location': 'Boston, MA',
                'mode': 'hybrid',
                'category': 'healthtech',
                'status': 'registration_open',
                'max_participants': 300,
                'prize': '$15,000 in prizes',
                'website_url': 'https://healthtechsummit.com',
                'registration_url': 'https://healthtechsummit.com/register'
            }
        ]

        created_hackathons = []
        for hack_data in hackathons_data:
            hackathon, created = Hackathon.objects.get_or_create(
                name=hack_data['name'],
                defaults=hack_data
            )
            if created:
                created_hackathons.append(hackathon)
                self.stdout.write(self.style.SUCCESS(f'✓ Created hackathon: {hackathon.name}'))
            else:
                created_hackathons.append(hackathon)
                self.stdout.write(self.style.WARNING(f'○ Hackathon already exists: {hackathon.name}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Dummy data population complete!'))
        self.stdout.write(self.style.SUCCESS(f'Created {len(created_users)} users'))
        self.stdout.write(self.style.SUCCESS(f'Created {len(created_hackathons)} hackathons'))
