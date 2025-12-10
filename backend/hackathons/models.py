from django.db import models
from django.conf import settings


class Hackathon(models.Model):
    MODE_CHOICES = [
        ('in-person', 'In-person'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    ]
    
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('registration_open', 'Registration Open'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    CATEGORY_CHOICES = [
        ('ai_ml', 'AI/ML'),
        ('web3', 'Web3'),
        ('healthtech', 'HealthTech'),
        ('cloud', 'Cloud'),
        ('spacetech', 'Space Tech'),
        ('fintech', 'FinTech'),
        ('edtech', 'EdTech'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    mode = models.CharField(max_length=20, choices=MODE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=255)
    
    prize = models.CharField(max_length=255, blank=True)
    max_participants = models.IntegerField(default=500)
    
    website_url = models.URLField(blank=True)
    registration_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_date']
    
    def __str__(self):
        return self.name
    
    @property
    def participant_count(self):
        return self.registrations.count()


class HackathonRegistration(models.Model):
    hackathon = models.ForeignKey(
        Hackathon,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='hackathon_registrations'
    )
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['hackathon', 'user']
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.hackathon.name}"
