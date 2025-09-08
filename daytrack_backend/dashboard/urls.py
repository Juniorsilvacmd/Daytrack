from django.urls import path, include
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.index, name='index'),
    path('login-redirect/', views.login_redirect_view, name='login_redirect'),
    path('logout/', views.logout_view, name='logout'),
    path('users/', views.users_list, name='users_list'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:user_id>/edit/', views.edit_user, name='edit_user'),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete_user'),
    path('users/<int:user_id>/activate/', views.activate_user, name='activate_user'),
    path('users/<int:user_id>/deactivate/', views.deactivate_user, name='deactivate_user'),
]