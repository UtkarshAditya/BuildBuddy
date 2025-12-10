from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'full_name', 'is_staff', 'availability')
    list_filter = ('is_staff', 'is_superuser', 'availability')
    search_fields = ('email', 'username', 'full_name')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('full_name', 'bio', 'location', 'skills', 'experience', 
                      'availability', 'github_url', 'linkedin_url', 'portfolio_url', 
                      'profile_picture')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Profile Information', {
            'fields': ('full_name', 'email')
        }),
    )
