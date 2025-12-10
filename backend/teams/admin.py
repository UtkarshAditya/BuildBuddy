from django.contrib import admin
from .models import Team, TeamMembership, TeamTask


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'hackathon', 'lead', 'member_count', 'open_positions', 'created_at')
    list_filter = ('category', 'hackathon')
    search_fields = ('name', 'description', 'lead__username')
    ordering = ('-created_at',)


@admin.register(TeamMembership)
class TeamMembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'team', 'role', 'status', 'joined_at')
    list_filter = ('role', 'status')
    search_fields = ('user__username', 'team__name')
    ordering = ('-joined_at',)


@admin.register(TeamTask)
class TeamTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'team', 'assigned_to', 'created_by', 'status', 'priority', 'due_date', 'created_at')
    list_filter = ('status', 'priority', 'team')
    search_fields = ('title', 'description', 'team__name')
    ordering = ('-created_at',)

