from ninja import Router, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from django.db import models as django_models
from users.api import AuthBearer
from .models import Hackathon, HackathonRegistration

router = Router()


# Schemas
class HackathonSchema(Schema):
    id: int
    name: str
    description: str
    category: str
    mode: str
    status: str
    start_date: str
    end_date: str
    location: str
    prize: str
    max_participants: int
    participant_count: int
    website_url: str
    registration_url: str


class HackathonCreateSchema(Schema):
    name: str
    description: str
    category: str
    mode: str
    start_date: str
    end_date: str
    location: str
    prize: Optional[str] = ""
    max_participants: int = 500


# Hackathon endpoints
@router.get("/", response=List[HackathonSchema], auth=None)
def list_hackathons(request, category: str = "", mode: str = "", status: str = "", limit: int = 20, offset: int = 0):
    """List all hackathons with filters"""
    hackathons = Hackathon.objects.all()
    
    if category:
        hackathons = hackathons.filter(category=category)
    
    if mode:
        hackathons = hackathons.filter(mode=mode)
    
    if status:
        hackathons = hackathons.filter(status=status)
    
    hackathons_list = hackathons[offset:offset + limit]
    
    return [
        {
            'id': h.id,
            'name': h.name,
            'description': h.description,
            'category': h.category,
            'mode': h.mode,
            'status': h.status,
            'start_date': h.start_date.isoformat() if hasattr(h.start_date, 'isoformat') else str(h.start_date),
            'end_date': h.end_date.isoformat() if hasattr(h.end_date, 'isoformat') else str(h.end_date),
            'location': h.location,
            'prize': h.prize,
            'max_participants': h.max_participants,
            'participant_count': h.participant_count,
            'website_url': h.website_url or '',
            'registration_url': h.registration_url or '',
        }
        for h in hackathons_list
    ]


@router.get("/search", response=List[HackathonSchema], auth=None)
def search_hackathons(request, q: str = ""):
    """Search hackathons by name or description"""
    hackathons = Hackathon.objects.all()
    
    if q:
        hackathons = hackathons.filter(
            django_models.Q(name__icontains=q) |
            django_models.Q(description__icontains=q) |
            django_models.Q(location__icontains=q)
        )
    
    hackathons_list = hackathons[:50]
    
    return [
        {
            'id': h.id,
            'name': h.name,
            'description': h.description,
            'category': h.category,
            'mode': h.mode,
            'status': h.status,
            'start_date': h.start_date.isoformat() if hasattr(h.start_date, 'isoformat') else str(h.start_date),
            'end_date': h.end_date.isoformat() if hasattr(h.end_date, 'isoformat') else str(h.end_date),
            'location': h.location,
            'prize': h.prize,
            'max_participants': h.max_participants,
            'participant_count': h.participant_count,
            'website_url': h.website_url or '',
            'registration_url': h.registration_url or '',
        }
        for h in hackathons_list
    ]


@router.get("/{hackathon_id}", response=HackathonSchema, auth=None)
def get_hackathon(request, hackathon_id: int):
    """Get hackathon details"""
    hackathon = get_object_or_404(Hackathon, id=hackathon_id)
    return {
        'id': hackathon.id,
        'name': hackathon.name,
        'description': hackathon.description,
        'category': hackathon.category,
        'mode': hackathon.mode,
        'status': hackathon.status,
        'start_date': hackathon.start_date.isoformat() if hasattr(hackathon.start_date, 'isoformat') else str(hackathon.start_date),
        'end_date': hackathon.end_date.isoformat() if hasattr(hackathon.end_date, 'isoformat') else str(hackathon.end_date),
        'location': hackathon.location,
        'prize': hackathon.prize,
        'max_participants': hackathon.max_participants,
        'participant_count': hackathon.participant_count,
        'website_url': hackathon.website_url or '',
        'registration_url': hackathon.registration_url or '',
    }


@router.post("/{hackathon_id}/register", auth=AuthBearer())
def register_for_hackathon(request, hackathon_id: int):
    """Register for a hackathon"""
    hackathon = get_object_or_404(Hackathon, id=hackathon_id)
    
    # Check if already registered
    existing = HackathonRegistration.objects.filter(
        hackathon=hackathon,
        user=request.auth
    ).first()
    
    if existing:
        return router.create_response(
            request,
            {"detail": "Already registered for this hackathon"},
            status=400
        )
    
    # Check if hackathon is full
    if hackathon.participant_count >= hackathon.max_participants:
        return router.create_response(
            request,
            {"detail": "Hackathon is full"},
            status=400
        )
    
    HackathonRegistration.objects.create(
        hackathon=hackathon,
        user=request.auth
    )
    
    return {"success": True}


@router.delete("/{hackathon_id}/unregister", auth=AuthBearer())
def unregister_from_hackathon(request, hackathon_id: int):
    """Unregister from a hackathon"""
    hackathon = get_object_or_404(Hackathon, id=hackathon_id)
    
    registration = get_object_or_404(
        HackathonRegistration,
        hackathon=hackathon,
        user=request.auth
    )
    
    registration.delete()
    return {"success": True}


@router.get("/my-registrations", response=List[HackathonSchema], auth=AuthBearer())
def get_my_registrations(request):
    """Get all hackathons the current user is registered for"""
    registrations = HackathonRegistration.objects.filter(
        user=request.auth
    ).select_related('hackathon')
    
    return [
        {
            'id': r.hackathon.id,
            'name': r.hackathon.name,
            'description': r.hackathon.description,
            'category': r.hackathon.category,
            'mode': r.hackathon.mode,
            'status': r.hackathon.status,
            'start_date': r.hackathon.start_date.isoformat() if hasattr(r.hackathon.start_date, 'isoformat') else str(r.hackathon.start_date),
            'end_date': r.hackathon.end_date.isoformat() if hasattr(r.hackathon.end_date, 'isoformat') else str(r.hackathon.end_date),
            'location': r.hackathon.location,
            'prize': r.hackathon.prize,
            'max_participants': r.hackathon.max_participants,
            'participant_count': r.hackathon.participant_count,
            'website_url': r.hackathon.website_url or '',
            'registration_url': r.hackathon.registration_url or '',
        }
        for r in registrations
    ]
