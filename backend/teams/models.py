from django.db import models
from django.conf import settings


class Team(models.Model):
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
    hackathon = models.ForeignKey(
        'hackathons.Hackathon', 
        on_delete=models.CASCADE, 
        related_name='teams'
    )
    lead = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='led_teams'
    )
    required_skills = models.JSONField(default=list)
    open_positions = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    @property
    def member_count(self):
        return self.memberships.filter(status='accepted').count()


class TeamMembership(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('invited', 'Invited'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    
    ROLE_CHOICES = [
        ('leader', 'Leader'),
        ('member', 'Member'),
    ]
    
    team = models.ForeignKey(
        Team, 
        on_delete=models.CASCADE, 
        related_name='memberships'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='team_memberships'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    joined_at = models.DateTimeField(auto_now_add=True)
    viewed = models.BooleanField(default=False)  # Track if invite has been viewed
    
    class Meta:
        unique_together = ['team', 'user']
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.team.name}"


class TeamTask(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tasks'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tasks'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    color = models.CharField(max_length=7, default='#3B82F6', blank=True)  # Hex color code
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.team.name}"

