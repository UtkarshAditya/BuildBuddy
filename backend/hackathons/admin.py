from django.contrib import admin
from .models import Hackathon, HackathonRegistration


@admin.register(Hackathon)
class HackathonAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'mode', 'status', 'start_date', 'location', 'participant_count')
    list_filter = ('category', 'mode', 'status')
    search_fields = ('name', 'description', 'location')
    ordering = ('start_date',)


@admin.register(HackathonRegistration)
class HackathonRegistrationAdmin(admin.ModelAdmin):
    list_display = ('user', 'hackathon', 'registered_at')
    list_filter = ('hackathon',)
    search_fields = ('user__username', 'hackathon__name')
    ordering = ('-registered_at',)
