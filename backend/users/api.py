from ninja import Router, Schema
from ninja.security import HttpBearer
from typing import List, Optional
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db import models as django_models
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

router = Router()


# Schemas
class UserSchema(Schema):
    id: int
    email: str
    username: str
    full_name: str
    bio: str
    location: str
    skills: List[str]
    experience: str
    availability: str
    role: str
    github_url: str
    linkedin_url: str
    portfolio_url: str
    profile_picture: Optional[str] = None


class UserCreateSchema(Schema):
    email: str
    username: str
    password: str
    full_name: str


class UserUpdateSchema(Schema):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[str] = None
    availability: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None


class LoginSchema(Schema):
    email: str
    password: str


class TokenSchema(Schema):
    access: str
    refresh: str


class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        from rest_framework_simplejwt.tokens import AccessToken
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            user = User.objects.get(id=user_id)
            print(f"AuthBearer: Authenticated user {user.username} (ID: {user.id})")
            return user
        except Exception as e:
            print(f"AuthBearer: Authentication failed - {str(e)}")
            return None


# Authentication endpoints
@router.post("/register", response=UserSchema, auth=None)
def register(request, data: UserCreateSchema):
    """Register a new user"""
    user = User.objects.create_user(
        email=data.email,
        username=data.username,
        password=data.password,
        full_name=data.full_name
    )
    return user


@router.post("/login", response=TokenSchema, auth=None)
def login(request, data: LoginSchema):
    """Login and get JWT tokens"""
    user = authenticate(username=data.email, password=data.password)
    if user is None:
        # Try with email as username
        try:
            user_obj = User.objects.get(email=data.email)
            user = authenticate(username=user_obj.username, password=data.password)
        except User.DoesNotExist:
            return router.create_response(
                request,
                {"detail": "Invalid credentials"},
                status=401
            )
    
    if user is None:
        return router.create_response(
            request,
            {"detail": "Invalid credentials"},
            status=401
        )
    
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


# User endpoints
@router.get("/me", response=UserSchema, auth=AuthBearer())
def get_current_user(request):
    """Get current authenticated user"""
    return request.auth


@router.get("/search", response=List[UserSchema], auth=None)
def search_users(request, q: str = "", skills: str = "", availability: str = ""):
    """Search users by name, skills, or availability"""
    # Exclude admin, superuser, and staff users
    users = User.objects.filter(is_staff=False, is_superuser=False)
    
    if q:
        users = users.filter(
            django_models.Q(full_name__icontains=q) |
            django_models.Q(username__icontains=q) |
            django_models.Q(bio__icontains=q)
        )
    
    if skills:
        skill_list = skills.split(',')
        for skill in skill_list:
            users = users.filter(skills__contains=skill.strip())
    
    if availability:
        users = users.filter(availability=availability)
    
    return list(users[:50])  # Limit to 50 results


@router.get("/{user_id}", response=UserSchema, auth=None)
def get_user(request, user_id: int):
    """Get user by ID"""
    user = get_object_or_404(User, id=user_id)
    return user


@router.put("/me", response=UserSchema, auth=AuthBearer())
def update_profile(request, data: UserUpdateSchema):
    """Update current user's profile"""
    user = request.auth
    
    for attr, value in data.dict(exclude_unset=True).items():
        setattr(user, attr, value)
    
    user.save()
    return user


@router.get("/", response=List[UserSchema], auth=None)
def list_users(request, limit: int = 20, offset: int = 0):
    """List all users with pagination"""
    users = User.objects.all()[offset:offset + limit]
    return list(users)
