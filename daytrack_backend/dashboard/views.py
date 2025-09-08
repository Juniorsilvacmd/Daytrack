from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.http import JsonResponse, HttpResponseForbidden
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .forms import UserForm

User = get_user_model()

def is_admin_user(user):
    """Check if user is admin/staff"""
    return user.is_authenticated and user.is_staff

def login_redirect_view(request):
    """Redirect users based on their role"""
    # If user is already authenticated, redirect appropriately
    if request.user.is_authenticated:
        if request.user.is_staff:
            return redirect('dashboard:index')
        else:
            # Redirect regular users to frontend
            return redirect('/')  # This will redirect to frontend
    
    # If not authenticated, redirect to frontend login
    return redirect('/')

@login_required
def logout_view(request):
    """Logout view"""
    logout(request)
    messages.info(request, 'Você saiu do sistema.')
    return redirect('dashboard:login_redirect')

@login_required
@user_passes_test(is_admin_user)
def index(request):
    """Dashboard main page"""
    # Get statistics
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    inactive_users = total_users - active_users
    
    # Recent users
    recent_users = User.objects.order_by('-created_at')[:5]
    
    # Users by month (last 6 months)
    six_months_ago = timezone.now() - timedelta(days=180)
    users_by_month = User.objects.filter(
        created_at__gte=six_months_ago
    ).extra(select={
        'month': "EXTRACT(month FROM created_at)",
        'year': "EXTRACT(year FROM created_at)"
    }).values('month', 'year').annotate(count=Count('id')).order_by('year', 'month')
    
    context = {
        'total_users': total_users,
        'active_users': active_users,
        'inactive_users': inactive_users,
        'recent_users': recent_users,
        'users_by_month': list(users_by_month),
    }
    
    return render(request, 'dashboard/index.html', context)

@login_required
@user_passes_test(is_admin_user)
def users_list(request):
    """List all users"""
    users = User.objects.all().order_by('-created_at')
    return render(request, 'dashboard/users/list.html', {'users': users})

@login_required
@user_passes_test(is_admin_user)
def create_user(request):
    """Create a new user"""
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])
            user.save()
            messages.success(request, f'Usuário {user.username} criado com sucesso!')
            return redirect('dashboard:users_list')
    else:
        form = UserForm()
    
    return render(request, 'dashboard/users/form.html', {'form': form, 'action': 'Criar'})

@login_required
@user_passes_test(is_admin_user)
def edit_user(request, user_id):
    """Edit an existing user"""
    user = get_object_or_404(User, id=user_id)
    
    if request.method == 'POST':
        form = UserForm(request.POST, instance=user)
        if form.is_valid():
            user = form.save(commit=False)
            # Only update password if provided
            if form.cleaned_data['password']:
                user.set_password(form.cleaned_data['password'])
            user.save()
            messages.success(request, f'Usuário {user.username} atualizado com sucesso!')
            return redirect('dashboard:users_list')
    else:
        form = UserForm(instance=user)
    
    return render(request, 'dashboard/users/form.html', {
        'form': form, 
        'action': 'Editar',
        'user_obj': user
    })

@login_required
@user_passes_test(is_admin_user)
def delete_user(request, user_id):
    """Delete a user"""
    user = get_object_or_404(User, id=user_id)
    
    if request.method == 'POST':
        username = user.username
        user.delete()
        messages.success(request, f'Usuário {username} excluído com sucesso!')
        return redirect('dashboard:users_list')
    
    return render(request, 'dashboard/users/confirm_delete.html', {'user': user})

@login_required
@user_passes_test(is_admin_user)
def activate_user(request, user_id):
    """Activate a user"""
    user = get_object_or_404(User, id=user_id)
    user.is_active = True
    user.save()
    messages.success(request, f'Usuário {user.username} ativado com sucesso!')
    return redirect('dashboard:users_list')

@login_required
@user_passes_test(is_admin_user)
def deactivate_user(request, user_id):
    """Deactivate a user"""
    user = get_object_or_404(User, id=user_id)
    user.is_active = False
    user.save()
    messages.success(request, f'Usuário {user.username} desativado com sucesso!')
    return redirect('dashboard:users_list')