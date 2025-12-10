from django.db import models
from django.conf import settings


class Conversation(models.Model):
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='conversations'
    )
    team = models.ForeignKey(
        'teams.Team',
        on_delete=models.CASCADE,
        related_name='conversations',
        null=True,
        blank=True,
        help_text='If set, this is a team group chat'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        if self.team:
            return f"Team Chat: {self.team.name}"
        participant_names = ', '.join([p.username for p in self.participants.all()[:3]])
        return f"Conversation: {participant_names}"
    
    @property
    def last_message(self):
        return self.messages.first()
    
    @property
    def is_group_chat(self):
        return self.team is not None


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"
