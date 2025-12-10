from ninja import Router, Schema
from typing import List, Optional
from django.shortcuts import get_object_or_404
from django.db.models import Q, Max
from users.api import AuthBearer
from .models import Conversation, Message
from users.models import User

router = Router()


# Schemas
class MessageSchema(Schema):
    id: int
    sender_id: int
    sender_name: str
    content: str
    is_read: bool
    created_at: str


class ConversationSchema(Schema):
    id: int
    participants: List[int]
    participant_names: List[str]
    last_message: Optional[str] = None
    unread_count: int
    updated_at: str
    is_group_chat: bool = False
    team_id: Optional[int] = None
    team_name: Optional[str] = None


class ConversationDetailSchema(ConversationSchema):
    messages: List[MessageSchema]


class SendMessageSchema(Schema):
    recipient_id: int
    content: str


class SendMessageToConversationSchema(Schema):
    content: str


# Message endpoints
@router.get("/conversations", response=List[ConversationSchema], auth=AuthBearer())
def list_conversations(request):
    """List all conversations for the current user"""
    conversations = Conversation.objects.filter(
        participants=request.auth
    ).prefetch_related('participants', 'messages', 'team')
    
    result = []
    for conv in conversations:
        participants = conv.participants.all()
        participant_ids = [p.id for p in participants]
        participant_names = [p.full_name or p.username for p in participants]
        
        last_msg = conv.last_message
        last_message_text = last_msg.content if last_msg else None
        
        unread_count = conv.messages.filter(
            ~Q(sender=request.auth),
            is_read=False
        ).count()
        
        result.append({
            'id': conv.id,
            'participants': participant_ids,
            'participant_names': participant_names,
            'last_message': last_message_text,
            'unread_count': unread_count,
            'updated_at': conv.updated_at.isoformat(),
            'is_group_chat': conv.team is not None,
            'team_id': conv.team.id if conv.team else None,
            'team_name': conv.team.name if conv.team else None,
        })
    
    return result


@router.get("/conversations/{conversation_id}", response=ConversationDetailSchema, auth=AuthBearer())
def get_conversation(request, conversation_id: int):
    """Get conversation details with messages"""
    conversation = get_object_or_404(
        Conversation.objects.prefetch_related('participants', 'messages__sender'),
        id=conversation_id
    )
    
    # Check if user is participant
    if request.auth not in conversation.participants.all():
        return router.create_response(
            request,
            {"detail": "You are not a participant in this conversation"},
            status=403
        )
    
    # Mark messages as read
    conversation.messages.filter(~Q(sender=request.auth)).update(is_read=True)
    
    participants = conversation.participants.all()
    messages = conversation.messages.all()
    
    return {
        'id': conversation.id,
        'participants': [p.id for p in participants],
        'participant_names': [p.full_name or p.username for p in participants],
        'last_message': messages[0].content if messages else None,
        'unread_count': 0,  # All read now
        'updated_at': conversation.updated_at.isoformat(),
        'messages': [
            {
                'id': m.id,
                'sender_id': m.sender.id,
                'sender_name': m.sender.full_name or m.sender.username,
                'content': m.content,
                'is_read': m.is_read,
                'created_at': m.created_at.isoformat(),
            }
            for m in reversed(messages)  # Oldest first for display
        ]
    }


@router.post("/send", auth=AuthBearer())
def send_message(request, data: SendMessageSchema):
    """Send a message to a user (creates conversation if needed)"""
    recipient = get_object_or_404(User, id=data.recipient_id)
    
    # Find or create conversation (exclude team conversations)
    conversation = Conversation.objects.filter(
        participants=request.auth,
        team__isnull=True  # Only get direct message conversations
    ).filter(
        participants=recipient
    ).first()
    
    if not conversation:
        conversation = Conversation.objects.create()
        conversation.participants.add(request.auth, recipient)
    
    message = Message.objects.create(
        conversation=conversation,
        sender=request.auth,
        content=data.content
    )
    
    # Update conversation timestamp
    conversation.save()
    
    return {
        'id': message.id,
        'sender_id': message.sender.id,
        'sender_name': message.sender.full_name or message.sender.username,
        'content': message.content,
        'is_read': message.is_read,
        'created_at': message.created_at.isoformat(),
    }


@router.post("/conversations/{conversation_id}/send", auth=AuthBearer())
def send_message_to_conversation(request, conversation_id: int, data: SendMessageToConversationSchema):
    """Send a message to an existing conversation"""
    conversation = get_object_or_404(Conversation, id=conversation_id)
    
    # Check if user is participant
    if request.auth not in conversation.participants.all():
        return router.create_response(
            request,
            {"detail": "You are not a participant in this conversation"},
            status=403
        )
    
    message = Message.objects.create(
        conversation=conversation,
        sender=request.auth,
        content=data.content
    )
    
    # Update conversation timestamp
    conversation.save()
    
    return {
        'id': message.id,
        'sender_id': message.sender.id,
        'sender_name': message.sender.full_name or message.sender.username,
        'content': message.content,
        'is_read': message.is_read,
        'created_at': message.created_at.isoformat(),
    }


@router.get("/unread-count", auth=AuthBearer())
def get_unread_count(request):
    """Get total unread message count"""
    count = Message.objects.filter(
        conversation__participants=request.auth
    ).filter(
        ~Q(sender=request.auth),
        is_read=False
    ).count()
    
    return {"unread_count": count}


@router.get("/team/{team_id}/conversation", response=ConversationDetailSchema, auth=AuthBearer())
def get_team_conversation(request, team_id: int):
    """Get or create team group chat conversation"""
    from teams.models import Team, TeamMembership
    
    # Check if user is team member
    team = get_object_or_404(Team, id=team_id)
    membership = TeamMembership.objects.filter(
        team=team,
        user=request.auth,
        status='accepted'
    ).first()
    
    if not membership:
        return router.create_response(
            request,
            {"detail": "You are not a member of this team"},
            status=403
        )
    
    # Get or create team conversation
    conversation = Conversation.objects.filter(team=team).first()
    
    if not conversation:
        # Create new team conversation
        conversation = Conversation.objects.create(team=team)
        # Add all team members as participants
        members = User.objects.filter(
            team_memberships__team=team,
            team_memberships__status='accepted'
        )
        conversation.participants.set(members)
    
    # Mark messages as read
    conversation.messages.filter(~Q(sender=request.auth)).update(is_read=True)
    
    participants = conversation.participants.all()
    messages = conversation.messages.all()
    
    return {
        'id': conversation.id,
        'participants': [p.id for p in participants],
        'participant_names': [p.full_name or p.username for p in participants],
        'last_message': messages[0].content if messages else None,
        'unread_count': 0,
        'updated_at': conversation.updated_at.isoformat(),
        'is_group_chat': True,
        'team_id': team.id,
        'team_name': team.name,
        'messages': [
            {
                'id': m.id,
                'sender_id': m.sender.id,
                'sender_name': m.sender.full_name or m.sender.username,
                'content': m.content,
                'is_read': m.is_read,
                'created_at': m.created_at.isoformat(),
            }
            for m in reversed(messages)
        ]
    }
