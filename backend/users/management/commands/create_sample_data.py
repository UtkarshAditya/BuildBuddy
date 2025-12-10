"""
Django management command to create sample data for BuildBuddy
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from hackathons.models import Hackathon
from teams.models import Team, TeamMembership
from datetime import datetime, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates sample data for BuildBuddy'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # Create users
        users_data = [
            {
                'email': 'sarah.chen@example.com',
                'username': 'sarahchen',
                'password': 'password123',
                'full_name': 'Sarah Chen',
                'bio': 'Full-stack developer passionate about AI and ML.',
                'location': 'San Francisco, CA',
                'skills': ['Python', 'React', 'TensorFlow', 'Node.js'],
                'experience': 'intermediate',
                'availability': 'available',
                'github_url': 'https://github.com/sarahchen',
                'linkedin_url': 'https://linkedin.com/in/sarahchen',
            },
            {
                'email': 'marcus.johnson@example.com',
                'username': 'marcusj',
                'password': 'password123',
                'full_name': 'Marcus Johnson',
                'bio': 'UI/UX designer with a passion for creating beautiful user experiences.',
                'location': 'New York, NY',
                'skills': ['Figma', 'UI/UX Design', 'Prototyping', 'User Research'],
                'experience': 'intermediate',
                'availability': 'looking',
                'portfolio_url': 'https://marcusj.design',
            },
            {
                'email': 'alex.rodriguez@example.com',
                'username': 'alexr',
                'password': 'password123',
                'full_name': 'Alex Rodriguez',
                'bio': 'Backend engineer specializing in scalable systems.',
                'location': 'Austin, TX',
                'skills': ['Java', 'Spring Boot', 'Kubernetes', 'PostgreSQL'],
                'experience': 'advanced',
                'availability': 'available',
                'github_url': 'https://github.com/alexr',
            },
            {
                'email': 'priya.patel@example.com',
                'username': 'priyap',
                'password': 'password123',
                'full_name': 'Priya Patel',
                'bio': 'Data scientist exploring the intersection of AI and healthcare.',
                'location': 'Boston, MA',
                'skills': ['Python', 'PyTorch', 'Data Analysis', 'R'],
                'experience': 'intermediate',
                'availability': 'busy',
            },
            {
                'email': 'david.kim@example.com',
                'username': 'davidk',
                'password': 'password123',
                'full_name': 'David Kim',
                'bio': 'Mobile developer building the next generation of apps.',
                'location': 'Seattle, WA',
                'skills': ['Swift', 'React Native', 'Flutter', 'iOS'],
                'experience': 'advanced',
                'availability': 'looking',
                'github_url': 'https://github.com/davidk',
            },
            {
                'email': 'emma.wilson@example.com',
                'username': 'emmaw',
                'password': 'password123',
                'full_name': 'Emma Wilson',
                'bio': 'Frontend developer with an eye for design.',
                'location': 'Los Angeles, CA',
                'skills': ['React', 'TypeScript', 'CSS', 'Next.js'],
                'experience': 'beginner',
                'availability': 'available',
                'portfolio_url': 'https://emmawilson.dev',
            },
        ]

        created_users = []
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data['username'],
                    'full_name': user_data['full_name'],
                    'bio': user_data['bio'],
                    'location': user_data['location'],
                    'skills': user_data['skills'],
                    'experience': user_data['experience'],
                    'availability': user_data['availability'],
                    'github_url': user_data.get('github_url', ''),
                    'linkedin_url': user_data.get('linkedin_url', ''),
                    'portfolio_url': user_data.get('portfolio_url', ''),
                }
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(f'Created user: {user.username}')
            created_users.append(user)

        # Create hackathons
        now = datetime.now()
        hackathons_data = [
            {
                'name': 'AI Innovation Challenge 2024',
                'description': 'Build the next generation of AI applications.',
                'category': 'AI/ML',
                'mode': 'hybrid',
                'status': 'upcoming',
                'start_date': now + timedelta(days=30),
                'end_date': now + timedelta(days=32),
                'location': 'San Francisco, CA',
                'prize': '$50,000',
                'max_participants': 500,
            },
            {
                'name': 'Web3 Summit Hackathon',
                'description': 'Decentralized apps for the future.',
                'category': 'Blockchain',
                'mode': 'remote',
                'status': 'registration',
                'start_date': now + timedelta(days=45),
                'end_date': now + timedelta(days=47),
                'location': 'Virtual',
                'prize': '$30,000',
                'max_participants': 300,
            },
            {
                'name': 'HealthTech Innovators',
                'description': 'Technology solutions for healthcare challenges.',
                'category': 'Healthcare',
                'mode': 'in-person',
                'status': 'registration',
                'start_date': now + timedelta(days=60),
                'end_date': now + timedelta(days=62),
                'location': 'Boston, MA',
                'prize': '$40,000',
                'max_participants': 200,
            },
        ]

        created_hackathons = []
        for hack_data in hackathons_data:
            hackathon, created = Hackathon.objects.get_or_create(
                name=hack_data['name'],
                defaults=hack_data
            )
            if created:
                self.stdout.write(f'Created hackathon: {hackathon.name}')
            created_hackathons.append(hackathon)

        # Create teams
        teams_data = [
            {
                'name': 'AI Pioneers',
                'description': 'Building intelligent solutions for real-world problems.',
                'category': 'AI/ML',
                'hackathon': created_hackathons[0],
                'lead': created_users[0],  # Sarah
                'required_skills': ['Python', 'TensorFlow', 'React'],
                'open_positions': 2,
            },
            {
                'name': 'DeFi Dragons',
                'description': 'Creating the future of decentralized finance.',
                'category': 'Blockchain',
                'hackathon': created_hackathons[1],
                'lead': created_users[2],  # Alex
                'required_skills': ['Solidity', 'Web3.js', 'React'],
                'open_positions': 3,
            },
            {
                'name': 'HealthHub',
                'description': 'Patient-centered healthcare platform.',
                'category': 'Healthcare',
                'hackathon': created_hackathons[2],
                'lead': created_users[3],  # Priya
                'required_skills': ['Python', 'React', 'Data Analysis'],
                'open_positions': 1,
            },
        ]

        for team_data in teams_data:
            team, created = Team.objects.get_or_create(
                name=team_data['name'],
                defaults=team_data
            )
            if created:
                # Add lead as member
                TeamMembership.objects.get_or_create(
                    team=team,
                    user=team_data['lead'],
                    defaults={'role': 'leader', 'status': 'accepted'}
                )
                self.stdout.write(f'Created team: {team.name}')

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
