from ninja import Router, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from django.db import models as django_models
from users.api import AuthBearer
from .models import Team, TeamMembership, TeamTask
from users.models import User

router = Router()


# Test endpoint
@router.get("/test", auth=None)
def test_endpoint(request):
    """Test endpoint to verify API is working"""
    return {"status": "ok", "message": "Teams API is working"}


@router.post("/test-invite", auth=None)
def test_invite_endpoint(request):
    """Test POST endpoint"""
    print("=== TEST INVITE ENDPOINT CALLED ===")
    return {"status": "ok", "message": "POST is working"}


@router.get("/myteams", auth=None)
def get_my_teams_new(request):
    """Get all teams the current user is a member of - NEW VERSION"""
    import traceback
    try:
        print(f"=== GET /myteams called ===")
        
        # Check if user is authenticated
        from users.api import AuthBearer
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '').strip()
        
        if not token:
            print("ERROR: No token provided!")
            return []
        
        auth = AuthBearer()
        user = auth.authenticate(request, token)
        
        if not user:
            print("ERROR: Authentication failed!")
            return []
        
        print(f"User ID: {user.id}, Username: {user.username}")
        
        memberships = TeamMembership.objects.filter(
            user=user,
            status='accepted'
        ).select_related('team__hackathon', 'team__lead')
        
        print(f"Found {memberships.count()} memberships")
        
        result = []
        for membership in memberships:
            team = membership.team
            team_data = {
                'id': team.id,
                'name': team.name,
                'description': team.description,
                'category': team.category,
                'hackathon_name': team.hackathon.name if team.hackathon else 'No Hackathon',
                'lead_name': team.lead.full_name or team.lead.username,
                'lead_id': team.lead.id,
                'role': membership.role,  # Add the user's role in this team
                'required_skills': team.required_skills,
                'open_positions': team.open_positions,
                'member_count': team.member_count,
                'created_at': team.created_at.isoformat(),
            }
            result.append(team_data)
            print(f"Added team: {team.name}, Role: {membership.role}")
        
        print(f"Returning {len(result)} teams")
        return result
    except Exception as e:
        print(f"ERROR in get_my_teams_new: {str(e)}")
        print(traceback.format_exc())
        return []


# Schemas
class TeamMemberSchema(Schema):
    id: int
    username: str
    full_name: str
    role: str
    status: str


class TeamSchema(Schema):
    id: int
    name: str
    description: str
    category: str
    hackathon_name: str
    lead_name: str
    required_skills: List[str]
    open_positions: int
    member_count: int
    created_at: str


class TeamDetailSchema(TeamSchema):
    lead_id: int
    members: List[TeamMemberSchema]


class TeamCreateSchema(Schema):
    name: str
    description: str
    hackathon: Optional[str] = None
    lookingFor: Optional[List[str]] = None
    maxMembers: Optional[str] = "4"


class TeamUpdateSchema(Schema):
    name: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    open_positions: Optional[int] = None


class ApplicationSchema(Schema):
    team_id: int
    message: Optional[str] = None


class TeamInviteSchema(Schema):
    team_id: int
    user_id: int
    message: Optional[str] = None


class InviteResponseSchema(Schema):
    id: int
    team_id: int
    team_name: str
    inviter_id: int
    inviter_name: str
    role: str
    message: Optional[str]
    time_ago: str
    created_at: str


class JoinRequestSchema(Schema):
    id: int
    team_id: int
    team_name: str
    user_id: int
    status: str
    message: Optional[str]
    time_ago: str
    created_at: str


class TaskCreateSchema(Schema):
    title: str
    description: Optional[str] = ""
    assigned_to_id: Optional[int] = None
    status: Optional[str] = "todo"
    priority: Optional[str] = "medium"
    color: Optional[str] = "#3B82F6"
    due_date: Optional[str] = None


class TaskUpdateSchema(Schema):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to_id: Optional[int] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    color: Optional[str] = None
    due_date: Optional[str] = None


# Team endpoints
@router.get("/", response=List[TeamSchema], auth=None)
def list_teams(request, category: str = "", hackathon_id: int = None, limit: int = 20, offset: int = 0):
    """List all teams with filters"""
    teams = Team.objects.select_related('hackathon', 'lead').all()
    
    if category:
        teams = teams.filter(category=category)
    
    if hackathon_id:
        teams = teams.filter(hackathon_id=hackathon_id)
    
    teams = teams[offset:offset + limit]
    
    return [
        {
            'id': team.id,
            'name': team.name,
            'description': team.description,
            'category': team.category,
            'hackathon_name': team.hackathon.name,
            'lead_name': team.lead.full_name or team.lead.username,
            'required_skills': team.required_skills,
            'open_positions': team.open_positions,
            'member_count': team.member_count,
            'created_at': team.created_at.isoformat(),
        }
        for team in teams
    ]


@router.get("/search", response=List[TeamSchema], auth=None)
def search_teams(request, q: str = "", skills: str = ""):
    """Search teams by name or skills"""
    teams = Team.objects.select_related('hackathon', 'lead').all()
    
    if q:
        teams = teams.filter(
            django_models.Q(name__icontains=q) |
            django_models.Q(description__icontains=q)
        )
    
    if skills:
        skill_list = skills.split(',')
        for skill in skill_list:
            teams = teams.filter(required_skills__contains=skill.strip())
    
    teams = teams[:50]
    
    return [
        {
            'id': team.id,
            'name': team.name,
            'description': team.description,
            'category': team.category,
            'hackathon_name': team.hackathon.name,
            'lead_name': team.lead.full_name or team.lead.username,
            'required_skills': team.required_skills,
            'open_positions': team.open_positions,
            'member_count': team.member_count,
            'created_at': team.created_at.isoformat(),
        }
        for team in teams
    ]


@router.post("/invite", auth=None)
def invite_to_team(request):
    """Invite a user to join a team"""
    from users.api import AuthBearer
    from django.http import JsonResponse
    
    print("=== INVITE ENDPOINT CALLED ===")
    print(f"Request method: {request.method}")
    print(f"Request path: {request.path}")
    print(f"Content-Type: {request.headers.get('Content-Type')}")
    
    try:
        # Get the raw body
        raw_body = request.body
        print(f"Raw body: {raw_body}")
        
        # Parse request body
        import json
        body = json.loads(raw_body)
        team_id = body.get('team_id')
        user_id = body.get('user_id')
        
        print(f"Parsed data: team_id={team_id}, user_id={user_id}")
        
        # Manual authentication
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '').strip()
        
        if not token:
            print("ERROR: No token")
            return JsonResponse({"error": "Authentication required"}, status=401)
        
        auth = AuthBearer()
        current_user = auth.authenticate(request, token)
        
        if not current_user:
            print("ERROR: Invalid token")
            return JsonResponse({"error": "Invalid authentication"}, status=401)
        
        print(f"Authenticated user: {current_user.username}")
        
        team = get_object_or_404(Team, id=team_id)
        user = get_object_or_404(User, id=user_id)
        
        print(f"Team: {team.name}, User to invite: {user.username}")
        
        # Check if requester is team lead or member
        membership = TeamMembership.objects.filter(
            team=team,
            user=current_user,
            status='accepted'
        ).first()
        
        if not membership:
            print("ERROR: User not a team member")
            return JsonResponse({"error": "You must be a team member to invite users"}, status=403)
        
        print(f"Membership found: {membership.role}")
        
        # Check if user already has a membership
        existing = TeamMembership.objects.filter(
            team=team,
            user=user
        ).first()
        
        if existing:
            print(f"Found existing membership with status: {existing.status}")
            
            # If user sent a join request (pending), convert it to an invite
            if existing.status == 'pending':
                print("Converting pending join request to invite")
                existing.status = 'invited'
                existing.save()
                print(f"Converted to invite: {existing.id}")
                return {"success": True, "invite_id": existing.id, "message": "Join request converted to invite"}
            
            # If already invited or accepted, return error
            elif existing.status == 'invited':
                print("ERROR: User already invited")
                return JsonResponse({"error": "User has already been invited to this team"}, status=400)
            elif existing.status == 'accepted':
                print("ERROR: User already a member")
                return JsonResponse({"error": "User is already a member of this team"}, status=400)
            elif existing.status == 'rejected':
                print("User previously rejected, creating new invite")
                # Allow re-inviting if previously rejected
                existing.status = 'invited'
                existing.save()
                print(f"Re-invited user: {existing.id}")
                return {"success": True, "invite_id": existing.id, "message": "User re-invited"}
        
        # Create invite
        invite = TeamMembership.objects.create(
            team=team,
            user=user,
            status='invited',
            role='member'
        )
        
        print(f"Invite created successfully: {invite.id}")
        return {"success": True, "invite_id": invite.id}
        
    except json.JSONDecodeError as e:
        print(f"JSON DECODE ERROR: {str(e)}")
        return JsonResponse({"error": "Invalid JSON in request body"}, status=400)
    except Exception as e:
        print(f"EXCEPTION in invite_to_team: {str(e)}")
        print(f"Exception type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return JsonResponse({"error": f"Internal server error: {str(e)}"}, status=500)


@router.get("/invites", auth=None)
def get_my_invites(request):
    """Get all team invites for the current user"""
    from django.utils import timezone
    from datetime import timedelta
    from users.api import AuthBearer
    
    # Manual authentication
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return []
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    if not user:
        return []
    
    invites = TeamMembership.objects.filter(
        user=user,
        status='invited'
    ).select_related('team__lead', 'team__hackathon')
    
    def get_time_ago(dt):
        now = timezone.now()
        diff = now - dt
        if diff < timedelta(minutes=1):
            return "just now"
        elif diff < timedelta(hours=1):
            mins = int(diff.total_seconds() / 60)
            return f"{mins} minute{'s' if mins != 1 else ''} ago"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff < timedelta(days=30):
            days = diff.days
            return f"{days} day{'s' if days != 1 else ''} ago"
        else:
            return dt.strftime("%b %d, %Y")
    
    return [
        {
            'id': invite.id,
            'team_id': invite.team.id,
            'team_name': invite.team.name,
            'inviter_id': invite.team.lead.id,
            'inviter_name': invite.team.lead.full_name or invite.team.lead.username,
            'role': invite.role,
            'status': invite.status,
            'viewed': invite.viewed,
            'message': f"Join our team for {invite.team.hackathon.name if invite.team.hackathon else 'a hackathon'}!",
            'time_ago': get_time_ago(invite.joined_at),
            'created_at': invite.joined_at.isoformat(),
        }
        for invite in invites
    ]


@router.post("/invites/mark-viewed", auth=None)
def mark_invites_as_viewed(request):
    """Mark all invites as viewed for the current user"""
    from users.api import AuthBearer
    
    # Manual authentication
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    
    if not token:
        return {"error": "Authentication required"}, 401
    
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    
    if not user:
        return {"error": "Invalid authentication"}, 401
    
    # Mark all invited memberships as viewed
    updated_count = TeamMembership.objects.filter(
        user=user,
        status='invited',
        viewed=False
    ).update(viewed=True)
    
    return {"success": True, "updated_count": updated_count}


@router.get("/join-requests", auth=None)
def get_my_join_requests(request):
    """Get all join requests sent by the current user"""
    from django.utils import timezone
    from datetime import timedelta
    from users.api import AuthBearer
    
    # Manual authentication
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return []
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    if not user:
        return []
    
    requests_qs = TeamMembership.objects.filter(
        user=user,
        status__in=['pending', 'accepted', 'rejected']
    ).select_related('team').exclude(role='leader')
    
    def get_time_ago(dt):
        now = timezone.now()
        diff = now - dt
        if diff < timedelta(minutes=1):
            return "just now"
        elif diff < timedelta(hours=1):
            mins = int(diff.total_seconds() / 60)
            return f"{mins} minute{'s' if mins != 1 else ''} ago"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff < timedelta(days=30):
            days = diff.days
            return f"{days} day{'s' if days != 1 else ''} ago"
        else:
            return dt.strftime("%b %d, %Y")
    
    return [
        {
            'id': req.id,
            'team_id': req.team.id,
            'team_name': req.team.name,
            'user_id': user.id,
            'status': req.status,
            'message': f"I'd like to join your team!",
            'time_ago': get_time_ago(req.joined_at),
            'created_at': req.joined_at.isoformat(),
        }
        for req in requests_qs
    ]


@router.post("/accept-invite/{invite_id}", auth=None)
def accept_invite(request, invite_id: int):
    """Accept a team invite"""
    from users.api import AuthBearer
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return {"error": "Authentication required"}, 401
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    if not user:
        return {"error": "Invalid authentication"}, 401
    
    invite = get_object_or_404(TeamMembership, id=invite_id, user=user, status='invited')
    invite.status = 'accepted'
    invite.save()
    return {"success": True}


@router.post("/reject-invite/{invite_id}", auth=None)
def reject_invite(request, invite_id: int):
    """Reject a team invite"""
    from users.api import AuthBearer
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return {"error": "Authentication required"}, 401
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    if not user:
        return {"error": "Invalid authentication"}, 401
    
    invite = get_object_or_404(TeamMembership, id=invite_id, user=user, status='invited')
    invite.status = 'rejected'
    invite.save()
    return {"success": True}


# ==================== TEAM TASKS ENDPOINTS ====================

@router.get("/{team_id}/tasks", auth=None)
def get_team_tasks(request, team_id: int):
    """Get all tasks for a team"""
    import traceback
    try:
        print(f"=== GET /teams/{team_id}/tasks called ===")
        from users.api import AuthBearer
        
        # Manual authentication
        auth_header = request.headers.get('Authorization', '')
        token = auth_header.replace('Bearer ', '').strip()
        if not token:
            print("ERROR: No token")
            return []
        
        auth = AuthBearer()
        user = auth.authenticate(request, token)
        if not user:
            print("ERROR: Invalid token")
            return []
        
        print(f"User: {user.id} - {user.username}")
        
        team = get_object_or_404(Team, id=team_id)
        print(f"Team: {team.id} - {team.name}")
        
        # Verify user is a member of the team
        membership = TeamMembership.objects.filter(
            team=team,
            user=user,
            status='accepted'
        ).first()
        
        print(f"Membership: {membership}")
        print(f"Team lead: {team.lead.id}")
        
        if not membership and team.lead != user:
            print("ERROR: User not a member")
            return []
        
        tasks = TeamTask.objects.filter(team=team).select_related('assigned_to', 'created_by')
        print(f"Found {tasks.count()} tasks")
        
        result = []
        for task in tasks:
            try:
                task_dict = {
                    'id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'status': task.status,
                    'priority': task.priority,
                    'color': task.color,
                    'assigned_to_id': task.assigned_to.id if task.assigned_to else None,
                    'assigned_to_name': task.assigned_to.full_name or task.assigned_to.username if task.assigned_to else None,
                    'created_by_id': task.created_by.id,
                    'created_by_name': task.created_by.full_name or task.created_by.username,
                    'due_date': task.due_date.isoformat() if task.due_date else None,
                    'created_at': task.created_at.isoformat(),
                    'updated_at': task.updated_at.isoformat(),
                }
                result.append(task_dict)
            except Exception as task_error:
                print(f"Error processing task {task.id}: {str(task_error)}")
                print(traceback.format_exc())
        
        print(f"Returning {len(result)} tasks")
        return result
    except Exception as e:
        print(f"ERROR in get_team_tasks: {str(e)}")
        print(traceback.format_exc())
        return []


@router.post("/{team_id}/tasks", auth=None)
def create_team_task(request, team_id: int, data: TaskCreateSchema):
    """Create a new task for a team"""
    from users.api import AuthBearer
    from datetime import datetime
    
    # Manual authentication
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return {"error": "Authentication required"}, 401
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    if not user:
        return {"error": "Invalid authentication"}, 401
    
    team = get_object_or_404(Team, id=team_id)
    
    # Verify user is the team lead or a member
    membership = TeamMembership.objects.filter(
        team=team,
        user=user,
        status='accepted'
    ).first()
    
    if not membership and team.lead != user:
        return {"error": "You are not a member of this team"}, 403
    
    assigned_to = None
    if data.assigned_to_id:
        assigned_to = get_object_or_404(User, id=data.assigned_to_id)
        # Verify assigned user is a team member
        assigned_membership = TeamMembership.objects.filter(
            team=team,
            user=assigned_to,
            status='accepted'
        ).first()
        if not assigned_membership and team.lead != assigned_to:
            return {"error": "Assigned user is not a team member"}, 400
    
    due_date = None
    if data.due_date:
        try:
            due_date = datetime.fromisoformat(data.due_date.replace('Z', '+00:00'))
        except:
            pass
    
    task = TeamTask.objects.create(
        team=team,
        title=data.title,
        description=data.description or '',
        assigned_to=assigned_to,
        created_by=user,
        status=data.status or 'todo',
        priority=data.priority or 'medium',
        due_date=due_date,
    )
    
    return {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'priority': task.priority,
        'color': task.color,
        'assigned_to_id': task.assigned_to.id if task.assigned_to else None,
        'assigned_to_name': task.assigned_to.full_name or task.assigned_to.username if task.assigned_to else None,
        'created_by_id': task.created_by.id,
        'created_by_name': task.created_by.full_name or task.created_by.username,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat(),
    }


@router.put("/{team_id}/tasks/{task_id}", auth=None)
def update_team_task(request, team_id: int, task_id: int, data: TaskUpdateSchema):
    """Update a team task"""
    from users.api import AuthBearer
    from datetime import datetime
    
    # Manual authentication
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return {"error": "Authentication required"}, 401
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    if not user:
        return {"error": "Invalid authentication"}, 401
    
    team = get_object_or_404(Team, id=team_id)
    task = get_object_or_404(TeamTask, id=task_id, team=team)
    
    # Verify user is a team member
    membership = TeamMembership.objects.filter(
        team=team,
        user=user,
        status='accepted'
    ).first()
    
    if not membership and team.lead != user:
        return {"error": "You are not a member of this team"}, 403
    
    if data.title is not None:
        task.title = data.title
    if data.description is not None:
        task.description = data.description
    if data.status is not None:
        task.status = data.status
    if data.priority is not None:
        task.priority = data.priority
    if data.assigned_to_id is not None:
        if data.assigned_to_id:
            assigned_to = get_object_or_404(User, id=data.assigned_to_id)
            assigned_membership = TeamMembership.objects.filter(
                team=team,
                user=assigned_to,
                status='accepted'
            ).first()
            if not assigned_membership and team.lead != assigned_to:
                return {"error": "Assigned user is not a team member"}, 400
            task.assigned_to = assigned_to
        else:
            task.assigned_to = None
    if data.due_date is not None:
        if data.due_date:
            try:
                task.due_date = datetime.fromisoformat(data.due_date.replace('Z', '+00:00'))
            except:
                pass
        else:
            task.due_date = None
    
    task.save()
    
    return {
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'status': task.status,
        'priority': task.priority,
        'color': task.color,
        'assigned_to_id': task.assigned_to.id if task.assigned_to else None,
        'assigned_to_name': task.assigned_to.full_name or task.assigned_to.username if task.assigned_to else None,
        'created_by_id': task.created_by.id,
        'created_by_name': task.created_by.full_name or task.created_by.username,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'created_at': task.created_at.isoformat(),
        'updated_at': task.updated_at.isoformat(),
    }


@router.delete("/{team_id}/tasks/{task_id}", auth=None)
def delete_team_task(request, team_id: int, task_id: int):
    """Delete a team task"""
    from users.api import AuthBearer
    
    # Manual authentication
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return {"error": "Authentication required"}, 401
    auth = AuthBearer()
    user = auth.authenticate(request, token)
    if not user:
        return {"error": "Invalid authentication"}, 401
    
    team = get_object_or_404(Team, id=team_id)
    task = get_object_or_404(TeamTask, id=task_id, team=team)
    
    # Only team lead or task creator can delete
    if team.lead != user and task.created_by != user:
        return {"error": "Only team lead or task creator can delete tasks"}, 403
    
    task.delete()
    return {"success": True}


@router.get("/{team_id}", response=TeamDetailSchema, auth=None)
def get_team(request, team_id: int):
    """Get team details with members"""
    team = get_object_or_404(
        Team.objects.select_related('hackathon', 'lead').prefetch_related('memberships__user'),
        id=team_id
    )
    
    members = [
        {
            'id': m.user.id,
            'username': m.user.username,
            'full_name': m.user.full_name or m.user.username,
            'role': m.role,
            'status': m.status,
        }
        for m in team.memberships.filter(status='accepted')
    ]
    
    return {
        'id': team.id,
        'name': team.name,
        'description': team.description,
        'category': team.category,
        'hackathon_name': team.hackathon.name,
        'lead_id': team.lead.id,
        'lead_name': team.lead.full_name or team.lead.username,
        'required_skills': team.required_skills,
        'open_positions': team.open_positions,
        'member_count': team.member_count,
        'created_at': team.created_at.isoformat(),
        'members': members,
    }


@router.post("/", response=TeamSchema, auth=AuthBearer())
def create_team(request, data: TeamCreateSchema):
    """Create a new team"""
    from hackathons.models import Hackathon
    import traceback
    
    try:
        # Get or create a default hackathon for teams without specific hackathon
        hackathon = None
        if data.hackathon:
            # Try to find hackathon by name
            hackathon = Hackathon.objects.filter(name__icontains=data.hackathon).first()
    
        # If no hackathon specified or not found, use/create a default one
        if not hackathon:
            from django.utils import timezone
            hackathon, _ = Hackathon.objects.get_or_create(
                name="General Teams",
                defaults={
                    'description': 'Teams not associated with a specific hackathon',
                    'category': 'other',
                    'mode': 'remote',
                    'status': 'registration_open',
                    'start_date': timezone.now(),
                    'end_date': timezone.now() + timezone.timedelta(days=365),
                    'location': 'Online',
                    'prize': '',
                    'max_participants': 10000,
                    'website_url': '',
                    'registration_url': ''
                }
            )
        
        max_members = int(data.maxMembers) if data.maxMembers else 4
        
        team = Team.objects.create(
            name=data.name,
            description=data.description,
            category='other',
            hackathon=hackathon,
            lead=request.auth,
            required_skills=data.lookingFor or [],
            open_positions=max_members - 1,  # Subtract 1 for the leader
        )
        
        # Add leader as a member
        TeamMembership.objects.create(
            team=team,
            user=request.auth,
            role='leader',
            status='accepted'
        )
        
        return {
            'id': team.id,
            'name': team.name,
            'description': team.description,
            'category': team.category,
            'hackathon_name': team.hackathon.name,
            'lead_name': team.lead.full_name or team.lead.username,
            'required_skills': team.required_skills,
            'open_positions': team.open_positions,
            'member_count': team.member_count,
            'created_at': team.created_at.isoformat(),
        }
    except Exception as e:
        print(f"Error creating team: {str(e)}")
        print(traceback.format_exc())
        raise


@router.put("/{team_id}", response=TeamSchema, auth=AuthBearer())
def update_team(request, team_id: int, data: TeamUpdateSchema):
    """Update team (only by team lead)"""
    team = get_object_or_404(Team, id=team_id)
    
    if team.lead != request.auth:
        return router.create_response(
            request,
            {"detail": "Only team lead can update team"},
            status=403
        )
    
    for attr, value in data.dict(exclude_unset=True).items():
        setattr(team, attr, value)
    
    team.save()
    
    return {
        'id': team.id,
        'name': team.name,
        'description': team.description,
        'category': team.category,
        'hackathon_name': team.hackathon.name,
        'lead_name': team.lead.full_name or team.lead.username,
        'required_skills': team.required_skills,
        'open_positions': team.open_positions,
        'member_count': team.member_count,
        'created_at': team.created_at.isoformat(),
    }


@router.delete("/{team_id}", auth=AuthBearer())
def delete_team(request, team_id: int):
    """Delete team (only by team lead)"""
    team = get_object_or_404(Team, id=team_id)
    
    if team.lead != request.auth:
        return router.create_response(
            request,
            {"detail": "Only team lead can delete team"},
            status=403
        )
    
    team.delete()
    return {"success": True}


@router.post("/apply", auth=AuthBearer())
def apply_to_team(request, data: ApplicationSchema):
    """Apply to join a team"""
    team = get_object_or_404(Team, id=data.team_id)
    
    # Check if already applied or member
    existing = TeamMembership.objects.filter(
        team=team,
        user=request.auth
    ).first()
    
    if existing:
        return router.create_response(
            request,
            {"detail": "You have already applied to this team"},
            status=400
        )
    
    membership = TeamMembership.objects.create(
        team=team,
        user=request.auth,
        status='pending'
    )
    
    return {"success": True, "status": "pending"}


@router.post("/{team_id}/accept/{user_id}", auth=AuthBearer())
def accept_member(request, team_id: int, user_id: int):
    """Accept a team member application (only by team lead)"""
    team = get_object_or_404(Team, id=team_id)
    
    if team.lead != request.auth:
        return router.create_response(
            request,
            {"detail": "Only team lead can accept members"},
            status=403
        )
    
    membership = get_object_or_404(
        TeamMembership,
        team=team,
        user_id=user_id,
        status='pending'
    )
    
    membership.status = 'accepted'
    membership.save()
    
    return {"success": True}


@router.post("/{team_id}/reject/{user_id}", auth=AuthBearer())
def reject_member(request, team_id: int, user_id: int):
    """Reject a team member application (only by team lead)"""
    team = get_object_or_404(Team, id=team_id)
    
    if team.lead != request.auth:
        return router.create_response(
            request,
            {"detail": "Only team lead can reject members"},
            status=403
        )
    
    membership = get_object_or_404(
        TeamMembership,
        team=team,
        user_id=user_id,
        status='pending'
    )
    
    membership.status = 'rejected'
    membership.save()
    
    return {"success": True}


@router.get("/my-teams")
def get_my_teams(request):
    """Get all teams the current user is a member of"""
    import traceback
    try:
        print(f"=== GET /my-teams called ===")
        print(f"Request auth: {request.auth}")
        
        # Check if user is authenticated
        from users.api import AuthBearer
        auth = AuthBearer()
        user = auth.authenticate(request, request.headers.get('Authorization', '').replace('Bearer ', ''))
        
        if not user:
            print("ERROR: No authenticated user!")
            return {"error": "Authentication required"}, 401
        
        print(f"User ID: {user.id}")
        
        memberships = TeamMembership.objects.filter(
            user=user,
            status='accepted'
        ).select_related('team__hackathon', 'team__lead')
        
        print(f"Found {memberships.count()} memberships")
        
        teams = [m.team for m in memberships]
        
        result = []
        for team in teams:
            team_data = {
                'id': team.id,
                'name': team.name,
                'description': team.description,
                'category': team.category,
                'hackathon_name': team.hackathon.name if team.hackathon else 'No Hackathon',
                'lead_name': team.lead.full_name or team.lead.username,
                'required_skills': team.required_skills,
                'open_positions': team.open_positions,
                'member_count': team.member_count,
                'created_at': team.created_at.isoformat(),
            }
            result.append(team_data)
            print(f"Added team: {team.name}")
        
        print(f"Returning {len(result)} teams")
        return result
    except Exception as e:
        print(f"ERROR in get_my_teams: {str(e)}")
        print(traceback.format_exc())
        return {"error": str(e)}, 500
        raise


@router.post("/request-join/{user_id}", auth=None)
def request_to_join_team(request, user_id: int):
    """Request to join a user's team"""
    from users.api import AuthBearer
    
    # Manual authentication
    auth_header = request.headers.get('Authorization', '')
    token = auth_header.replace('Bearer ', '').strip()
    if not token:
        return router.create_response(request, {"detail": "Authentication required"}, status=401)
    
    try:
        auth_bearer = AuthBearer()
        user = auth_bearer.authenticate(request, token)
        if not user:
            return router.create_response(request, {"detail": "Invalid token"}, status=401)
    except Exception as e:
        return router.create_response(request, {"detail": str(e)}, status=401)
    
    target_user = get_object_or_404(User, id=user_id)
    
    # Find teams where target_user is the leader
    teams = Team.objects.filter(lead=target_user)
    
    if not teams.exists():
        return router.create_response(
            request,
            {"detail": "User does not lead any teams"},
            status=404
        )
    
    # Get the first team (or we could let them choose)
    team = teams.first()
    
    # Check if already applied or member
    existing = TeamMembership.objects.filter(
        team=team,
        user=user
    ).first()
    
    if existing:
        return router.create_response(
            request,
            {"detail": "You already have a relationship with this team"},
            status=400
        )
    
    # Create join request
    membership = TeamMembership.objects.create(
        team=team,
        user=user,
        status='pending',
        role='member'
    )
    
    return {"success": True, "request_id": membership.id, "team_name": team.name}


