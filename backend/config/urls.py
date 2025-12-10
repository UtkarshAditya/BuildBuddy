"""
URL configuration for BuildBuddy project.
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from ninja import NinjaAPI
from users.api import router as users_router
from teams.api import router as teams_router
from hackathons.api import router as hackathons_router
from messages_app.api import router as messages_router

# Create the main API instance
api = NinjaAPI(
    title="BuildBuddy API",
    version="1.0.0",
    description="API for BuildBuddy - Hackathon Team Building Platform"
)

# Add routers
api.add_router("/users/", users_router)
api.add_router("/teams/", teams_router)
api.add_router("/hackathons/", hackathons_router)
api.add_router("/messages/", messages_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
