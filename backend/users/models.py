from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import URLValidator


class User(AbstractUser):
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('looking', 'Looking for Team'),
        ('busy', 'Busy'),
    ]
    
    # Basic Info
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255, blank=True)
    profile_picture = models.URLField(blank=True)  # URL to profile picture
    
    # Skills & Experience
    skills = models.JSONField(default=list, blank=True)  # List of skills
    experience = models.CharField(max_length=255, blank=True)
    availability = models.CharField(
        max_length=20, 
        choices=AVAILABILITY_CHOICES, 
        default='available'
    )
    
    # Social Links
    github_url = models.URLField(blank=True, validators=[URLValidator()])
    linkedin_url = models.URLField(blank=True, validators=[URLValidator()])
    portfolio_url = models.URLField(blank=True, validators=[URLValidator()])
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    @property
    def role(self):
        """Get primary role from skills or return 'Developer'"""
        if not self.skills:
            return 'Developer'
        role_keywords = {
            'UI/UX Design': 'UI/UX Designer',
            'Machine Learning': 'ML Engineer',
            'Blockchain': 'Blockchain Developer',
            'Mobile Dev': 'Mobile Developer',
            'DevOps': 'DevOps Engineer',
            'React': 'Frontend Developer',
            'Node.js': 'Backend Developer',
            'Python': 'Backend Developer',
        }
        for skill in self.skills:
            if skill in role_keywords:
                return role_keywords[skill]
        return 'Developer'
