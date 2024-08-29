from functools import wraps
from django.shortcuts import redirect

from aplikacija.models import Administracija


def custom_login_required(view_func=None, login_url=None):
    def decorator(view_func1):
        @wraps(view_func1)
        def _wrapped_view(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return redirect(login_url)
            return view_func1(request, *args, **kwargs)

        return _wrapped_view

    if view_func:
        return decorator(view_func)
    return decorator

def admin_login_required(view_func=None, login_url=None):
    def decorator(view_func1):
        @wraps(view_func1)
        def _wrapped_view(request, *args, **kwargs):


            if not request.user.is_authenticated:
                return redirect(login_url)
            email = request.user.email
            if not Administracija.objects.filter(mail=email, admin=True):
                return redirect(login_url)
            return view_func1(request, *args, **kwargs)

        return _wrapped_view

    if view_func:
        return decorator(view_func)
    return decorator
def mod_login_required(view_func=None, login_url=None):
    def decorator(view_func1):
        @wraps(view_func1)
        def _wrapped_view(request, *args, **kwargs):


            if not request.user.is_authenticated:
                return redirect(login_url)
            email = request.user.email
            if not Administracija.objects.filter(mail=email):
                return redirect(login_url)
            return view_func1(request, *args, **kwargs)

        return _wrapped_view

    if view_func:
        return decorator(view_func)
    return decorator
