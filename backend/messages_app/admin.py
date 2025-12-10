from django.contrib import admin
from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_participants', 'created_at', 'updated_at')
    search_fields = ('participants__username',)
    ordering = ('-updated_at',)
    
    def get_participants(self, obj):
        return ', '.join([p.username for p in obj.participants.all()[:3]])
    get_participants.short_description = 'Participants'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'conversation', 'content_preview', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('sender__username', 'content')
    ordering = ('-created_at',)
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'
